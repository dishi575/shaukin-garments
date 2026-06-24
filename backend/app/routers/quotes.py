from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import date

from app.db.session import get_db
from app.models.order import BulkQuote
from app.core.security import get_current_user, require_admin

router = APIRouter()

class QuoteCreate(BaseModel):
    guest_name: Optional[str] = None
    guest_email: Optional[str] = None
    guest_phone: Optional[str] = None
    guest_company: Optional[str] = None
    items: List[Any]
    delivery_address: Optional[str] = None
    delivery_city: Optional[str] = None
    delivery_state: Optional[str] = None
    delivery_pincode: Optional[str] = None
    notes: Optional[str] = None
    user_id: Optional[str] = None

class QuoteUpdate(BaseModel):
    status: Optional[str] = None
    quoted_amount: Optional[float] = None
    admin_notes: Optional[str] = None
    valid_until: Optional[date] = None

@router.post("", status_code=201)
async def create_quote(data: QuoteCreate, db: AsyncSession = Depends(get_db)):
    quote = BulkQuote(
        guest_name=data.guest_name,
        guest_email=data.guest_email,
        guest_phone=data.guest_phone,
        guest_company=data.guest_company,
        items=data.items,
        delivery_city=data.delivery_city,
        delivery_state=data.delivery_state,
        delivery_pincode=data.delivery_pincode,
        notes=data.notes,
    )
    db.add(quote)
    await db.flush()
    return {"id": str(quote.id), "status": "pending", "message": "Quote request received"}

@router.get("")
async def list_quotes(db: AsyncSession = Depends(get_db), _admin=Depends(require_admin)):
    result = await db.execute(select(BulkQuote).order_by(BulkQuote.created_at.desc()))
    quotes = result.scalars().all()
    return [{"id": str(q.id), "guest_name": q.guest_name, "guest_company": q.guest_company,
             "guest_phone": q.guest_phone, "items": q.items, "status": q.status,
             "quoted_amount": q.quoted_amount, "created_at": q.created_at} for q in quotes]

@router.patch("/{quote_id}")
async def update_quote(quote_id: UUID, data: QuoteUpdate, db: AsyncSession = Depends(get_db), _admin=Depends(require_admin)):
    result = await db.execute(select(BulkQuote).where(BulkQuote.id == quote_id))
    quote = result.scalar_one_or_none()
    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(quote, field, value)
    await db.flush()
    return {"id": str(quote.id), "status": quote.status}
