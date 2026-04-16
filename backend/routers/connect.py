"""Google OAuth 2.0 flow for Gmail + Calendar integrations.

Endpoints:
  GET /api/connect/google           → build auth URL, return as JSON
  GET /api/connect/google/callback  → exchange code, store tokens, redirect to settings
  GET /api/connect/status           → list which providers are connected
  DELETE /api/connect/google        → disconnect Google

The callback redirects the browser to the Next.js frontend after storing tokens,
so the user sees the updated connections page.
"""
from __future__ import annotations

import urllib.parse
from datetime import datetime, timedelta, timezone

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse, JSONResponse

from backend.auth import get_current_user
from backend.config import settings
from backend.services.supabase_service import get_supabase

router = APIRouter(prefix="/connect", tags=["connect"])

_GOOGLE_AUTH_URI  = "https://accounts.google.com/o/oauth2/v2/auth"
_GOOGLE_TOKEN_URI = "https://oauth2.googleapis.com/token"
_GOOGLE_INFO_URI  = "https://www.googleapis.com/oauth2/v2/userinfo"

_GOOGLE_SCOPES = " ".join([
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.compose",
    "https://www.googleapis.com/auth/userinfo.email",
])


# ── Auth URL ───────────────────────────────────────────────────────────────

@router.get("/google")
async def connect_google(
    request: Request,
    user: dict[str, str] = Depends(get_current_user),
) -> dict:
    """Return the Google OAuth authorization URL. Frontend redirects the user there."""
    if not settings.google_client_id:
        raise HTTPException(status_code=501, detail="Google OAuth is not configured.")

    params = {
        "client_id":     settings.google_client_id,
        "redirect_uri":  settings.google_redirect_uri,
        "response_type": "code",
        "scope":         _GOOGLE_SCOPES,
        "access_type":   "offline",
        "prompt":        "consent",
        "state":         user["id"],   # carry user_id through the redirect
    }
    auth_url = _GOOGLE_AUTH_URI + "?" + urllib.parse.urlencode(params)
    return {"auth_url": auth_url}


# ── OAuth callback ─────────────────────────────────────────────────────────

@router.get("/google/callback")
async def google_callback(
    request: Request,
    code: str = "",
    state: str = "",
    error: str = "",
) -> RedirectResponse:
    """Google redirects here after the user approves (or denies) the connection."""
    frontend_base = settings.next_public_app_url

    if error or not code:
        return RedirectResponse(
            f"{frontend_base}/settings/connections?error=google_denied"
        )

    user_id = state  # state was set to user["id"] in /connect/google
    if not user_id:
        return RedirectResponse(
            f"{frontend_base}/settings/connections?error=invalid_state"
        )

    # Exchange authorization code for tokens
    try:
        async with httpx.AsyncClient() as client:
            token_resp = await client.post(
                _GOOGLE_TOKEN_URI,
                data={
                    "code":          code,
                    "client_id":     settings.google_client_id,
                    "client_secret": settings.google_client_secret,
                    "redirect_uri":  settings.google_redirect_uri,
                    "grant_type":    "authorization_code",
                },
            )
            token_resp.raise_for_status()
            tokens = token_resp.json()

            # Fetch the connected email address
            info_resp = await client.get(
                _GOOGLE_INFO_URI,
                headers={"Authorization": f"Bearer {tokens['access_token']}"},
            )
            info = info_resp.json() if info_resp.is_success else {}
    except Exception:
        return RedirectResponse(
            f"{frontend_base}/settings/connections?error=token_exchange_failed"
        )

    access_token  = tokens.get("access_token", "")
    refresh_token = tokens.get("refresh_token", "")
    expires_in    = tokens.get("expires_in", 3600)
    expiry = (datetime.now(tz=timezone.utc) + timedelta(seconds=expires_in)).isoformat()
    email = info.get("email", "")

    # Upsert into oauth_connections
    supabase = await get_supabase()
    await (
        supabase.table("oauth_connections")
        .upsert(
            {
                "user_id":         user_id,
                "provider":        "google",
                "access_token":    access_token,
                "refresh_token":   refresh_token,
                "token_expiry":    expiry,
                "connected_email": email,
                "scopes":          _GOOGLE_SCOPES,
                "updated_at":      datetime.now(tz=timezone.utc).isoformat(),
            },
            on_conflict="user_id,provider",
        )
        .execute()
    )

    return RedirectResponse(
        f"{frontend_base}/settings/connections?connected=google"
    )


# ── Connection status ──────────────────────────────────────────────────────

@router.get("/status")
async def connection_status(
    request: Request,
    user: dict[str, str] = Depends(get_current_user),
) -> dict:
    """Return which OAuth providers the current user has connected."""
    supabase = await get_supabase()
    result = (
        await supabase.table("oauth_connections")
        .select("provider, connected_email, updated_at")
        .eq("user_id", user["id"])
        .execute()
    )
    connections = {
        row["provider"]: {
            "email": row.get("connected_email", ""),
            "connected_at": row.get("updated_at", ""),
        }
        for row in (result.data or [])
    }
    return {"connections": connections}


# ── Disconnect ─────────────────────────────────────────────────────────────

@router.delete("/google", status_code=204)
async def disconnect_google(
    request: Request,
    user: dict[str, str] = Depends(get_current_user),
) -> None:
    """Remove the Google OAuth connection for the current user."""
    supabase = await get_supabase()
    await (
        supabase.table("oauth_connections")
        .delete()
        .eq("user_id", user["id"])
        .eq("provider", "google")
        .execute()
    )
