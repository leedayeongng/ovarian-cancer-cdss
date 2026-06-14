from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db

router = APIRouter(prefix="/referrals", tags=["referrals"])


class ReferralCreate(BaseModel):
    patient_id: str
    hospital: str
    urgency: str                    # "urgent" | "routine"
    clinical_notes: Optional[str] = None


class ReferralResponse(ReferralCreate):
    id: int
    sent_at: Optional[str] = None
    sent_by: Optional[str] = None

    class Config:
        from_attributes = True


@router.get("/", response_model=list[ReferralResponse])
def list_referrals(db: Session = Depends(get_db)):
    # TODO: db.query(Referral).all()
    return []


@router.post("/", response_model=ReferralResponse, status_code=status.HTTP_201_CREATED)
def create_referral(body: ReferralCreate, db: Session = Depends(get_db)):
    # TODO: 의뢰서 생성 및 전송 처리
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Not implemented")


@router.get("/{referral_id}", response_model=ReferralResponse)
def get_referral(referral_id: int, db: Session = Depends(get_db)):
    # TODO: db.query(Referral).filter_by(id).first()
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Referral not found")
