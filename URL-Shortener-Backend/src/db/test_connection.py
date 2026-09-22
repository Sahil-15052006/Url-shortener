import asyncio
from prisma.errors import PrismaError
from db.db import db
async def test_connection(timeout: int = 10) -> bool:
    try:
        async with asyncio.timeout(timeout):
            await db.connect()
            await db.execute_raw("SELECT 1")
            print("Database Connected")
            return True
    except (PrismaError, asyncio.TimeoutError, OSError) as e:
        print(f"Database connection failed: {type(e).__name__}: {e}")
        return False
    finally:
        if db.is_connected():
            await db.disconnect()
            print("Database Disconnected")
            print("DB connection test successfull")
