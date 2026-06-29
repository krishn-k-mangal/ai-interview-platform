from sqlalchemy import Column, Integer, String, Float, DateTime
from app.database.db import Base
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSONB


class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer)

    resume_path = Column(String, nullable=True)

    resume_url = Column(String, nullable=True)

    resume_file = Column(String, nullable=True)

    skills = Column(String, nullable=True)

    skill_score = Column(Float, default=0)

    test_score = Column(Float, default=0)

    final_score = Column(Float, default=0)

    status = Column(String, default="applied")

    resume_quality_score = Column(Float, default=0)

    ai_summary = Column(String)

    ai_strengths = Column(JSONB)
    
    ai_weaknesses = Column(JSONB)
    
    focus_areas = Column(JSONB)
    
    red_flags = Column(JSONB)

    ai_missing_sections = Column(String)

    ai_suggestions = Column(String)

    ai_last_updated = Column(DateTime, default=datetime.utcnow)
