from datetime import datetime
from app.core.llm import generate_response

from sqlalchemy.orm import Session
from app.db.models import Complaint

def classify_complaint(db: Session, name: str, email: str, company: str, category: str, description: str):
    prompt = f"""
You are an AI complaint escalation agent for Careflow.

Analyze the complaint and return the result in this exact format:

Summary: ...
Priority: Low/Medium/High
Department: Billing/Technical Support/Verification/Refund/General Support
Sentiment: Calm/Concerned/Frustrated/Angry
Suggested Reply: ...

Customer Name: {name}
Customer Email: {email}
Company: {company}
Complaint Category: {category}
Complaint Description: {description}
"""

    ai_analysis = generate_response(prompt)

    db_complaint = Complaint(
        ticket_id=f"CF-{int(datetime.now().timestamp())}",
        name=name,
        email=email,
        company=company,
        category=category,
        description=description,
        ai_analysis=ai_analysis,
        status="Escalated",
    )
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    return db_complaint


def get_all_complaints(db: Session):
    return db.query(Complaint).order_by(Complaint.created_at.desc()).all()
