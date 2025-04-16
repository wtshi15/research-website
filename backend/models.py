# backend/models.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func
from .database import Base

class SurveyResponse(Base):
    __tablename__ = "survey_responses"

    id = Column(Integer, primary_key=True, index=True)
    answer = Column(String, nullable=False)
    other = Column(String, nullable=True)

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("survey_responses.id"), nullable=False)
    sender = Column(String, nullable=False)  # "user" or "llm"
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
