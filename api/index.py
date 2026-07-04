from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from openai import OpenAI
from typing import Literal
import os
from dotenv import load_dotenv

from .prompts.characters import DEFAULT_CHARACTER, VALID_CHARACTERS
from .prompts.system import build_system_prompt

load_dotenv()

app = FastAPI()

# CORS so the frontend can talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

DEFAULT_CREATIVITY = 50

CharacterId = Literal["professional", "warm_friend", "mindful_guide", "motivational_coach"]

class ChatRequest(BaseModel):
    message: str
    creativity: int = Field(
        default=DEFAULT_CREATIVITY,
        ge=0,
        le=100,
        description="Controls response style from focused (0) to creative (100).",
    )
    character: CharacterId = Field(
        default=DEFAULT_CHARACTER,
        description="Coach persona that shapes tone and coaching style.",
    )

@app.get("/")
def root():
    return {"status": "ok"}

@app.post("/api/chat")
def chat(request: ChatRequest):
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured")

    if request.character not in VALID_CHARACTERS:
        raise HTTPException(status_code=400, detail=f"Invalid character: {request.character}")
    
    try:
        user_message = request.message
        system_prompt = build_system_prompt(
            character=request.character,
            creativity=request.creativity,
        )
        response = client.chat.completions.create(
            model="gpt-5",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
        )
        return {"reply": response.choices[0].message.content}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling OpenAI API: {str(e)}")

@app.get("/api/health")
def health():
    return {"status": "ok"}