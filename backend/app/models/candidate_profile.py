from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.database.db import Base
from datetime import datetime


class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    
    # Relationship
    user = relationship("User", backref="profile")

    resume_url = Column(String, nullable=True)

    resume_file = Column(String, nullable=True)

    skills = Column(String, nullable=True)

    education = Column(String, nullable=True)

    experience = Column(String, nullable=True)

    skill_score = Column(Float, default=0)

    test_score = Column(Float, default=0)

    final_score = Column(Float, default=0)

    status = Column(String, default="applied")

    resume_quality_score = Column(Float, default=0)

    ai_summary = Column(String)

    ai_strengths = Column(JSON)

    ai_weaknesses = Column(JSON)

    focus_areas = Column(JSON)

    red_flags = Column(JSON)

    ai_missing_sections = Column(String)

    ai_suggestions = Column(JSON)

    ai_last_updated = Column(DateTime, default=datetime.utcnow)

    resume_public_id = Column(String, nullable=True)
