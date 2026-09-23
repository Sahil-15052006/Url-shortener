from fastapi import FastAPI
from prisma.errors import PrismaError

from db.db import db, direct_db
from db import redis as redis_cache
from routes.shortener import router as shortener_router
from contextlib import asynccontextmanager


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
    yield
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
