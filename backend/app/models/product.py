import uuid
from sqlalchemy import Column, String, Boolean, Text, Integer, Numeric, Float, ForeignKey, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID, ARRAY, JSONB
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from sqlalchemy.orm import relationship

from app.db.session import Base

class Category(Base):
    __tablename__ = "categories"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name        = Column(String(100), nullable=False)
    slug        = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text)
    icon        = Column(String(50))
    image_url   = Column(Text)
    sort_order  = Column(Integer, default=0)
    is_active   = Column(Boolean, default=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    products    = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id                   = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    category_id          = Column(UUID(as_uuid=True), ForeignKey("categories.id", ondelete="SET NULL"), index=True)
    name                 = Column(String(200), nullable=False)
    slug                 = Column(String(200), unique=True, nullable=False, index=True)
    description          = Column(Text)
    product_type         = Column(SAEnum("uniform","linen","accessory","saree","other", name="product_type"),
                                  default="uniform")
    fabric               = Column(String(100))
    available_sizes      = Column(ARRAY(String))
    available_colors     = Column(ARRAY(String))
    price_retail         = Column(Numeric(10, 2), nullable=False)
    price_bulk           = Column(Numeric(10, 2))
    moq                  = Column(Integer, default=10)
    stock                = Column(Integer, default=0)
    images               = Column(ARRAY(Text))
    is_bulk_available    = Column(Boolean, default=True)
    is_retail_available  = Column(Boolean, default=True)
    is_active            = Column(Boolean, default=True)
    meta_tags            = Column(ARRAY(String))
    created_at           = Column(DateTime(timezone=True), server_default=func.now())
    updated_at           = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    category = relationship("Category", back_populates="products")

