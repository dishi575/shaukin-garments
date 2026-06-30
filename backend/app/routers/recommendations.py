from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import Optional
from pydantic import BaseModel
from uuid import UUID

from app.db.session import get_db
from app.models.product import Product, Category
from app.models.interaction import Interaction
from app.schemas.product import ProductOut
from app.ml.recommender import get_hybrid_recommendations, get_sector_recommendations

router = APIRouter()


class TrackEvent(BaseModel):
    product_id: Optional[str] = None
    category_id: Optional[str] = None
    interaction: str  # view, search, add_to_cart, quote_request, order, download_catalogue
    session_id: Optional[str] = None
    user_id: Optional[str] = None


INTERACTION_WEIGHTS = {
    "view": 1.0,
    "search": 0.5,
    "add_to_cart": 3.0,
    "quote_request": 4.0,
    "order": 5.0,
    "download_catalogue": 2.0,
}


@router.post("/track", status_code=201)
async def track_interaction(data: TrackEvent, db: AsyncSession = Depends(get_db)):
    """Fire-and-forget interaction logging. Frontend calls this on product views, cart adds, etc."""
    interaction = Interaction(
        user_id=data.user_id or None,
        session_id=data.session_id,
        product_id=data.product_id or None,
        category_id=data.category_id or None,
        interaction=data.interaction,
        weight=INTERACTION_WEIGHTS.get(data.interaction, 1.0),
    )
    db.add(interaction)
    await db.flush()
    return {"status": "tracked"}


@router.get("/product/{product_id}")
async def recommend_for_product(product_id: str, db: AsyncSession = Depends(get_db), top_n: int = Query(4, le=12)):
    """Returns recommended products for a given product page — hybrid content + collaborative."""
    products_result = await db.execute(
        select(Product).options(selectinload(Product.category)).where(Product.is_active == True)
    )
    products = products_result.scalars().all()

    interactions_result = await db.execute(select(Interaction))
    interactions = [
        {
            "product_id": str(i.product_id) if i.product_id else None,
            "user_id": str(i.user_id) if i.user_id else None,
            "session_id": i.session_id,
            "weight": i.weight,
        }
        for i in interactions_result.scalars().all()
        if i.product_id
    ]

    rec_ids = get_hybrid_recommendations(product_id, products, interactions, top_n=top_n)
    rec_products = [p for p in products if str(p.id) in rec_ids]
    # preserve recommendation order
    rec_products.sort(key=lambda p: rec_ids.index(str(p.id)))

    return [ProductOut.model_validate(p) for p in rec_products]


@router.get("/home")
async def recommend_for_home(
    db: AsyncSession = Depends(get_db),
    category: Optional[str] = Query(None, description="Category slug for sector-based recommendations"),
    top_n: int = Query(8, le=20),
):
    """Returns recommendations for the home page strip — popular items or sector-complementary items."""
    products_result = await db.execute(
        select(Product).options(selectinload(Product.category)).where(Product.is_active == True)
    )
    products = products_result.scalars().all()

    if category:
        rec_ids = get_sector_recommendations(category, products, top_n=top_n)
        rec_products = [p for p in products if str(p.id) in rec_ids]
        if rec_products:
            return [ProductOut.model_validate(p) for p in rec_products]

    # fallback: most-interacted-with products (popularity)
    interactions_result = await db.execute(select(Interaction))
    interactions = interactions_result.scalars().all()
    popularity = {}
    for i in interactions:
        if i.product_id:
            popularity[str(i.product_id)] = popularity.get(str(i.product_id), 0) + i.weight

    if popularity:
        sorted_ids = sorted(popularity.keys(), key=lambda k: popularity[k], reverse=True)[:top_n]
        rec_products = [p for p in products if str(p.id) in sorted_ids]
        if rec_products:
            return [ProductOut.model_validate(p) for p in rec_products]

    # final fallback: just return latest products
    return [ProductOut.model_validate(p) for p in products[:top_n]]
