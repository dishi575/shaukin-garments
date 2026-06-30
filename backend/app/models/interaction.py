import uuid
from sqlalchemy import Column, String, ForeignKey, Float, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy import DateTime

from app.db.session import Base

class Interaction(Base):
    __tablename__ = "ml_interactions"
    __table_args__ = {"extend_existing": True}

    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id      = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    session_id   = Column(String(100), index=True)
    product_id   = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), index=True)
    category_id  = Column(UUID(as_uuid=True), ForeignKey("categories.id", ondelete="SET NULL"))
    interaction  = Column(SAEnum("view","search","add_to_cart","quote_request","order","download_catalogue",
                                 name="interaction_type", create_type=False), nullable=False)
    weight       = Column(Float, default=1.0)
    extra_data   = Column(JSONB)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())
