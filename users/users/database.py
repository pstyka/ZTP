from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from fastapi import Depends
from typing import Generator, Annotated
from sqlalchemy.orm import Session

from users.core.config import settings

engine = create_engine(settings.POSTGRES_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)


def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


Database = Annotated[Session, Depends(get_db)]
