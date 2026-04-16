"""Gmail API functions using httpx (async, no heavy Google SDK required).

All functions accept an access_token and refresh it if a 401 is returned.
The caller (executor) is responsible for persisting refreshed tokens.
"""
from __future__ import annotations

import base64
import json
from dataclasses import dataclass
from datetime import datetime, timezone
from email.header import Header
from email.mime.text import MIMEText

import httpx

from backend.config import settings

_GMAIL_BASE = "https://gmail.googleapis.com/gmail/v1/users/me"
_TOKEN_URI  = "https://oauth2.googleapis.com/token"


@dataclass
class ToolResult:
    """Returned by every tool function — a human summary + full content for the model."""
    summary: str   # short human-readable (shown in UI as a step)
    content: str   # full content passed back to the model


# ── Token refresh ──────────────────────────────────────────────────────────

async def refresh_google_token(refresh_token: str) -> dict:
    """Exchange a refresh token for a new access token. Returns the token response dict."""
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            _TOKEN_URI,
            data={
                "refresh_token": refresh_token,
                "client_id": settings.google_client_id,
                "client_secret": settings.google_client_secret,
                "grant_type": "refresh_token",
            },
        )
        resp.raise_for_status()
        return resp.json()


# ── Internal helpers ───────────────────────────────────────────────────────

def _headers(access_token: str) -> dict:
    return {"Authorization": f"Bearer {access_token}"}


def _decode_body(payload: dict) -> str:
    """Recursively extract plain-text body from a Gmail message payload."""
    mime = payload.get("mimeType", "")
    if mime == "text/plain":
        data = payload.get("body", {}).get("data", "")
        return base64.urlsafe_b64decode(data + "==").decode("utf-8", errors="replace")
    for part in payload.get("parts", []):
        text = _decode_body(part)
        if text:
            return text
    return ""


def _fmt_date(internal_date: str | None) -> str:
    if not internal_date:
        return ""
    ts = int(internal_date) / 1000
    return datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%b %d, %Y %H:%M UTC")


# ── Tool implementations ───────────────────────────────────────────────────

async def list_inbox(
    access_token: str,
    max_results: int = 10,
    unread_only: bool = True,
    query: str = "",
) -> ToolResult:
    q_parts = []
    if unread_only:
        q_parts.append("is:unread")
    if query:
        q_parts.append(query)
    q = " ".join(q_parts) if q_parts else "in:inbox"

    max_results = min(max_results or 10, 20)

    async with httpx.AsyncClient() as client:
        # 1. List message IDs
        resp = await client.get(
            f"{_GMAIL_BASE}/messages",
            headers=_headers(access_token),
            params={"maxResults": max_results, "q": q},
        )
        resp.raise_for_status()
        data = resp.json()
        messages = data.get("messages", [])

        if not messages:
            return ToolResult(
                summary="Inbox is empty (no matching emails)",
                content="No emails found matching the query.",
            )

        # 2. Fetch each message (metadata only for speed)
        results = []
        for msg in messages:
            r = await client.get(
                f"{_GMAIL_BASE}/messages/{msg['id']}",
                headers=_headers(access_token),
                params=[
                    ("format", "metadata"),
                    ("metadataHeaders", "From"),
                    ("metadataHeaders", "Subject"),
                    ("metadataHeaders", "Date"),
                ],
            )
            r.raise_for_status()
            m = r.json()
            headers = {h["name"]: h["value"] for h in m.get("payload", {}).get("headers", [])}
            results.append({
                "id": m["id"],
                "thread_id": m.get("threadId", ""),
                "from": headers.get("From", "unknown"),
                "subject": headers.get("Subject", "(no subject)"),
                "date": _fmt_date(m.get("internalDate")),
                "snippet": m.get("snippet", ""),
                "unread": "UNREAD" in m.get("labelIds", []),
            })

    lines = [f"Found {len(results)} email(s):\n"]
    for i, r in enumerate(results, 1):
        lines.append(
            f"{i}. ID: {r['id']}\n"
            f"   From: {r['from']}\n"
            f"   Subject: {r['subject']}\n"
            f"   Date: {r['date']}\n"
            f"   Preview: {r['snippet'][:120]}\n"
        )

    content = "\n".join(lines)
    summary = f"Found {len(results)} email{'s' if len(results) != 1 else ''}"
    return ToolResult(summary=summary, content=content)


async def read_email(access_token: str, email_id: str) -> ToolResult:
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{_GMAIL_BASE}/messages/{email_id}",
            headers=_headers(access_token),
            params={"format": "full"},
        )
        resp.raise_for_status()
        m = resp.json()

    headers = {h["name"]: h["value"] for h in m.get("payload", {}).get("headers", [])}
    body = _decode_body(m.get("payload", {}))

    content = (
        f"From: {headers.get('From', 'unknown')}\n"
        f"To: {headers.get('To', '')}\n"
        f"Subject: {headers.get('Subject', '(no subject)')}\n"
        f"Date: {headers.get('Date', '')}\n"
        f"Thread ID: {m.get('threadId', '')}\n\n"
        f"Body:\n{body[:4000]}"
    )
    summary = f"Read email from {headers.get('From', 'unknown')[:50]}"
    return ToolResult(summary=summary, content=content)


async def create_draft(
    access_token: str,
    to: str,
    subject: str,
    body: str,
    reply_to_id: str = "",
    thread_id: str = "",
) -> ToolResult:
    """Create a draft in the user's Gmail Drafts folder."""
    msg = MIMEText(body, "plain", "utf-8")
    msg["To"] = to
    msg["Subject"] = str(Header(subject, "utf-8"))
    if reply_to_id:
        msg["In-Reply-To"] = reply_to_id
        msg["References"] = reply_to_id

    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode("ascii")

    draft_body: dict = {"message": {"raw": raw}}
    if thread_id:
        draft_body["message"]["threadId"] = thread_id

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{_GMAIL_BASE}/drafts",
            headers={**_headers(access_token), "Content-Type": "application/json"},
            content=json.dumps(draft_body),
        )
        if not resp.is_success:
            detail = resp.text[:300]
            raise httpx.HTTPStatusError(
                f"{resp.status_code}: {detail}", request=resp.request, response=resp
            )
        draft = resp.json()

    draft_id = draft.get("id", "")
    summary = f"Draft created for {to}"
    content = (
        f"Draft created successfully.\n"
        f"Draft ID: {draft_id}\n"
        f"To: {to}\n"
        f"Subject: {subject}\n\n"
        f"The draft is now in the user's Gmail Drafts folder."
    )
    return ToolResult(summary=summary, content=content)
