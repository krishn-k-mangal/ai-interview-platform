from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse
from pydantic import BaseModel

from app.database.db import get_db
from app.models.user import User
from app.models.candidate_profile import CandidateProfile
from app.models.question import Question
from app.utils.deps import require_role
from app.utils.ai_summary import generate_ai_summary
from app.utils.recommendation import get_recommendation_label
from app.models.application import Application
from app.models.job import Job

from fastapi import HTTPException

VALID_STATUSES = [
    "APPLIED",
    "SCREENING",
    "SHORTLISTED",
    "INTERVIEW_SCHEDULED",
    "TECHNICAL_ROUND",
    "HR_ROUND",
    "SELECTED",
    "REJECTED",
]


def verify_recruiter_access(application_id: int, recruiter_id: int, db: Session):

    application = db.query(Application).filter(Application.id == application_id).first()

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    job = db.query(Job).filter(Job.id == application.job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.recruiter_id != recruiter_id:
        raise HTTPException(status_code=403, detail="Unauthorized access")

    return application


def verify_question_access(
    question_id: int,
    recruiter_id: int,
    db: Session,
):
    question = db.query(Question).filter(Question.id == question_id).first()

    if not question:
        raise HTTPException(404, "Question not found")

    job = db.query(Job).filter(Job.id == question.job_id).first()

    if not job or job.recruiter_id != recruiter_id:
        raise HTTPException(403, "Unauthorized")

    return question


class QuestionCreate(BaseModel):
    job_id: int

    question: str

    option1: str
    option2: str
    option3: str
    option4: str

    correct_answer: str


router = APIRouter(prefix="/recruiter", tags=["Recruiter"])


# 🔥 Get all candidates
@router.get("/candidates")
def get_candidates(
    current_user: dict = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):

    jobs = db.query(Job).filter(Job.recruiter_id == current_user["user_id"]).all()

    job_ids = [job.id for job in jobs]

    applications = db.query(Application).filter(Application.job_id.in_(job_ids)).all()

    result = []

    for application in applications:

        user = db.query(User).filter(User.id == application.candidate_id).first()

        profile = (
            db.query(CandidateProfile)
            .filter(CandidateProfile.user_id == application.candidate_id)
            .first()
        )

        overall_score = round(
            (application.match_score * 0.5)
            + (getattr(profile, "skill_score", 0) * 0.3)
            + (application.test_score * 0.2),
            2,
        )
        result.append(
            {
                "application_id": application.id,
                "candidate_id": user.id,
                "name": user.name,
                "email": user.email,
                "resume_score": getattr(profile, "skill_score", 0),
                "test_score": application.test_score,
                "overall_score": overall_score,
                "status": application.status,
                "match_score": application.match_score,
            }
        )

    result.sort(key=lambda x: x["overall_score"], reverse=True)
    for index, candidate in enumerate(result, start=1):
        candidate["rank"] = index
    return result


@router.post("/add-question")
def add_question(
    data: QuestionCreate,
    current_user: dict = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):
    job = (
        db.query(Job)
        .filter(
            Job.id == data.job_id,
            Job.recruiter_id == current_user["user_id"],
        )
        .first()
    )

    if not job:
        raise HTTPException(status_code=403, detail="Unauthorized")

    new_question = Question(
        job_id=data.job_id,
        question=data.question,
        option1=data.option1,
        option2=data.option2,
        option3=data.option3,
        option4=data.option4,
        correct_answer=data.correct_answer,
    )

    db.add(new_question)

    db.commit()

    db.refresh(new_question)

    return {"message": "Question added successfully ✅"}


@router.delete("/delete-question/{question_id}")
def delete_question(
    question_id: int,
    current_user: dict = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):

    question = verify_question_access(
        question_id,
        current_user["user_id"],
        db,
    )
    db.delete(question)

    db.commit()

    return {"message": "Question deleted successfully ✅"}


@router.get("/all-questions/{job_id}")
def get_all_questions(
    job_id: int,
    current_user: dict = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):

    questions = db.query(Question).filter(Question.job_id == job_id).all()

    return questions


@router.put("/edit-question/{question_id}")
def edit_question(
    question_id: int,
    data: QuestionCreate,
    current_user: dict = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):

    question = verify_question_access(
        question_id,
        current_user["user_id"],
        db,
    )

    question.question = data.question

    question.option1 = data.option1
    question.option2 = data.option2
    question.option3 = data.option3
    question.option4 = data.option4

    question.correct_answer = data.correct_answer

    db.commit()

    return {"message": "Question updated successfully ✅"}


@router.put("/update-status/{application_id}")
def update_status(
    application_id: int,
    status: str,
    current_user: dict = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):

    application = verify_recruiter_access(application_id, current_user["user_id"], db)

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    status = status.upper()

    if status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")

    current_status = application.status.upper()

    # Final states cannot be changed
    if current_status in ["SELECTED", "REJECTED"]:
        raise HTTPException(status_code=400, detail="Final status cannot be changed")

    STATUS_FLOW = {
        "APPLIED": ["SCREENING", "REJECTED"],
        "SCREENING": ["SHORTLISTED", "REJECTED"],
        "SHORTLISTED": ["INTERVIEW_SCHEDULED", "REJECTED"],
        "INTERVIEW_SCHEDULED": ["TECHNICAL_ROUND", "REJECTED"],
        "TECHNICAL_ROUND": ["HR_ROUND", "REJECTED"],
        "HR_ROUND": ["SELECTED", "REJECTED"],
    }

    if status not in STATUS_FLOW.get(current_status, []):
        raise HTTPException(
            status_code=400, detail=f"Cannot move from {current_status} to {status}"
        )

    application.status = status

    db.commit()
    db.refresh(application)

    return {"message": "Status updated successfully ✅", "status": application.status}


@router.get("/application/{application_id}")
def get_candidate_details(
    application_id: int,
    current_user: dict = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):

    # get application first
    application = verify_recruiter_access(application_id, current_user["user_id"], db)

    if not application:

        raise HTTPException(status_code=404, detail="Application Not found")

    # get user
    user = db.query(User).filter(User.id == application.candidate_id).first()

    if not user:

        raise HTTPException(status_code=404, detail="User Not found")

    # get profile
    profile = (
        db.query(CandidateProfile)
        .filter(CandidateProfile.user_id == application.candidate_id)
        .first()
    )

    ai_summary = generate_ai_summary(
        application.match_score, application.matched_skills, application.missing_skills
    )
    recommendation = get_recommendation_label(application.match_score)

    return {
        "candidate_id": user.id,
        "name": user.name,
        "email": user.email,
        "match_score": application.match_score,
        "matched_skills": application.matched_skills,
        "missing_skills": application.missing_skills,
        "extra_skills": application.extra_skills,
        "status": application.status,
        "resume_score": getattr(profile, "skill_score", 0),
        "resume_quality_score": getattr(profile, "resume_quality_score", 0),
        "test_score": application.test_score,
        "final_score": application.final_score,
        "test_completed": application.test_completed,
        "resume_url": getattr(profile, "resume_url", ""),
        "ai_summary": ai_summary,
        "recommendation": recommendation,
        "recruiter_notes": application.recruiter_notes,
        "interview_date": application.interview_date,
        "meeting_link": application.meeting_link,
        "interview_time": application.interview_time,
        "interview_mode": application.interview_mode,
        "interview_notes": application.interview_notes,
        # "ranking_score": application.ranking_score,
    }


@router.get("/resume/{candidate_id}")
def view_resume(
    candidate_id: int,
    current_user: dict = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):

    profile = (
        db.query(CandidateProfile)
        .filter(CandidateProfile.user_id == candidate_id)
        .first()
    )

    if not profile:

        raise HTTPException(status_code=404, detail="Profile Not found")

    if not profile.resume_url:

        raise HTTPException(status_code=404, detail="Resume Not found")

    return FileResponse(
        path=profile.resume_url,
        media_type="application/pdf",
        filename=profile.resume_file,
    )
