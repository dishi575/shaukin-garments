from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.db.session import engine, Base
from app.routers import auth, users, products, categories, orders, quotes
from app.routers.upload import router as upload_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()

app = FastAPI(
    title="Shaukin Garments API",
    version="1.0.0",
    description="Backend API for Shaukin Garments",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,         prefix="/api/auth",       tags=["Auth"])
app.include_router(users.router,        prefix="/api/users",      tags=["Users"])
app.include_router(categories.router,   prefix="/api/categories", tags=["Categories"])
app.include_router(products.router,     prefix="/api/products",   tags=["Products"])
app.include_router(orders.router,       prefix="/api/orders",     tags=["Orders"])
app.include_router(quotes.router,       prefix="/api/quotes",     tags=["Bulk Quotes"])
app.include_router(upload_router,       prefix="/api/upload",     tags=["Upload"])

@app.get("/")
async def root():
    return {"message": "Shaukin Garments API", "version": "1.0.0", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "ok"}