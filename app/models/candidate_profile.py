from sqlalchemy import Column, Integer, String, Float
from app.database.db import Base


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