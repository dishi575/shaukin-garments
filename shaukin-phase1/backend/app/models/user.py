import uuid
from sqlalchemy import Column, String, Boolean, Text, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy import DateTime

from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name          = Column(String(120), nullable=False)
    email         = Column(String(255), unique=True, nullable=False, index=True)
    phone         = Column(String(20))
    whatsapp      = Column(String(20))
    password_hash = Column(Text, nullable=False)
    role          = Column(SAEnum("admin","b2b_client","retail_customer", name="user_role"),
                           nullable=False, default="retail_customer")
    company       = Column(String(200))
    gst_number    = Column(String(20))
    address       = Column(Text)
    city          = Column(String(100))
    state         = Column(String(100))
    pincode       = Column(String(10))
    is_active     = Column(Boolean, default=True)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())
    updated_at    = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
