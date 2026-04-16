"""Extract and verify the authenticated user from the request's Supabase JWT."""
from __future__ import annotations

import json
import urllib.parse

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
    The cookie value may be URL-encoded by the browser or the Next.js proxy.
    """
    # Try chunked cookie first
    chunks: list[str] = []
    for i in range(10):
        chunk = request.cookies.get(f"{_SSR_COOKIE_NAME}.{i}")
        if chunk is None:
            break
        chunks.append(chunk)

    raw = "".join(chunks) if chunks else request.cookies.get(_SSR_COOKIE_NAME)

    if raw:
        # Try multiple decoding strategies — the value may be URL-encoded
        candidates = [raw, urllib.parse.unquote(raw)]
        for candidate in candidates:
            try:
                session = json.loads(candidate)
                if isinstance(session, dict):
                    token = session.get("access_token")
                    if token and isinstance(token, str) and token.count(".") == 2:
                        return token
            except (json.JSONDecodeError, ValueError):
                pass

        # If the raw value itself is a bare JWT (three dot-separated segments), use it
        if isinstance(raw, str) and raw.count(".") == 2:
            return raw

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
