"""Extract and verify the authenticated user from the request's Supabase JWT."""
from __future__ import annotations

import json

from fastapi import HTTPException, Request
from supabase import AsyncClient

from backend.services.supabase_service import get_supabase_anon

# The project ref from the Supabase URL — used to find the SSR cookie
_SUPABASE_PROJECT_REF = "jntolprazlzeecochedt"
_SSR_COOKIE_NAME = f"sb-{_SUPABASE_PROJECT_REF}-auth-token"


def _extract_token_from_cookies(request: Request) -> str | None:
    """
    @supabase/ssr stores the session as JSON in sb-<ref>-auth-token.
    Large sessions are chunked across sb-<ref>-auth-token.0, .1, etc.
    Falls back to a plain Bearer token or legacy sb-access-token cookie.
    """
    # Try chunked cookie first (sb-<ref>-auth-token.0 + .1 + ...)
    chunks: list[str] = []
    for i in range(10):
        chunk = request.cookies.get(f"{_SSR_COOKIE_NAME}.{i}")
        if chunk is None:
            break
        chunks.append(chunk)

    raw = "".join(chunks) if chunks else request.cookies.get(_SSR_COOKIE_NAME)

    if raw:
        try:
            session = json.loads(raw)
            return session.get("access_token")
        except (json.JSONDecodeError, AttributeError):
            return raw  # treat as a plain token string

    # Legacy / manual fallback
    return request.cookies.get("sb-access-token")


async def get_current_user(request: Request) -> dict[str, str]:
    token = _extract_token_from_cookies(request)

    if not token:
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
