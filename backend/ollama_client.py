# backend/ollama_client.py
import requests
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "qwen:0.5b"

def query_model(prompt: str) -> str:
    try:
        logger.info(f"Sending prompt to Ollama: {prompt}")
        response = requests.post(OLLAMA_URL, json={
            "model": MODEL_NAME,
            "prompt": prompt,
            "stream": False
        })
        response.raise_for_status()
        generated_text = response.json()["response"]
        logger.info(f"Model response: {generated_text.strip()}")
        return generated_text.strip()
    except Exception as e:
        logger.error(f"Error querying Ollama: {str(e)}")
        raise
