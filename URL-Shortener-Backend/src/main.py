from fastapi import FastAPI
from prisma.errors import PrismaError

from db.db import db
from routes.shortener import router as shortener_router
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await db.connect()
        await db.execute_raw("SELECT 1")
        print("Database connected successfully")
    except (PrismaError, OSError) as e:
        raise RuntimeError(f"Database connection failed: {e}") from e
    yield
    if db.is_connected():
        await db.disconnect()


app = FastAPI(lifespan=lifespan)
app.include_router(shortener_router)


@app.get("/")
def read_root():
    return {"URL shortner Server"}
