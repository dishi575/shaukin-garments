from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class CategoryOut(BaseModel):
    id: UUID
    name: str
    slug: str
    description: Optional[str]
    icon: Optional[str]
    image_url: Optional[str]
    sort_order: int

    model_config = {"from_attributes": True}

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    product_type: str = "uniform"
    fabric: Optional[str] = None
    available_sizes: Optional[List[str]] = None
    available_colors: Optional[List[str]] = None
    price_retail: float
    price_bulk: Optional[float] = None
    moq: int = 10
    is_bulk_available: bool = True
    is_retail_available: bool = True
    meta_tags: Optional[List[str]] = None

class ProductCreate(ProductBase):
    category_id: Optional[UUID] = None
    slug: str
    stock: int = 0

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    fabric: Optional[str] = None
    available_sizes: Optional[List[str]] = None
    available_colors: Optional[List[str]] = None
    price_retail: Optional[float] = None
    price_bulk: Optional[float] = None
    moq: Optional[int] = None
    stock: Optional[int] = None
    is_active: Optional[bool] = None

class ProductOut(ProductBase):
    id: UUID
    slug: str
    category_id: Optional[UUID]
    category: Optional[CategoryOut]
    stock: int
    images: Optional[List[str]]
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}

class ProductListOut(BaseModel):
    items: List[ProductOut]
    total: int
    page: int
    pages: int
