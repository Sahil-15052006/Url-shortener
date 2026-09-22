from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from prisma.errors import PrismaError
from schemas.shortener import ShortenRequest, ShortenResponse
from services.shortener import create_short_url, get_original_url

router = APIRouter()


@router.post("/shorten", response_model=ShortenResponse, status_code=201)
async def shorten_url(payload: ShortenRequest):
    try:
        record = await create_short_url(str(payload.url))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
    except PrismaError as e:
        raise HTTPException(status_code=503, detail="Database unavailable") from e

    return ShortenResponse(
        code=record.code,
        short_url=f"/{record.code}",
        original_url=record.originalUrl,
        expires_at=record.expiresAt,
    )


@router.get("/{code}")
async def redirect_to_url(code: str):
    try:
        record = await get_original_url(code)
    except PrismaError as e:
        raise HTTPException(status_code=503, detail="Database unavailable") from e
    if record is None:
        raise HTTPException(status_code=404, detail="not exists")
    return RedirectResponse(url=record.originalUrl, status_code=307)
