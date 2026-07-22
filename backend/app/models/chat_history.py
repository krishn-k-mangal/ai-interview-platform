from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

from app.database.db import Base


class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, nullable=False)

    role = Column(String, nullable=False)

    application_id = Column(Integer, nullable=True)

    message = Column(Text, nullable=False)

    response = Column(Text, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)