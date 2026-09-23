import secrets
from datetime import datetime, timedelta, timezone
from prisma.errors import PrismaError, UniqueViolationError
from db.db import db, direct_db
from db import redis as redis_cache

ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
CODE_LENGTH = 7
EXPIRY_DAYS = 30
MAX_RETRIES = 5


def generate_code(length: int = CODE_LENGTH) -> str:
    return "".join(secrets.choice(ALPHABET) for _ in range(length))


async def create_short_url(original_url: str):
    now = datetime.now(timezone.utc)
    existing = await db.shorturl.find_first(
        where={"originalUrl": original_url},
    )
    if existing is not None:
        return existing

    expires_at = now + timedelta(days=EXPIRY_DAYS)

    for _ in range(MAX_RETRIES):
        code = generate_code()
        try:
            record = await db.shorturl.create(
                data={
                    "code": code,
                    "originalUrl": original_url,
                    "expiresAt": expires_at,
                }
            )
            try:
                await redis_cache.client().set(
                    redis_cache.cache_key(code), record.originalUrl, ex=redis_cache.CACHE_TTL_SECONDS
                )
            except Exception:
                pass  # cache is best-effort; the DB write already succeeded
            return record
        except UniqueViolationError:
            # Either the random code collided (retry with a fresh code) or a
            # concurrent request inserted the same URL first (return theirs).
            winner = await db.shorturl.find_first(where={"originalUrl": original_url})
            if winner is not None:
                return winner
            continue
        except PrismaError:
            raise

    raise RuntimeError("Could not generate unique code")

# non-pooled and non-cached (test/baseline path)
async def get_original_url(code: str):
    return await direct_db.shorturl.find_unique(where={"code": code})


# pooled + redis-cached (production path, 24h TTL)
async def get_original_url_cached(code: str):
    client = redis_cache.client()
    cached = await client.get(redis_cache.cache_key(code))
    if cached is not None:
        return cached

    record = await db.shorturl.find_unique(where={"code": code})
    if record is None:
        return None
    await client.set(redis_cache.cache_key(code), record.originalUrl, ex=redis_cache.CACHE_TTL_SECONDS)
    return record.originalUrl