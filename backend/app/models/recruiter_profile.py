from sqlalchemy import Column, Integer, String
from app.database.db import Base

class RecruiterProfile(Base):
    __tablename__ = "recruiter_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, unique=True, index=True)
    company = Column(String, nullable=True)
    designation = Column(String, nullable=True)
