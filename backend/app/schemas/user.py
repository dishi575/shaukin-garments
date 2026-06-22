from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, Literal
from uuid import UUID
from datetime import datetime
import re

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    role: Literal["retail_customer", "b2b_client"] = "retail_customer"
    company: Optional[str] = None
    gst_number: Optional[str] = None

    @field_validator("password")
    @classmethod
    def strong_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: UUID
    name: str
    email: str
    phone: Optional[str]
    whatsapp: Optional[str]
    role: str
    company: Optional[str]
    gst_number: Optional[str]
    city: Optional[str]
    state: Optional[str]
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    company: Optional[str] = None
    gst_number: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
