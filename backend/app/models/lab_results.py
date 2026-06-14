from sqlalchemy import Column, Float, ForeignKey, Integer, String, DateTime, func
from sqlalchemy.orm import relationship

from app.database import Base


class LabResults(Base):
    __tablename__ = "lab_results"

    id = Column(Integer, primary_key=True, autoincrement=True)
    patient_id = Column(String(20), ForeignKey("patients.id"), nullable=False, unique=True)

    # RMI inputs
    ca125 = Column(Float, nullable=False)
    multilocular = Column(Integer, default=0)          # 0 or 1
    solid_component = Column(Integer, default=0)
    bilateral = Column(Integer, default=0)
    ascites = Column(Integer, default=0)
    peritoneal_metastasis = Column(Integer, default=0)
    u_score = Column(Integer, default=0)               # 0, 1, or 3
    m_score = Column(Integer, default=1)               # 1 or 3
    rmi = Column(Float)

    # Blood markers
    glucose = Column(Float)
    triglycerides = Column(Float)
    hdl = Column(Float)
    tyg_index = Column(Float)

    recorded_at = Column(DateTime(timezone=True), server_default=func.now())

    patient = relationship("Patient", back_populates="lab_results")
