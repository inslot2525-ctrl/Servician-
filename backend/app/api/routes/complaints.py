from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.complaint_service import classify_complaint, get_all_complaints

router = APIRouter()


class ComplaintRequest(BaseModel):
    name: str
    email: str
    company: str
    category: str
    description: str


@router.post("/complaints")
def create_complaint(req: ComplaintRequest, db: Session = Depends(get_db)):
    return classify_complaint(
        db=db,
        name=req.name,
        email=req.email,
        company=req.company,
        category=req.category,
        description=req.description,
    )


@router.get("/complaints")
def list_complaints(db: Session = Depends(get_db)):
    return {"complaints": get_all_complaints(db)}
