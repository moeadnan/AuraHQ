"""Extract and verify the authenticated user from the request's Supabase JWT."""
from __future__ import annotations

from fastapi import HTTPException, Request
from supabase import AsyncClient

from backend.services.supabase_service import get_supabase_anon


async def get_current_user(request: Request) -> dict[str, str]:
    """
    Reads the sb-access-token cookie (set by @supabase/ssr on the frontend)
    and verifies it against Supabase auth.
    """
    token = request.cookies.get("sb-access-token")
    if not token:
        # Also accept Bearer token in Authorization header (for API clients)
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    client: AsyncClient = await get_supabase_anon()
    response = await client.auth.get_user(token)

    if not response or not response.user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return {"id": response.user.id, "email": response.user.email or ""}
