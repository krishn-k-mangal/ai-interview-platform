from sqlalchemy import Column, Integer, String, Float
from app.database.db import Base

class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    resume_path = Column(String)
    skill_score = Column(Float)
    test_score = Column(Float, default=0)
    status = Column(String, default="pending")
    final_score = Column(Float, default=0)
    resume_file = Column(String, nullable=True)
    skills = Column(String, nullable=True)
