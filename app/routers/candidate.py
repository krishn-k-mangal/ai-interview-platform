from fastapi import UploadFile, File, APIRouter, Depends, HTTPException
import os
import json

from datetime import datetime

from app.services.ai_service import analyze_resume

from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.user import User
from app.utils.deps import require_role
from app.models.candidate_profile import CandidateProfile
from app.utils.resume_parser import extract_text_from_pdf, extract_skills
from app.utils.scoring import calculate_final_score
from app.utils.resume_quality import calculate_resume_quality

router = APIRouter(prefix="/candidate", tags=["Candidate"])


@router.get("/test")
def test_candidate():
    return {"message": "Candidate router working ✅"}


@router.get("/dashboard")
def candidate_dashboard(current_user: dict = Depends(require_role("candidate"))):
    return {"message": "Candidate Dashboard ✅", "user": current_user}


@router.post("/upload-resume")
def upload_resume(
    file: UploadFile = File(...),
    current_user: dict = Depends(require_role("candidate")),
    db: Session = Depends(get_db),
):

    if not file.filename.endswith(".pdf"):

        raise HTTPException(status_code=400, detail="Only PDF files allowed")

    # save file
    upload_folder = "uploads"
    os.makedirs(upload_folder, exist_ok=True)

    file_path = os.path.join(
        upload_folder, f"{current_user['user_id']}_{file.filename}"
    )

    with open(file_path, "wb") as f:
        f.write(file.file.read())

    # 🔥 parse resume
    text = extract_text_from_pdf(file_path)
    skills = extract_skills(text)
    resume_quality_score = calculate_resume_quality(text, skills)
    # AI Resume Analysis
    analysis = analyze_resume(
        resume_text=text,
        skills=skills,
        resume_quality_score=resume_quality_score,
    )
    skill_score = min(len(skills) * 10, 100)

    # 🔥 SAVE TO DB (THIS IS YOUR ANSWER)
    # 🔥 SAVE TO DB (THIS IS YOUR ANSWER)
    # check existing profile
    profile = (
        db.query(CandidateProfile)
        .filter(CandidateProfile.user_id == current_user["user_id"])
        .first()
    )
    if profile and profile.resume_path:

        if os.path.exists(profile.resume_path):
            os.remove(profile.resume_path)
    # update existing profile
    if profile:

        profile.resume_path = file_path

        profile.resume_file = f"{current_user['user_id']}_{file.filename}"

        profile.skill_score = skill_score

        profile.final_score = calculate_final_score(
            skill_score, getattr(profile, "test_score", 0), resume_quality_score
        )

        profile.skills = ", ".join(skills)

        profile.resume_quality_score = resume_quality_score

        profile.ai_summary = analysis["summary"]

        profile.ai_strengths = json.dumps(analysis["strengths"])

        profile.ai_weaknesses = json.dumps(analysis["weaknesses"])

        profile.ai_missing_sections = json.dumps(analysis["missing_sections"])

        profile.ai_suggestions = json.dumps(analysis["suggestions"])

        profile.ai_last_updated = datetime.utcnow()
    # create new profile
    else:

        profile = CandidateProfile(
            user_id=current_user["user_id"],
            resume_path=file_path,
            resume_file=f"{current_user['user_id']}_{file.filename}",
            skill_score=skill_score,
            skills=", ".join(skills),
            final_score=calculate_final_score(skill_score, 0, resume_quality_score),
            status="applied",
            resume_quality_score=resume_quality_score,
            ai_summary=analysis["summary"],
            ai_strengths=json.dumps(analysis["strengths"]),
            ai_weaknesses=json.dumps(analysis["weaknesses"]),
            ai_missing_sections=json.dumps(analysis["missing_sections"]),
            ai_suggestions=json.dumps(analysis["suggestions"]),
            ai_last_updated=datetime.utcnow(),
        )

        db.add(profile)

    db.commit()

    return {
        "message": "Resume processed & saved ✅",
        "skills": skills,
        "skill_score": skill_score,
        "resume_quality_score": resume_quality_score,
    }


@router.get("/my-profile")
def get_my_profile(
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db),
):

    profile = (
        db.query(CandidateProfile)
        .filter(CandidateProfile.user_id == current_user["user_id"])
        .first()
    )

    if not profile:
        return {"message": "No profile found"}

    final_score = profile.final_score

    return {
        "resume_score": profile.skill_score,
        "test_score": profile.test_score,
        "final_score": calculate_final_score(
            profile.skill_score, profile.test_score, profile.resume_quality_score
        ),
        "status": profile.status,
        "resume_quality_score": profile.resume_quality_score,
    }
