from sqlalchemy import Column, Integer, String, Float

from app.database.db import Base

class Application(Base):

    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)

    candidate_id = Column(Integer)

    job_id = Column(Integer)

    status = Column(String, default="pending")

    match_score = Column(Float, default=0)