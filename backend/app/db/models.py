from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.db.database import Base

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String, unique=True, index=True)
    name = Column(String)
    email = Column(String)
    company = Column(String)
    category = Column(String)
    description = Column(Text)
    ai_analysis = Column(Text)
    status = Column(String, default="Escalated")
    created_at = Column(DateTime, default=datetime.utcnow)
