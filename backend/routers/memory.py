from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request

from backend.auth import get_current_user
from backend.models.schemas import MemoryItem, MemoryItemCreate
from backend.services.supabase_service import get_supabase

router = APIRouter(prefix="/agents/{agent_id}/memory", tags=["memory"])


@router.get("", response_model=list[MemoryItem])
async def list_memory(
    agent_id: str,
    request: Request,
    user: dict[str, str] = Depends(get_current_user),
) -> list[MemoryItem]:
    supabase = await get_supabase()
    result = (
        await supabase.table("memory_items")
        .select("*")
        .eq("agent_id", agent_id)
        .eq("user_id", user["id"])
        .order("created_at", desc=True)
        .limit(25)
        .execute()
    )
    return [MemoryItem(**row) for row in (result.data or [])]


@router.post("", response_model=MemoryItem, status_code=201)
async def add_memory_item(
    agent_id: str,
    payload: MemoryItemCreate,
    request: Request,
    user: dict[str, str] = Depends(get_current_user),
) -> MemoryItem:
    supabase = await get_supabase()

    # Enforce 25-item cap
    count_result = (
        await supabase.table("memory_items")
        .select("id", count="exact")
        .eq("agent_id", agent_id)
        .eq("user_id", user["id"])
        .execute()
    )
    if (count_result.count or 0) >= 25:
        raise HTTPException(status_code=409, detail="Memory is full (25 items). Delete an item first.")

    result = (
        await supabase.table("memory_items")
        .insert({
            "agent_id": agent_id,
            "user_id": user["id"],
            "content": payload.content,
            "source": payload.source,
        })
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to save memory item")
    return MemoryItem(**result.data[0])


@router.delete("/{item_id}", status_code=204)
async def delete_memory_item(
    agent_id: str,
    item_id: str,
    request: Request,
    user: dict[str, str] = Depends(get_current_user),
) -> None:
    supabase = await get_supabase()
    await (
        supabase.table("memory_items")
        .delete()
        .eq("id", item_id)
        .eq("agent_id", agent_id)
        .eq("user_id", user["id"])
        .execute()
    )
