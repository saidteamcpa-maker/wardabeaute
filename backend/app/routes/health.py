from fastapi import APIRouter
from sqlalchemy import text

from ..db import engine

router = APIRouter()


@router.get("/health")
def health():
    db_ok = False
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_ok = True
    except Exception:  # noqa: BLE001
        db_ok = False
    return {"status": "ok", "db": db_ok}
