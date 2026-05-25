from sqlalchemy import Column, Integer, String, Text

from app.database.db import Base

class Job(Base):

    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String)

    description = Column(Text)

    required_skills = Column(Text)

    experience = Column(String)

    salary = Column(String)

    location = Column(String)

    recruiter_id = Column(Integer)