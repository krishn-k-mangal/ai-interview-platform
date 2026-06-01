from sqlalchemy import Column, Integer, String, Float, Text

from app.database.db import Base

class Application(Base):

    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)

    candidate_id = Column(Integer)

    job_id = Column(Integer)

    status = Column(String, default="pending")

    match_score = Column(Float, default=0)

    matched_skills = Column(String)

    missing_skills = Column(String)

    extra_skills = Column(String)

    ai_summary = Column(Text)

    recommendation = Column(String)
