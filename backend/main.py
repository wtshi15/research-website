from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import logging

from . import database, models, ollama_client

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
database.Base.metadata.create_all(bind=database.engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow frontend from any origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Request models
class SurveyRequest(BaseModel):
    answer: str
    other: Optional[str] = None

class ChatRequest(BaseModel):
    session_id: int
    message: str

@app.post("/survey")
def submit_survey(survey: SurveyRequest, db: Session = Depends(get_db)):
    try:
        logger.info(f"Received survey response: {survey}")
        entry = models.SurveyResponse(answer=survey.answer, other=survey.other)
        db.add(entry)
        db.commit()
        db.refresh(entry)
        return {"session_id": entry.id}
    except Exception as e:
        logger.error(f"Error in submit_survey: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.post("/chat")
def chat(req: ChatRequest, db: Session = Depends(get_db)):
    try:
        logger.info(f"Received chat message for session {req.session_id}: {req.message}")
        
        # Get the survey response for this session
        survey_response = db.query(models.SurveyResponse).filter(models.SurveyResponse.id == req.session_id).first()
        if not survey_response:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Save user message
        user_msg = models.ChatMessage(session_id=req.session_id, sender="user", message=req.message)
        db.add(user_msg)
        db.flush()
        
        # Get conversation history
        chat_history = db.query(models.ChatMessage).filter(
            models.ChatMessage.session_id == req.session_id
        ).order_by(models.ChatMessage.timestamp).all()
        
        # Count user messages to determine conversation turn
        user_msg_count = sum(1 for msg in chat_history if msg.sender == "user")
        
        # Generate appropriate prompt based on conversation turn
        if user_msg_count == 1:
            # First user message - ask about their favorite part
            news_source = survey_response.other if survey_response.answer == "Other" and survey_response.other else survey_response.answer
            prompt = f"The user's favorite news source is {news_source}. They said: '{req.message}'. Ask them how often they consume news from {news_source}."
        elif user_msg_count == 2:
            # Second user message - ask about balanced coverage
            news_source = survey_response.other if survey_response.answer == "Other" and survey_response.other else survey_response.answer
            prompt = f"The user's favorite news source is {news_source}. They said: '{req.message}'. Ask them if they think {news_source} provides balanced coverage of important topics."
        else:
            # Third or later message - wrap up conversation
            prompt = f"The user said: '{req.message}'. Thank them for sharing their thoughts and tell them we've completed this part of the study."
        
        # Generate LLM response
        try:
            reply = ollama_client.query_model(prompt)
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            reply = "I'm sorry, I'm having trouble processing your message. Could you try again?"
        
        # Save bot message
        bot_msg = models.ChatMessage(session_id=req.session_id, sender="llm", message=reply)
        db.add(bot_msg)
        db.commit()
        
        return {"response": reply}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in chat: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@app.get("/health")
def health_check():
    return {"status": "ok"}
