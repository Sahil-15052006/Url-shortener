# URL Shortener — Backend

FastAPI service that turns long URLs into 7-character short codes.
`GET /{code}` redirects to the original URL (HTTP 307).

## How it works

```
POST /shorten  →  store URL, return { code, short_url }
GET /{code}    →  Redis cache → pooled Postgres → 307 redirect (or 404)
```

- **Same URL → same code.** `originalUrl` has a unique constraint, so
  re-submitting a link returns the existing code. A concurrent double
  submit is resolved by the database, not by luck.
- **Two read paths.** `GET /{code}` is the production path (pooled
  connection + 24h Redis cache). `GET /direct/{code}` skips both and
  hits Postgres directly — a baseline for comparing cache speed.
- **Links expire.** Each row carries `expiresAt` (30 days). A background
  task in the app deletes expired rows once a day. Redis entries expire
  on their own after 24h.

## Project layout

```
prisma/schema.prisma      tables: ShortUrl (code + originalUrl unique)
prisma/migrations/        SQL history, applied with `prisma migrate deploy`
src/main.py               app + lifespan (connects DB pool, direct DB, Redis)
src/routes/shortener.py   POST /shorten, GET /{code}, GET /direct/{code}
src/services/shortener.py create + lookup logic (code gen, dedupe, cache)
src/schemas/shortener.py  request/response shapes
src/db/db.py              pooled `db` (connection_limit=5) + `direct_db`
src/db/redis.py           shared Redis client, 24h TTL
src/cleaner.py            deletes expired rows (also runnable standalone)
```

## Setup

```bash
uv sync
cp .env.example .env   # then fill in the three URLs below
prisma generate
prisma migrate deploy
```

Run:

```bash
uv run fastapi dev src/main.py        # dev, http://127.0.0.1:8000
# or
uv run uvicorn src.main:app --host 0.0.0.0 --port 10000
```

## Environment variables

| Var            | What                                                     |
|----------------|----------------------------------------------------------|
| `DATABASE_URL` | Neon **pooled** (`-pooler`) URL + `&connection_limit=5`  |
| `DIRECT_URL`   | Neon **direct** (no `-pooler`) URL, for `direct_db`      |
| `REDIS_URL`    | Redis URL — `redis://localhost:6379` locally, Upstash `rediss://…` in prod |

## Scaling notes

- One async worker handles concurrent clicks; the pool (5 lanes) matches it.
- Hot links are served from Redis (~1ms); Postgres sees each code ~once a day.
- `code @unique` is already an index, so lookups are index seeks.
- No workers or queues: there are no background writes to process.
