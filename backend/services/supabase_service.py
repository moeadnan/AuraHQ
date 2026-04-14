from __future__ import annotations

from functools import lru_cache

from supabase import AsyncClient, create_async_client

from backend.config import settings


@lru_cache(maxsize=1)
def _get_url_and_key() -> tuple[str, str]:
    return settings.next_public_supabase_url, settings.supabase_service_role_key


async def get_supabase() -> AsyncClient:
    """Return an async Supabase admin client (service role — bypasses RLS)."""
    url, key = _get_url_and_key()
    return await create_async_client(url, key)


async def get_supabase_anon() -> AsyncClient:
    """Return an async Supabase client using the anon key (respects RLS)."""
    url = settings.next_public_supabase_url
    key = settings.next_public_supabase_anon_key
    return await create_async_client(url, key)
