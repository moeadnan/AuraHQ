"""Tool definitions for AURA HQ agents.

Each agent type declares which tools it can call. Tools are passed
as JSON schemas to the OpenAI API — the model decides when to call them.
Actual execution lives in executor.py.
"""
from __future__ import annotations

# ── Tool schema helpers ────────────────────────────────────────────────────

def _fn(name: str, description: str, properties: dict, required: list[str]) -> dict:
    return {
        "type": "function",
        "function": {
            "name": name,
            "description": description,
            "parameters": {
                "type": "object",
                "properties": properties,
                "required": required,
            },
        },
    }


# ── Gmail tools (used by Dispatch + optionally others) ────────────────────

LIST_INBOX = _fn(
    "list_inbox",
    "List recent emails from the Gmail inbox. Returns sender, subject, date, and snippet for each.",
    {
        "max_results": {
            "type": "integer",
            "description": "How many emails to return (default 10, max 20)",
        },
        "unread_only": {
            "type": "boolean",
            "description": "If true, only return unread emails",
        },
        "query": {
            "type": "string",
            "description": "Optional Gmail search query e.g. 'from:boss@company.com' or 'subject:invoice'",
        },
    },
    [],
)

READ_EMAIL = _fn(
    "read_email",
    "Read the full body of a specific email by its ID. Use list_inbox first to get IDs.",
    {
        "email_id": {
            "type": "string",
            "description": "The Gmail message ID",
        },
    },
    ["email_id"],
)

CREATE_DRAFT = _fn(
    "create_draft",
    (
        "Create a draft email reply in Gmail. The draft will appear in the user's Drafts folder — "
        "nothing is sent automatically. Use this when you've written a response and want to stage it."
    ),
    {
        "to": {"type": "string", "description": "Recipient email address"},
        "subject": {"type": "string", "description": "Email subject line"},
        "body": {"type": "string", "description": "Full email body text"},
        "reply_to_id": {
            "type": "string",
            "description": "Message ID being replied to (optional — include for threaded replies)",
        },
        "thread_id": {
            "type": "string",
            "description": "Thread ID for the reply (optional — include when replying to a thread)",
        },
    },
    ["to", "subject", "body"],
)

# ── Web search tool (available to Research-type agents) ───────────────────

WEB_SEARCH = _fn(
    "web_search",
    "Search the web for current information. Returns titles, snippets, and URLs.",
    {
        "query": {"type": "string", "description": "The search query"},
        "max_results": {
            "type": "integer",
            "description": "Number of results to return (default 5)",
        },
    },
    ["query"],
)

# ── Tool sets per agent type ───────────────────────────────────────────────
# Map of agent_type → list of tools available when the integration is connected.
# Tools are only passed to OpenAI if the user has the required integration.

AGENT_TOOLS: dict[str, list[dict]] = {
    "Dispatch":  [LIST_INBOX, READ_EMAIL, CREATE_DRAFT],
    "Manuscript": [LIST_INBOX, READ_EMAIL],   # can read email to help draft replies
    "Counsel":   [],                           # pure reasoning, no external tools
    "Ledger":    [],
    "Horizon":   [],
    "Terms":     [],
    "Mirror":    [],
    "Grain":     [],
    "Meridian":  [],
}

# Which integration does each tool require?
TOOL_REQUIRES: dict[str, str] = {
    "list_inbox":   "google",
    "read_email":   "google",
    "create_draft": "google",
    "web_search":   "tavily",
}


def get_tools_for_agent(agent_type: str, connected_providers: set[str]) -> list[dict]:
    """Return tool schemas for an agent, filtered to only connected integrations."""
    all_tools = AGENT_TOOLS.get(agent_type, [])
    return [
        t for t in all_tools
        if TOOL_REQUIRES.get(t["function"]["name"], "") in connected_providers
    ]
