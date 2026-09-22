import secrets
from datetime import datetime, timedelta, timezone
from prisma.errors import PrismaError, UniqueViolationError
from db.db import db

ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
CODE_LENGTH = 7
EXPIRY_DAYS = 30
MAX_RETRIES = 5


def generate_code(length: int = CODE_LENGTH) -> str:
    return "".join(secrets.choice(ALPHABET) for _ in range(length))


async def create_short_url(original_url: str):
    expires_at = datetime.now(timezone.utc) + timedelta(days=EXPIRY_DAYS)

    for _ in range(MAX_RETRIES):
        code = generate_code()
        try:
            await db.connect()
            return await db.shorturl.create(
                data={
                    "code": code,
                    "originalUrl": original_url,
                    "expiresAt": expires_at,
                }
            )
        except UniqueViolationError:
            continue
        except PrismaError:
            raise
        finally:
            await db.disconnect()

    raise RuntimeError("Could not generate unique code")


async def get_original_url(code: str):
    try :
        await db.connect()
        return await db.shorturl.find_unique(where={"code": code})
    except PrismaError :
        raise
    finally:
        await db.disconnect()
