from datetime import datetime, timezone

from db.db import db


async def clean_expired_urls() -> int:
    """Delete rows past their expiresAt. Returns the number removed."""
    removed: int = await db.shorturl.delete_many(
        where={"expiresAt": {"lt": datetime.now(timezone.utc)}},
    )
    print(f"Cleaner: removed {removed} expired short URLs")
    return removed


if __name__ == "__main__":
    import asyncio

    async def _run() -> None:
        await db.connect()
        try:
            removed = await clean_expired_urls()
        finally:
            if db.is_connected():
                await db.disconnect()
        print(f"Done, removed {removed} rows")

    asyncio.run(_run())
