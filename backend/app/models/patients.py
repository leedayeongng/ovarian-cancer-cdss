from sqlalchemy import Boolean, Column, Float, Integer, String, Enum as SAEnum, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import enum

from app.database import Base


class PatientStatus(str, enum.Enum):
    active = "외래 활성"
    follow_up = "추적 관찰"
    referred = "의뢰 완료"
    review = "검토 필요"
    admitted = "입원 중"


class Patient(Base):
    __tablename__ = "patients"

    id = Column(String(20), primary_key=True)          # e.g. PT-2024-08934
    name = Column(String(50), nullable=False)
    age = Column(Integer, nullable=False)
    sex = Column(String(1), nullable=False, default="F")
    menopausal = Column(Boolean, nullable=False, default=False)
    bmi = Column(Float)
    height = Column(Float)
    weight = Column(Float)
    study_date = Column(String(10))                    # YYYY-MM-DD
    ward = Column(String(100))
    physician = Column(String(100))
    status = Column(SAEnum(PatientStatus), nullable=False, default=PatientStatus.active)
    symptoms = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    lab_results = relationship("LabResults", back_populates="patient", uselist=False)
    cdss_results = relationship("CDSSResult", back_populates="patient")
