from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config import settings
from backend.routers import agents, avatar, memory, profile

# Validate required env vars on startup
settings.validate_required()

app = FastAPI(
    title="AURA HQ API",
    description="Personal AI infrastructure — FastAPI backend",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# CORS — allow the Next.js frontend in dev and prod
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.next_public_app_url,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,  # required for cookie-based auth
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers — all grouped under /api
app.include_router(avatar.router, prefix="/api")
app.include_router(agents.router, prefix="/api")
app.include_router(memory.router, prefix="/api")
app.include_router(profile.router, prefix="/api")


@app.get("/api/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "aurahq-api"}
