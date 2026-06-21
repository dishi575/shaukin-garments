import uuid
from sqlalchemy import Column, String, Text, Numeric, ForeignKey, Date, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy import DateTime

from app.db.session import Base

class BulkQuote(Base):
    __tablename__ = "bulk_quotes"

    id               = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id          = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    guest_name       = Column(String(120))
    guest_email      = Column(String(255))
    guest_phone      = Column(String(20))
    guest_company    = Column(String(200))
    status           = Column(SAEnum("pending","reviewed","quoted","accepted","rejected","expired",
                                     name="quote_status"), default="pending")
    items            = Column(JSONB, nullable=False)
    delivery_address = Column(Text)
    delivery_city    = Column(String(100))
    delivery_state   = Column(String(100))
    delivery_pincode = Column(String(10))
    notes            = Column(Text)
    quoted_amount    = Column(Numeric(12, 2))
    admin_notes      = Column(Text)
    valid_until      = Column(Date)
    created_at       = Column(DateTime(timezone=True), server_default=func.now())
    updated_at       = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Order(Base):
    __tablename__ = "orders"

    id                   = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id              = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    order_type           = Column(SAEnum("retail","bulk", name="order_type"), default="retail")
    quote_id             = Column(UUID(as_uuid=True), ForeignKey("bulk_quotes.id", ondelete="SET NULL"))
    status               = Column(SAEnum("placed","confirmed","processing","shipped","delivered",
                                         "cancelled","refunded", name="order_status"), default="placed")
    payment_status       = Column(SAEnum("pending","paid","failed","refunded", name="payment_status"),
                                  default="pending")
    razorpay_order_id    = Column(String(100))
    razorpay_payment_id  = Column(String(100))
    items                = Column(JSONB, nullable=False)
    subtotal             = Column(Numeric(12, 2), nullable=False)
    discount             = Column(Numeric(12, 2), default=0)
    gst_amount           = Column(Numeric(12, 2), default=0)
    shipping             = Column(Numeric(10, 2), default=0)
    total                = Column(Numeric(12, 2), nullable=False)
    delivery_address     = Column(Text)
    delivery_city        = Column(String(100))
    delivery_state       = Column(String(100))
    delivery_pincode     = Column(String(10))
    tracking_number      = Column(String(100))
    notes                = Column(Text)
    created_at           = Column(DateTime(timezone=True), server_default=func.now())
    updated_at           = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
