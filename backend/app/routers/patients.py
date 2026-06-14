from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db

router = APIRouter(prefix="/patients", tags=["patients"])


class PatientCreate(BaseModel):
    name: str
    age: int
    sex: str = "F"
    menopausal: bool = False
    bmi: Optional[float] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    ward: Optional[str] = None
    physician: Optional[str] = None
    symptoms: Optional[str] = None


class PatientResponse(PatientCreate):
    id: str
    status: str
    study_date: Optional[str] = None

    class Config:
        from_attributes = True


@router.get("/", response_model=list[PatientResponse])
def list_patients(db: Session = Depends(get_db)):
    # TODO: db.query(Patient).all()
    return []


@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: str, db: Session = Depends(get_db)):
    # TODO: db.query(Patient).filter(Patient.id == patient_id).first()
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")


@router.post("/", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(body: PatientCreate, db: Session = Depends(get_db)):
    # TODO: Patient 생성 및 db.add / db.commit
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")


@router.patch("/{patient_id}", response_model=PatientResponse)
def update_patient(patient_id: str, db: Session = Depends(get_db)):
    # TODO: 부분 업데이트
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")
