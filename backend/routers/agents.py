from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request

from backend.auth import get_current_user
from backend.models.schemas import Agent, AgentCreate, AgentUpdate, ChatRequest, ChatResponse
from backend.services.agent_prompts import MemoryItem, build_system_prompt
from backend.services.openai_service import get_openai
from backend.services.supabase_service import get_supabase

router = APIRouter(prefix="/agents", tags=["agents"])


@router.get("", response_model=list[Agent])
async def list_agents(
    request: Request,
    user: dict[str, str] = Depends(get_current_user),
) -> list[Agent]:
    supabase = await get_supabase()
    result = (
        await supabase.table("agents")
        .select("*")
        .eq("user_id", user["id"])
        .order("position_index")
        .execute()
    )
    return [Agent(**row) for row in (result.data or [])]


@router.post("", response_model=Agent, status_code=201)
async def create_agent(
    payload: AgentCreate,
    request: Request,
    user: dict[str, str] = Depends(get_current_user),
) -> Agent:
    supabase = await get_supabase()

    # Get current agent count for position_index
    count_result = (
        await supabase.table("agents")
        .select("id", count="exact")
        .eq("user_id", user["id"])
        .execute()
    )
    position = count_result.count or 0

    insert_result = (
        await supabase.table("agents")
        .insert({
            "user_id": user["id"],
            "name": payload.name,
            "domain": payload.domain,
            "agent_type": payload.agent_type,
            "purpose": payload.purpose,
            "seed_answer_1": payload.seed_answer_1,
            "seed_answer_2": payload.seed_answer_2,
            "seed_answer_3": payload.seed_answer_3,
            "position_index": position,
        })
        .execute()
    )

    if not insert_result.data:
        raise HTTPException(status_code=500, detail="Failed to create agent")

    agent_row = insert_result.data[0]
    agent_id = agent_row["id"]

    # Seed initial memory from answers
    seed_items = [
        {"agent_id": agent_id, "user_id": user["id"], "content": f'You said: "{payload.seed_answer_1}"', "source": "seed"},
        {"agent_id": agent_id, "user_id": user["id"], "content": f'You said: "{payload.seed_answer_2}"', "source": "seed"},
        {"agent_id": agent_id, "user_id": user["id"], "content": f'You said: "{payload.seed_answer_3}"', "source": "seed"},
    ]
    await supabase.table("memory_items").insert(seed_items).execute()

    return Agent(**agent_row)


@router.get("/{agent_id}", response_model=Agent)
async def get_agent(
    agent_id: str,
    request: Request,
    user: dict[str, str] = Depends(get_current_user),
) -> Agent:
    supabase = await get_supabase()
    result = (
        await supabase.table("agents")
        .select("*")
        .eq("id", agent_id)
        .eq("user_id", user["id"])
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Agent not found")
    return Agent(**result.data)


@router.patch("/{agent_id}", response_model=Agent)
async def update_agent(
    agent_id: str,
    payload: AgentUpdate,
    request: Request,
    user: dict[str, str] = Depends(get_current_user),
) -> Agent:
    supabase = await get_supabase()
    updates = payload.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = (
        await supabase.table("agents")
        .update(updates)
        .eq("id", agent_id)
        .eq("user_id", user["id"])
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Agent not found")
    return Agent(**result.data[0])


@router.delete("/{agent_id}", status_code=204)
async def delete_agent(
    agent_id: str,
    request: Request,
    user: dict[str, str] = Depends(get_current_user),
) -> None:
    supabase = await get_supabase()
    await (
        supabase.table("agents")
        .delete()
        .eq("id", agent_id)
        .eq("user_id", user["id"])
        .execute()
    )


@router.post("/{agent_id}/chat", response_model=ChatResponse)
async def chat_with_agent(
    agent_id: str,
    payload: ChatRequest,
    request: Request,
    user: dict[str, str] = Depends(get_current_user),
) -> ChatResponse:
    supabase = await get_supabase()

    # Fetch agent (verify ownership)
    agent_result = (
        await supabase.table("agents")
        .select("*")
        .eq("id", agent_id)
        .eq("user_id", user["id"])
        .single()
        .execute()
    )
    if not agent_result.data:
        raise HTTPException(status_code=404, detail="Agent not found")

    agent = agent_result.data

    # Fetch memory for context injection
    memory_result = (
        await supabase.table("memory_items")
        .select("content, source")
        .eq("agent_id", agent_id)
        .eq("user_id", user["id"])
        .order("created_at", desc=True)
        .limit(25)
        .execute()
    )
    memory = [MemoryItem(content=m["content"], source=m["source"]) for m in (memory_result.data or [])]

    # Build domain-aware system prompt
    system_prompt = build_system_prompt(
        agent_type=agent["agent_type"],
        agent_name=agent["name"],
        purpose=agent["purpose"],
        memory=memory,
        capability=payload.capability,
    )

    # Call GPT-4o-mini
    openai_client = get_openai()
    completion = await openai_client.chat.completions.create(
        model="gpt-4o-mini",
        stream=False,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": payload.user_input},
        ],
        temperature=0.7,
        max_tokens=1500,
    )

    output_text = completion.choices[0].message.content or ""
    if not output_text:
        raise HTTPException(status_code=500, detail="No output generated")

    # Persist output card
    card_result = (
        await supabase.table("output_cards")
        .insert({
            "agent_id": agent_id,
            "user_id": user["id"],
            "capability": payload.capability,
            "user_input": payload.user_input,
            "output_text": output_text,
        })
        .execute()
    )
    card_id = card_result.data[0]["id"] if card_result.data else None

    # Update last_used_at
    await (
        supabase.table("agents")
        .update({"last_used_at": datetime.now(tz=timezone.utc).isoformat()})
        .eq("id", agent_id)
        .execute()
    )

    return ChatResponse(output=output_text, card_id=card_id)
