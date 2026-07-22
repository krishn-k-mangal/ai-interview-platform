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
from pydantic import BaseModel
from app.models.application import Application
from sqlalchemy import func
from app.storage.cloudinary_service import upload_resume_to_cloudinary, delete_resume


class CandidateProfileUpdate(BaseModel):
    name: str = None
    phone: str = None
    location: str = None
    education: str = None
    experience: str = None


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

    if not file.filename.lower().endswith(".pdf"):

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
    try:
        analysis = analyze_resume(
            resume_text=text,
            skills=skills,
            resume_quality_score=resume_quality_score,
        )

    except Exception as e:
        print(f"AI Analysis failed: {e}")
        analysis = {
            "summary": "AI Analysis is temporarily unavailable due to API rate limits or errors. However, your resume has been successfully uploaded and processed for basic skills.",
            "strengths": ["Analysis skipped"],
            "weaknesses": ["Analysis skipped"],
            "missing_sections": ["Analysis skipped"],
            "suggestions": ["Please try again later when the AI quota resets."],
        }
    skill_score = min(len(skills) * 10, 100)

    import traceback

    try:
        upload_result = upload_resume_to_cloudinary(file_path)
    except Exception as e:
        traceback.print_exc()
        print("Cloudinary Error:", e)
        raise

    resume_url = upload_result["url"]
    resume_public_id = upload_result["public_id"]

    
    profile = (
        db.query(CandidateProfile)
        .filter(CandidateProfile.user_id == current_user["user_id"])
        .first()
    )
    if profile and profile.resume_public_id:
        delete_resume(profile.resume_public_id)

    old_public_id = profile.resume_public_id if profile else None
    # update existing profile
    if profile:

        profile.resume_url = resume_url
        profile.resume_public_id = resume_public_id
        profile.resume_file = file.filename

        profile.skill_score = skill_score

        # Don't calculate final_score here anymore.

        profile.skills = ", ".join(skills)

        profile.resume_quality_score = resume_quality_score

        profile.ai_summary = analysis["summary"]

        profile.ai_strengths = analysis["strengths"]

        profile.ai_weaknesses = analysis["weaknesses"]

        profile.ai_missing_sections = analysis["missing_sections"]

        profile.ai_suggestions = analysis["suggestions"]

        profile.ai_last_updated = datetime.utcnow()
    # create new profile
    else:

        profile = CandidateProfile(
            user_id=current_user["user_id"],
            skill_score=skill_score,
            skills=", ".join(skills),
            final_score=calculate_final_score(skill_score, 0, resume_quality_score),
            status="applied",
            resume_quality_score=resume_quality_score,
            ai_summary=analysis["summary"],
            ai_strengths=analysis["strengths"],
            ai_weaknesses=analysis["weaknesses"],
            ai_missing_sections=analysis["missing_sections"],
            ai_suggestions=analysis["suggestions"],
            ai_last_updated=datetime.utcnow(),
            resume_url=resume_url,
            resume_public_id=resume_public_id,
            resume_file=file.filename,
        )

        db.add(profile)

    db.commit()

    if old_public_id:
        delete_resume(old_public_id)

    if os.path.exists(file_path):
        os.remove(file_path)

    return {
        "message": "Resume processed & saved ✅",
        "skills": skills,
        "skill_score": skill_score,
        "resume_quality_score": resume_quality_score,
        "resume_url": resume_url,
    }


@router.get("/my-profile")
def get_my_profile(
    current_user: dict = Depends(require_role("candidate")),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()

    if not user:
        return {"message": "User not found"}

    profile = (
        db.query(CandidateProfile)
        .filter(CandidateProfile.user_id == current_user["user_id"])
        .first()
    )

    if not profile:
        return {
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "location": user.location,
            "message": "No profile found",
        }

    # Parse JSON-encoded AI fields safely
    def safe_json_parse(val):
        if not val:
            return []
        try:
            parsed = json.loads(val) if isinstance(val, str) else val
            return parsed if isinstance(parsed, list) else []
        except (json.JSONDecodeError, TypeError):
            return []

    completed_apps = (
        db.query(Application)
        .filter(
            Application.candidate_id == current_user["user_id"],
            Application.test_completed == True,
        )
        .order_by(Application.test_submitted_at.desc())
        .all()
    )

    if completed_apps:
        latest_app = completed_apps[0]
        latest_test_score = latest_app.test_score
        latest_final_score = latest_app.final_score
        average_test_score = sum(a.test_score for a in completed_apps) / len(
            completed_apps
        )
        average_final_score = sum(a.final_score for a in completed_apps) / len(
            completed_apps
        )
    else:
        latest_test_score = 0.0
        latest_final_score = calculate_final_score(
            profile.skill_score, 0.0, profile.resume_quality_score
        )
        average_test_score = 0.0
        average_final_score = 0.0

    return {
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "location": user.location,
        "education": profile.education,
        "experience": profile.experience,
        "skills": profile.skills,
        "resume_date": (
            profile.ai_last_updated.isoformat() if profile.ai_last_updated else None
        ),
        "active_applications_count": db.query(Application).filter(Application.candidate_id == current_user["user_id"]).count(),
        "resume_score": profile.skill_score,
        "test_score": latest_test_score,  # Keep for backward compatibility with older UI parts if any
        "latest_test_score": latest_test_score,
        "latest_final_score": latest_final_score,
        "average_test_score": average_test_score,
        "average_final_score": average_final_score,
        "final_score": latest_final_score,
        "status": profile.status,
        "resume_quality_score": profile.resume_quality_score,
        "resume_file": profile.resume_file,
        "ai_summary": profile.ai_summary,
        "ai_strengths": safe_json_parse(profile.ai_strengths),
        "ai_weaknesses": safe_json_parse(profile.ai_weaknesses),
        "ai_suggestions": safe_json_parse(profile.ai_suggestions),
    }


@router.put("/update-profile")
def update_profile(
    data: CandidateProfileUpdate,
    current_user: dict = Depends(require_role("candidate")),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if data.name is not None:
        user.name = data.name
    if data.phone is not None:
        user.phone = data.phone
    if data.location is not None:
        user.location = data.location

    profile = (
        db.query(CandidateProfile).filter(CandidateProfile.user_id == user.id).first()
    )
    if not profile:
        # Create empty profile if it doesn't exist
        profile = CandidateProfile(user_id=user.id)
        db.add(profile)

    if data.education is not None:
        profile.education = data.education
    if data.experience is not None:
        profile.experience = data.experience

    db.commit()
    return {"message": "Profile updated successfully"}
