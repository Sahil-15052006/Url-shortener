# Short.ly — URL Shortener

A minimal full-stack URL shortener. Paste a long link, get a 7-character
short code, share it — visiting the code redirects to the original URL.

## Stack

| Layer    | Tech                                            |
|----------|-------------------------------------------------|
| Backend  | FastAPI (Python) + Prisma + Postgres (Neon)     |
| Frontend | Vite + React + TS + Tailwind CSS (single page)  |

## How it works

1. User submits a URL → `POST /shorten` stores it and returns a code.
2. Visiting `GET /{code}` looks up the code and redirects (307) to the
   original URL, or 404s with `"not exists"`.
3. The frontend is one scrollable page: landing section on top, shorten
   form below, with a navbar, theme toggle, and footer.

## Run locally

**Backend** (`URL-Shortener-Backend/`) — needs `DATABASE_URL` in `.env`:

```bash
cd URL-Shortener-Backend
uv sync && prisma generate
uvicorn src.main:app --reload --port 8000
```

**Frontend** (`URL-Shortener-Frontend/`) — optional `VITE_API_URL` in `.env`
(empty = same origin, dev proxies `/shorten` to `:8000`):

```bash
cd URL-Shortener-Frontend
npm install && npm run dev
```

See each folder's `.env.example` for the variables.
