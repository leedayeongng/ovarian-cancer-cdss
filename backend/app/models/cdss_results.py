from sqlalchemy import Column, Float, ForeignKey, Integer, String, Enum as SAEnum, DateTime, func
from sqlalchemy.orm import relationship
import enum

from app.database import Base


class RiskLevel(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"


class CDSSResult(Base):
    __tablename__ = "cdss_results"

    id = Column(Integer, primary_key=True, autoincrement=True)
    patient_id = Column(String(20), ForeignKey("patients.id"), nullable=False)

    # Ultrasound AI
    tumor_detected = Column(Integer, default=0)
    tumor_area = Column(Float)
    malignancy_probability = Column(Float)
    tumor_type = Column(String(100))
    figo_label = Column(String(50))
    border_irregularity = Column(Float)

    # Ensemble model
    xgb_prob = Column(Float)
    lgbm_prob = Column(Float)
    catboost_prob = Column(Float)
    ensemble_prob = Column(Float)

    risk_level = Column(SAEnum(RiskLevel), nullable=False, default=RiskLevel.low)
    analyzed_at = Column(DateTime(timezone=True), server_default=func.now())
    analyzed_by = Column(String(100))                  # physician username

    patient = relationship("Patient", back_populates="cdss_results")
