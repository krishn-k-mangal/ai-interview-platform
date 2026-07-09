from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.question import Question
from app.models.application import Application
from app.utils.deps import require_role
from app.models.candidate_profile import CandidateProfile
from app.utils.scoring import calculate_final_score
from datetime import datetime
from app.models.job import Job

router = APIRouter(prefix="/test", tags=["Test"])


@router.get("/questions/{application_id}")
def get_questions(
    application_id: int,
    current_user: dict = Depends(require_role("candidate")),
    db: Session = Depends(get_db),
):

    application = (
        db.query(Application)
        .filter(
            Application.id == application_id,
            Application.candidate_id == current_user["user_id"],
        )
        .first()
    )

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    if application.test_completed:
        raise HTTPException(
            status_code=400, detail="You have already completed this test."
        )

    profile = (
        db.query(CandidateProfile)
        .filter(CandidateProfile.user_id == current_user["user_id"])
        .first()
    )

    if not profile:
        raise HTTPException(
            status_code=400, detail="Please upload your resume before taking the test."
        )

    questions = db.query(Question).filter(Question.job_id == application.job_id).all()

    result = []

    for q in questions:
        result.append(
            {
                "id": q.id,
                "question": q.question,
                "options": [
                    q.option1,
                    q.option2,
                    q.option3,
                    q.option4,
                ],
            }
        )

    return result


@router.post("/submit-test/{application_id}")
def submit_test(
    application_id: int,
    answers: dict,
    current_user: dict = Depends(require_role("candidate")),
    db: Session = Depends(get_db),
):

    if not answers:
        raise HTTPException(status_code=400, detail="No answers submitted.")

    application = (
        db.query(Application)
        .filter(
            Application.id == application_id,
            Application.candidate_id == current_user["user_id"],
        )
        .first()
    )

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    if application.test_completed:
        raise HTTPException(status_code=400, detail="Test has already been submitted.")

    score = 0

    for q_id, answer in answers.items():

        question = (
            db.query(Question)
            .filter(
                Question.id == int(q_id),
                Question.job_id == application.job_id,
            )
            .first()
        )

        if question and answer == question.correct_answer:
            score += 10

    # get candidate profile
    profile = (
        db.query(CandidateProfile)
        .filter(CandidateProfile.user_id == current_user["user_id"])
        .first()
    )

    if not profile:
        return {"error": "Upload resume first ❌"}

    # simple final score (for now)
    final_score = calculate_final_score(
        profile.skill_score, score, profile.resume_quality_score
    )

    application.test_score = score
    application.final_score = final_score
    application.test_completed = True
    application.test_submitted_at = datetime.utcnow()

    db.commit()
    db.refresh(application)

    return {
        "message": "Test submitted successfully ✅",
        "application_id": application.id,
        "test_score": application.test_score,
        "final_score": application.final_score,
        "test_completed": application.test_completed,
    }


@router.get("/result/{application_id}")
def get_test_result(
    application_id: int,
    current_user: dict = Depends(require_role("candidate")),
    db: Session = Depends(get_db),
):

    # Verify application belongs to candidate
    application = (
        db.query(Application)
        .filter(
            Application.id == application_id,
            Application.candidate_id == current_user["user_id"],
        )
        .first()
    )

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    # Get Job
    job = db.query(Job).filter(Job.id == application.job_id).first()

    # Get Candidate Profile
    profile = (
        db.query(CandidateProfile)
        .filter(CandidateProfile.user_id == current_user["user_id"])
        .first()
    )

    return {
        "job_title": job.title,
        "resume_score": profile.skill_score if profile else 0,
        "resume_quality_score": profile.resume_quality_score if profile else 0,
        "match_score": application.match_score,
        "test_score": application.test_score,
        "final_score": application.final_score,
        "status": application.status,
        "recommendation": application.recommendation,
    }
