from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, patients, cdss, referrals

app = FastAPI(
    title="OvaGuard CDSS API",
    version="0.1.0",
    description="난소암 조기진단 AI 임상의사결정지원 시스템",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(cdss.router)
app.include_router(referrals.router)


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}
