from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.utils.deps import require_role
from app.models.interview_kit import InterviewKit
from app.services.interview_kit_service import generate_interview_kit
from app.routers.recruiter import verify_recruiter_access
from app.models.job import Job
from app.models.candidate_profile import CandidateProfile
from app.models.interview_question import InterviewQuestion
import json

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/interview-kit/{application_id}")
def create_interview_kit(
    application_id: int,
    current_user: dict = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):

    application = verify_recruiter_access(
        application_id,
        current_user["user_id"],
        db,
    )

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    existing_kit = (
        db.query(InterviewKit)
        .filter(
            InterviewKit.application_id == application.id,
            InterviewKit.active == True,
        )
        .first()
    )

    if existing_kit:
        return {
            "message": "Interview Kit already exists",
            "kit_id": existing_kit.id,
        }

    job = db.query(Job).filter(Job.id == application.job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    profile = (
        db.query(CandidateProfile)
        .filter(CandidateProfile.user_id == application.candidate_id)
        .first()
    )

    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found")

    result = generate_interview_kit(
        job_title=job.title,
        job_description=job.description,
        required_skills=job.required_skills.split(","),
        candidate_skills=profile.skills.split(","),
        match_score=application.match_score,
        resume_score=profile.resume_quality_score,
        test_score=profile.test_score,
        ai_summary=profile.ai_summary,
    )
    # print("========== AI RESULT ==========")
    # print(result)
    # print("===============================")
    kit = InterviewKit(
        application_id=application.id,
        version=1,
        active=True,
        candidate_summary=result["candidate_summary"],
        strengths=json.dumps(result["strengths"]),
        weaknesses=json.dumps(result["weaknesses"]),
        focus_areas=json.dumps(result["focus_areas"]),
        red_flags=json.dumps(result["red_flags"]),
        hiring_recommendation=result.get(
            "hiring_recommendation", "Needs Manual Review"
        ),
        confidence_score=result.get("confidence_score", 0),
    )

    db.add(kit)
    db.commit()
    db.refresh(kit)

    for item in result["questions"]:

        question = InterviewQuestion(
            application_id=application.id,
            skill=item["skill"],
            difficulty=item["difficulty"],
            question=item["question"],
        )

        db.add(question)

    db.commit()

    return {
        "message": "Interview Kit Generated Successfully",
        "kit_id": kit.id,
        "question_count": len(result["questions"]),
        "recommendation": kit.hiring_recommendation,
        "confidence": kit.confidence_score,
    }
