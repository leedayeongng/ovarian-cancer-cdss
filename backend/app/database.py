from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# TODO: 실제 연결 시 환경변수로 교체
DATABASE_URL = "postgresql://user:password@localhost:5432/ovaguard"

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
