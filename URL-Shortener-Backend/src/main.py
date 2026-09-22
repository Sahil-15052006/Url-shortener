from fastapi import FastAPI
from routes.shortener import router as shorten_router
from routes.shortener import router as redirect_to_url

app = FastAPI()
app.include_router(shorten_router)
app.include_router(redirect_to_url)

@app.get("/")
def read_root():
    return {"URL shortner Server"}
