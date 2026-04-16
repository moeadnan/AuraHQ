from __future__ import annotations

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# Resolve .env.local from the project root (one level above /backend)
_PROJECT_ROOT = Path(__file__).parent.parent
_ENV_FILE = _PROJECT_ROOT / ".env.local"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(_ENV_FILE),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    next_public_supabase_url: str = ""
    next_public_supabase_anon_key: str = ""
    supabase_service_role_key: str = ""
    openai_api_key: str = ""
    next_public_app_url: str = "http://localhost:3000"
    backend_url: str = "http://localhost:8000"

    # Google OAuth — for Gmail + Calendar integrations
    google_client_id: str = ""
    google_client_secret: str = ""
    google_redirect_uri: str = "http://localhost:3000/api/connect/google/callback"

    def validate_required(self) -> None:
        missing = [
            k for k, v in {
                "NEXT_PUBLIC_SUPABASE_URL": self.next_public_supabase_url,
                "NEXT_PUBLIC_SUPABASE_ANON_KEY": self.next_public_supabase_anon_key,
                "SUPABASE_SERVICE_ROLE_KEY": self.supabase_service_role_key,
                "OPENAI_API_KEY": self.openai_api_key,
            }.items()
            if not v or v.startswith("your_")
        ]
        if missing:
            raise RuntimeError(
                f"Missing required env vars: {', '.join(missing)}\n"
                f"Fill in {_ENV_FILE} to continue."
            )


settings = Settings()  # type: ignore[call-arg]
