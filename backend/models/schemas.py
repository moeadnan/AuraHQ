from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


# ── Agent ─────────────────────────────────────────────────────────────────────

Domain = Literal["Work", "Money", "Personal Growth"]

AgentType = Literal[
    "Manuscript", "Counsel", "Dispatch",
    "Ledger", "Horizon", "Terms",
    "Mirror", "Grain", "Meridian",
]


class AgentCreate(BaseModel):
    name: str = Field(max_length=30)
    domain: Domain
    agent_type: AgentType
    purpose: str = Field(max_length=120)
    seed_answer_1: str
    seed_answer_2: str
    seed_answer_3: str


class AgentUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=30)
    purpose: str | None = Field(default=None, max_length=120)


class Agent(BaseModel):
    id: str
    user_id: str
    name: str
    domain: str
    agent_type: str
    purpose: str
    seed_answer_1: str | None
    seed_answer_2: str | None
    seed_answer_3: str | None
    last_used_at: datetime | None
    position_index: int
    created_at: datetime
    updated_at: datetime


# ── Memory ────────────────────────────────────────────────────────────────────

MemorySource = Literal["seed", "confirmed", "auto"]


class MemoryItemCreate(BaseModel):
    content: str
    source: MemorySource = "confirmed"


class MemoryItem(BaseModel):
    id: str
    agent_id: str
    user_id: str
    content: str
    source: str
    created_at: datetime


# ── Output card ───────────────────────────────────────────────────────────────

class OutputCardCreate(BaseModel):
    capability: str
    user_input: str
    output_text: str


class OutputCard(BaseModel):
    id: str
    agent_id: str
    user_id: str
    capability: str
    user_input: str
    output_text: str
    saved_to_memory: bool
    created_at: datetime


# ── Chat ──────────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    capability: str
    user_input: str = Field(min_length=1)


class ChatResponse(BaseModel):
    output: str
    card_id: str | None


# ── Avatar ────────────────────────────────────────────────────────────────────

class AvatarResponse(BaseModel):
    avatar_url: str


# ── Profile ───────────────────────────────────────────────────────────────────

class ProfileUpdate(BaseModel):
    name: str | None = None
    role: str | None = None
    support_area: str | None = None
    capacity_answer: str | None = None
    avatar_url: str | None = None
    onboarding_completed: bool | None = None
    subscription_status: str | None = None
