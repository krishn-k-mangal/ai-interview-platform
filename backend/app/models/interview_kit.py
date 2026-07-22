from sqlalchemy import (
    Column,
    Integer,
    Text,
    Boolean,
    ForeignKey,
    DateTime,
    Float,
    String,
)
from datetime import datetime

from app.database.db import Base


class InterviewKit(Base):

    __tablename__ = "interview_kits"

    id = Column(Integer, primary_key=True, index=True)

    application_id = Column(Integer, ForeignKey("applications.id"))

    version = Column(Integer, default=1)

    active = Column(Boolean, default=True)

    candidate_summary = Column(Text)

    strengths = Column(Text)

    weaknesses = Column(Text)

    focus_areas = Column(Text)

    red_flags = Column(Text)

    hiring_recommendation = Column(String)

    confidence_score = Column(Float)

    created_at = Column(DateTime, default=datetime.utcnow)
