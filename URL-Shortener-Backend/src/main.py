import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from prisma.errors import PrismaError

from cleaner import clean_expired_urls
from db.db import db, direct_db
from db import redis as redis_cache
from routes.shortener import router as shortener_router

CLEANER_INTERVAL_SECONDS = 24 * 60 * 60  # daily


async def _cleaner_loop() -> None:
    while True:
        try:
            await clean_expired_urls()
        except (PrismaError, OSError) as e:
            print(f"Cleaner failed: {e}")
        await asyncio.sleep(CLEANER_INTERVAL_SECONDS)


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await db.connect()
        await db.execute_raw("SELECT 1")
        print("Database connected successfully")
        await direct_db.connect()
        await direct_db.execute_raw("SELECT 1")
        print("Direct database connected successfully")
        await redis_cache.connect()
    except (PrismaError, OSError) as e:
        raise RuntimeError(f"Database connection failed: {e}") from e
    cleaner_task = asyncio.create_task(_cleaner_loop())
    yield
    cleaner_task.cancel()
    if db.is_connected():
        await db.disconnect()
    if direct_db.is_connected():
        await direct_db.disconnect()
    await redis_cache.disconnect()


app = FastAPI(lifespan=lifespan)
app.include_router(shortener_router)


@app.get("/")
def read_root():
    return {"URL shortner Server"}
