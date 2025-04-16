# backend/schemas.py
from pydantic import BaseModel
from typing import Optional

class SurveyRequest(BaseModel):
    answer: str
    other: Optional[str] = None

class ChatRequest(BaseModel):
    session_id: int
    message: str
