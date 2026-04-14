from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request

from backend.auth import get_current_user
from backend.models.schemas import ProfileUpdate
from backend.services.supabase_service import get_supabase

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("")
async def get_profile(
    request: Request,
    user: dict[str, str] = Depends(get_current_user),
) -> dict:  # type: ignore[type-arg]
    supabase = await get_supabase()
    result = (
        await supabase.table("profiles")
        .select("*")
        .eq("id", user["id"])
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return result.data


@router.patch("")
async def update_profile(
    payload: ProfileUpdate,
    request: Request,
    user: dict[str, str] = Depends(get_current_user),
) -> dict:  # type: ignore[type-arg]
    supabase = await get_supabase()
    updates = payload.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = (
        await supabase.table("profiles")
        .update(updates)
        .eq("id", user["id"])
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return result.data[0]
