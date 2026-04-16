"""Tool executor — routes tool_name → actual implementation.

Loads the user's OAuth token from DB, calls the right function,
refreshes tokens if expired, and persists updated tokens back to DB.
"""
from __future__ import annotations

import json
from datetime import datetime, timezone

import httpx

from backend.services.supabase_service import get_supabase
from backend.tools.gmail import ToolResult, create_draft, list_inbox, read_email, refresh_google_token


class ToolExecutor:
    def __init__(self, user_id: str, agent_id: str):
        self.user_id = user_id
        self.agent_id = agent_id

    async def execute(self, tool_name: str, arguments: dict) -> ToolResult:
        """Dispatch a tool call and return the result."""
        gmail_tools = {"list_inbox", "read_email", "create_draft"}

        if tool_name in gmail_tools:
            return await self._run_gmail_tool(tool_name, arguments)

        return ToolResult(
            summary=f"Unknown tool: {tool_name}",
            content=f"Tool '{tool_name}' is not implemented.",
        )

    # ── Gmail ──────────────────────────────────────────────────────────────

    async def _run_gmail_tool(self, tool_name: str, arguments: dict) -> ToolResult:
        token = await self._get_google_token()
        if not token:
            return ToolResult(
                summary="Gmail not connected",
                content="Gmail is not connected. The user needs to connect Gmail in Settings → Connections.",
            )

        access_token = token["access_token"]

        # Try the call; if 401 or 404, refresh token and retry once
        try:
            result = await self._dispatch_gmail(tool_name, access_token, arguments)
        except httpx.HTTPStatusError as e:
            if e.response.status_code in (401, 404) and token.get("refresh_token"):
                try:
                    access_token = await self._refresh_google(token)
                    result = await self._dispatch_gmail(tool_name, access_token, arguments)
                except httpx.HTTPStatusError as e2:
                    if e2.response.status_code == 404:
                        return ToolResult(
                            summary="Email not found",
                            content="The requested email could not be found. It may have been deleted or moved. Use the information from list_inbox to proceed.",
                        )
                    raise
            elif e.response.status_code == 404:
                return ToolResult(
                    summary="Email not found",
                    content="The requested email could not be found. It may have been deleted or moved. Use the information from list_inbox to proceed.",
                )
            else:
                raise

        return result

    async def _dispatch_gmail(self, tool_name: str, access_token: str, args: dict) -> ToolResult:
        if tool_name == "list_inbox":
            return await list_inbox(
                access_token,
                max_results=args.get("max_results", 10),
                unread_only=args.get("unread_only", True),
                query=args.get("query", ""),
            )
        if tool_name == "read_email":
            return await read_email(access_token, args["email_id"])
        if tool_name == "create_draft":
            return await create_draft(
                access_token,
                to=args["to"],
                subject=args["subject"],
                body=args["body"],
                reply_to_id=args.get("reply_to_id", ""),
                thread_id=args.get("thread_id", ""),
            )
        raise ValueError(f"Unknown Gmail tool: {tool_name}")

    # ── Token management ───────────────────────────────────────────────────

    async def _get_google_token(self) -> dict | None:
        supabase = await get_supabase()
        result = (
            await supabase.table("oauth_connections")
            .select("access_token, refresh_token, token_expiry")
            .eq("user_id", self.user_id)
            .eq("provider", "google")
            .single()
            .execute()
        )
        return result.data or None

    async def _refresh_google(self, token: dict) -> str:
        """Refresh the Google access token and persist the new one. Returns new access_token."""
        new_tokens = await refresh_google_token(token["refresh_token"])
        new_access_token = new_tokens["access_token"]
        expiry = datetime.now(tz=timezone.utc).isoformat() if "expires_in" not in new_tokens else None

        supabase = await get_supabase()
        await (
            supabase.table("oauth_connections")
            .update({"access_token": new_access_token, "updated_at": datetime.now(tz=timezone.utc).isoformat()})
            .eq("user_id", self.user_id)
            .eq("provider", "google")
            .execute()
        )
        return new_access_token
