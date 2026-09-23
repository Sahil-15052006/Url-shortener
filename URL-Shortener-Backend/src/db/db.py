from pathlib import Path

from dotenv import load_dotenv
from prisma import Prisma

load_dotenv(Path(__file__).resolve().parents[2] / ".env")


def _get_env(name: str) -> str:
    import os

    value = os.environ.get(name)
    if not value:
        raise RuntimeError(f"{name} is not set — add it to .env (see .env.example)")
    return value

# Pooled connection (PgBouncer URL in DATABASE_URL, pool sized via
# connection_limit in the URL itself).
db = Prisma(datasource={"url": _get_env("DATABASE_URL")})

# Direct (non-pooled) connection for migrations/admin-style queries.
direct_db = Prisma(datasource={"url": _get_env("DIRECT_URL")})
