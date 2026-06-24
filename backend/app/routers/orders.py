from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional, List, Any
from uuid import UUID

from app.db.session import get_db
from app.models.order import Order
from app.core.security import get_current_user, require_admin

router = APIRouter()

class OrderCreate(BaseModel):
    items: List[Any]
    subtotal: float
    gst_amount: float = 0
    shipping: float = 0
    discount: float = 0
    total: float
    delivery_address: Optional[str] = None
    delivery_city: Optional[str] = None
    delivery_state: Optional[str] = None
    delivery_pincode: Optional[str] = None
    notes: Optional[str] = None

@router.post("", status_code=201)
async def create_order(
    data: OrderCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    import razorpay, os
    from app.core.config import settings

    rz_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
    rz_order = rz_client.order.create({
        "amount": int(data.total * 100),
        "currency": "INR",
        "receipt": f"order_{current_user.id}"[:40],
    })

    order = Order(
        user_id=current_user.id,
        order_type="retail",
        items=data.items,
        subtotal=data.subtotal,
        gst_amount=data.gst_amount,
        shipping=data.shipping,
        discount=data.discount,
        total=data.total,
        delivery_address=data.delivery_address,
        delivery_city=data.delivery_city,
        delivery_state=data.delivery_state,
        delivery_pincode=data.delivery_pincode,
        razorpay_order_id=rz_order["id"],
    )
    db.add(order)
    await db.flush()
    return {"id": str(order.id), "razorpay_order_id": rz_order["id"], "total": data.total}

@router.post("/{order_id}/confirm")
async def confirm_order(
    order_id: UUID,
    payload: dict,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.razorpay_payment_id = payload.get("razorpay_payment_id")
    order.payment_status = "paid"
    order.status = "confirmed"
    await db.flush()
    return {"id": str(order.id), "status": "confirmed"}

@router.get("/my")
async def my_orders(db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    result = await db.execute(select(Order).where(Order.user_id == current_user.id).order_by(Order.created_at.desc()))
    orders = result.scalars().all()
    return [{"id": str(o.id), "status": o.status, "payment_status": o.payment_status,
             "total": o.total, "items": o.items, "created_at": o.created_at} for o in orders]
