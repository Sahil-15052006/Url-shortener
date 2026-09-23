import os

import redis.asyncio as redis

CACHE_TTL_SECONDS = 24 * 60 * 60  # 24h

_client: redis.Redis | None = None


def cache_key(code: str) -> str:
    return f"shorturl:{code}"


async def connect() -> None:
    global _client
    url = os.environ.get("REDIS_URL")
    if not url:
        raise RuntimeError("REDIS_URL is not set — add it to .env (see .env.example)")
    _client = redis.from_url(url, decode_responses=True)
    await _client.ping()
    print("Redis connected successfully")


async def disconnect() -> None:
    global _client
    if _client is not None:
        await _client.aclose()
        _client = None


def client() -> redis.Redis:
    if _client is None:
        raise RuntimeError("Redis is not connected")
    return _client
