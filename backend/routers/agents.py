from __future__ import annotations

import json
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse

from backend.auth import get_current_user
from backend.models.schemas import Agent, AgentCreate, AgentUpdate, ChatRequest
from backend.services.agent_prompts import MemoryItem, build_system_prompt
from backend.services.openai_service import get_openai
from backend.services.supabase_service import get_supabase
from backend.tools.executor import ToolExecutor
from backend.tools.registry import get_tools_for_agent

router = APIRouter(prefix="/agents", tags=["agents"])


# ── CRUD ───────────────────────────────────────────────────────────────────

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
            "user_id":       user["id"],
            "name":          payload.name,
            "domain":        payload.domain,
            "agent_type":    payload.agent_type,
            "purpose":       payload.purpose,
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
    agent_id  = agent_row["id"]

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


# ── Chat — streaming SSE with tool-calling loop ────────────────────────────

@router.post("/{agent_id}/chat")
async def chat_with_agent(
    agent_id: str,
    payload: ChatRequest,
    request: Request,
    user: dict[str, str] = Depends(get_current_user),
) -> StreamingResponse:
    """
    Streaming SSE endpoint. Emits newline-delimited JSON events:
      {"type": "status",    "text": "..."}           — activity label
      {"type": "tool_start","tool": "...", "text": "..."} — tool called
      {"type": "tool_done", "tool": "...", "text": "..."} — tool result summary
      {"type": "delta",     "text": "..."}           — response text chunk
      {"type": "done",      "card_id": "..."}        — finished, card saved
      {"type": "error",     "text": "..."}           — something went wrong
    """
    supabase = await get_supabase()

    # Verify agent ownership
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

    # Fetch memory
    memory_result = (
        await supabase.table("memory_items")
        .select("content, source")
        .eq("agent_id", agent_id)
        .eq("user_id", user["id"])
        .order("created_at", desc=True)
        .limit(25)
        .execute()
    )
    memory = [
        MemoryItem(content=m["content"], source=m["source"])
        for m in (memory_result.data or [])
    ]

    # Fetch recent conversation history (last 20 turns)
    history_result = (
        await supabase.table("conversations")
        .select("role, content, tool_call_id, tool_name")
        .eq("agent_id", agent_id)
        .eq("user_id", user["id"])
        .order("created_at", desc=True)
        .limit(20)
        .execute()
    )
    history = list(reversed(history_result.data or []))

    # Which integrations does this user have connected?
    conn_result = (
        await supabase.table("oauth_connections")
        .select("provider")
        .eq("user_id", user["id"])
        .execute()
    )
    connected = {row["provider"] for row in (conn_result.data or [])}

    tools = get_tools_for_agent(agent["agent_type"], connected)

    async def event_stream():
        _ev = lambda d: f"data: {json.dumps(d)}\n\n"

        try:
            tool_names = [t["function"]["name"] for t in tools] if tools else []

            system_prompt = build_system_prompt(
                agent_type=agent["agent_type"],
                agent_name=agent["name"],
                purpose=agent["purpose"],
                memory=memory,
                capability=payload.capability,
                available_tools=tool_names,
            )

            # When tools exist and the request is clearly action-oriented,
            # force tool use on the first round so the agent acts, not asks.
            _INBOX_KEYWORDS = {"inbox", "email", "emails", "mail", "messages", "unread", "summarize", "handle"}
            user_words = set(payload.user_input.lower().split())
            force_tools = bool(tools) and bool(user_words & _INBOX_KEYWORDS)

            # Build message list: system + history + current user message
            messages: list[dict] = [{"role": "system", "content": system_prompt}]
            for h in history:
                if h["role"] == "tool":
                    messages.append({
                        "role": "tool",
                        "tool_call_id": h.get("tool_call_id", ""),
                        "name": h.get("tool_name", ""),
                        "content": h["content"],
                    })
                else:
                    messages.append({"role": h["role"], "content": h["content"]})
            messages.append({"role": "user", "content": payload.user_input})

            openai_client = get_openai()
            executor = ToolExecutor(user_id=user["id"], agent_id=agent_id)
            output_text = ""

            # ── Tool-calling loop (max 5 rounds) ──────────────────────────
            for _round in range(5):
                yield _ev({"type": "status", "text": "Thinking…"})

                completion = await openai_client.chat.completions.create(
                    model="gpt-4o",
                    messages=messages,
                    tools=tools if tools else None,
                    tool_choice=(
                        "required" if (tools and force_tools and _round == 0)
                        else ("auto" if tools else None)
                    ),
                    temperature=0.7,
                    max_tokens=2000,
                )

                msg = completion.choices[0].message

                # ── Model wants to call a tool ────────────────────────────
                if msg.tool_calls:
                    # Add assistant message with tool_calls to context
                    messages.append({
                        "role": "assistant",
                        "content": msg.content or "",
                        "tool_calls": [
                            {
                                "id": tc.id,
                                "type": "function",
                                "function": {
                                    "name": tc.function.name,
                                    "arguments": tc.function.arguments,
                                },
                            }
                            for tc in msg.tool_calls
                        ],
                    })

                    for tc in msg.tool_calls:
                        tool_name = tc.function.name
                        try:
                            args = json.loads(tc.function.arguments)
                        except json.JSONDecodeError:
                            args = {}

                        yield _ev({"type": "tool_start", "tool": tool_name, "text": f"Using {tool_name}…"})

                        result = await executor.execute(tool_name, args)

                        yield _ev({"type": "tool_done", "tool": tool_name, "text": result.summary})

                        # Log tool call for transparency
                        await supabase.table("tool_calls").insert({
                            "agent_id": agent_id,
                            "user_id": user["id"],
                            "tool_name": tool_name,
                            "arguments": args,
                            "result_summary": result.summary,
                            "success": True,
                        }).execute()

                        # Add tool result to context
                        messages.append({
                            "role": "tool",
                            "tool_call_id": tc.id,
                            "name": tool_name,
                            "content": result.content,
                        })

                    # Continue loop — model will now process the tool results
                    continue

                # ── Final text response ───────────────────────────────────
                output_text = msg.content or ""
                yield _ev({"type": "delta", "text": output_text})
                break

            if not output_text:
                output_text = "I wasn't able to complete that task."
                yield _ev({"type": "delta", "text": output_text})

            # ── Persist output card ───────────────────────────────────────
            card_result = (
                await supabase.table("output_cards")
                .insert({
                    "agent_id":    agent_id,
                    "user_id":     user["id"],
                    "capability":  payload.capability,
                    "user_input":  payload.user_input,
                    "output_text": output_text,
                })
                .execute()
            )
            card_id = card_result.data[0]["id"] if card_result.data else None

            # ── Persist conversation turns ────────────────────────────────
            await supabase.table("conversations").insert([
                {"agent_id": agent_id, "user_id": user["id"], "role": "user",      "content": payload.user_input},
                {"agent_id": agent_id, "user_id": user["id"], "role": "assistant", "content": output_text},
            ]).execute()

            # ── Auto-extract memory facts ─────────────────────────────────
            # Count current memory so we don't exceed 25
            mem_count_result = (
                await supabase.table("memory_items")
                .select("id", count="exact")
                .eq("agent_id", agent_id)
                .eq("user_id", user["id"])
                .execute()
            )
            current_mem_count = mem_count_result.count or 0
            slots_free = 25 - current_mem_count

            if slots_free > 0:
                extraction = await openai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {
                            "role": "system",
                            "content": (
                                "You extract personal facts worth remembering from a single conversation turn. "
                                "Only extract specific, personal information: preferences, constraints, key relationships, "
                                "named goals, stated patterns, or strong opinions. "
                                "Do NOT extract generic information, restate what the agent said, or manufacture context. "
                                "If there is nothing worth remembering, return an empty array. "
                                f"Return JSON only: {{\"facts\": [\"...\", ...]}} — max {min(slots_free, 3)} items."
                            ),
                        },
                        {
                            "role": "user",
                            "content": (
                                f"User said: {payload.user_input}\n\n"
                                f"Agent responded: {output_text[:600]}"
                            ),
                        },
                    ],
                    response_format={"type": "json_object"},
                    temperature=0,
                    max_tokens=300,
                )
                try:
                    extracted = json.loads(extraction.choices[0].message.content or "{}")
                    facts: list[str] = extracted.get("facts", [])
                    if facts:
                        await supabase.table("memory_items").insert([
                            {
                                "agent_id": agent_id,
                                "user_id": user["id"],
                                "content": fact,
                                "source": "auto",
                            }
                            for fact in facts[:min(slots_free, 3)]
                        ]).execute()
                except (json.JSONDecodeError, Exception):
                    pass  # memory extraction is best-effort

            # ── Update last_used_at ───────────────────────────────────────
            await (
                supabase.table("agents")
                .update({"last_used_at": datetime.now(tz=timezone.utc).isoformat()})
                .eq("id", agent_id)
                .execute()
            )

            yield _ev({"type": "done", "card_id": card_id})

        except Exception as exc:
            yield _ev({"type": "error", "text": str(exc)})

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
