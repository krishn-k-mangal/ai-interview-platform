from sqlalchemy import Column, Integer, String, ForeignKey
from app.database.db import Base


class InterviewQuestion(Base):

    __tablename__ = "interview_questions"

    id = Column(Integer, primary_key=True, index=True)

    application_id = Column(
        Integer,
        ForeignKey("applications.id")
    )

    skill = Column(String)

    difficulty = Column(String)

    question = Column(String)