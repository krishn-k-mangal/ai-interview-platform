from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.db import engine, Base
from app.models.user import User
from app.models.candidate_profile import CandidateProfile
from app.models.question import Question
from app.routers import auth, candidate, recruiter, test, job
from dotenv import load_dotenv
from app.routers import ai
import os


load_dotenv()
# print("FRONTEND_URL =", os.getenv("FRONTEND_URL"))

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
            "http://localhost:5173",
            os.getenv("FRONTEND_URL")
        ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(candidate.router)
app.include_router(recruiter.router)
app.include_router(test.router)
app.include_router(job.router)
app.include_router(ai.router)