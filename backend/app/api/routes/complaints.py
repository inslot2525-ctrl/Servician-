from fastapi import APIRouter
from pydantic import BaseModel

from app.services.complaint_service import classify_complaint, get_all_complaints

router = APIRouter()


class ComplaintRequest(BaseModel):
    name: str
    email: str
    company: str
    category: str
    description: str


@router.post("/complaints")
def create_complaint(req: ComplaintRequest):
    return classify_complaint(
        name=req.name,
        email=req.email,
        company=req.company,
        category=req.category,
        description=req.description,
    )


@router.get("/complaints")
def list_complaints():
    return {"complaints": get_all_complaints()}
