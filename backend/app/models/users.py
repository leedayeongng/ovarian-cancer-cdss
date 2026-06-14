from sqlalchemy import Column, String, Enum as SAEnum, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
import uuid
import enum

from app.database import Base


class UserRole(str, enum.Enum):
    doctor = "doctor"
    nurse = "nurse"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(50), unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SAEnum(UserRole), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
