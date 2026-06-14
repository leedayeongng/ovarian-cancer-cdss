from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db

router = APIRouter(prefix="/cdss", tags=["cdss"])


class CDSSRunRequest(BaseModel):
    patient_id: str


class CDSSResultResponse(BaseModel):
    patient_id: str
    risk_level: str
    malignancy_probability: float
    ensemble_prob: float
    tumor_type: Optional[str] = None
    figo_label: Optional[str] = None
    analyzed_at: Optional[str] = None

    class Config:
        from_attributes = True


@router.post("/run", response_model=CDSSResultResponse)
def run_analysis(body: CDSSRunRequest, db: Session = Depends(get_db)):
    # TODO: 모델 추론 호출 및 결과 저장
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")


@router.get("/{patient_id}/results", response_model=list[CDSSResultResponse])
def get_results(patient_id: str, db: Session = Depends(get_db)):
    # TODO: db.query(CDSSResult).filter_by(patient_id).all()
    return []


@router.get("/{patient_id}/results/latest", response_model=CDSSResultResponse)
def get_latest_result(patient_id: str, db: Session = Depends(get_db)):
    # TODO: 최신 분석 결과 1건 반환
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No results found")
