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


def verify_recruiter_access(application_id: int, recruiter_id: int, db: Session):

    application = verify_recruiter_access(application_id, current_user["user_id"], db)

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    job = db.query(Job).filter(Job.id == application.job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.recruiter_id != recruiter_id:
        raise HTTPException(status_code=403, detail="Unauthorized access")

    return application


class QuestionCreate(BaseModel):

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
            (application.match_score * 0.4)
            + (getattr(profile, "skill_score", 0) * 0.3)
            + (getattr(profile, "test_score", 0) * 0.3),
            2,
        )

        result.append(
            {
                "application_id": application.id,
                "candidate_id": user.id,
                "name": user.name,
                "email": user.email,
                "resume_score": getattr(profile, "skill_score", 0),
                "test_score": getattr(profile, "test_score", 0),
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

    new_question = Question(
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

    question = db.query(Question).filter(Question.id == question_id).first()

    if not question:

        raise HTTPException(status_code=404, detail="Not found")

    db.delete(question)

    db.commit()

    return {"message": "Question deleted successfully ✅"}


@router.get("/all-questions")
def get_all_questions(
    current_user: dict = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):

    questions = db.query(Question).all()

    return questions


@router.put("/edit-question/{question_id}")
def edit_question(
    question_id: int,
    data: QuestionCreate,
    current_user: dict = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):

    question = db.query(Question).filter(Question.id == question_id).first()

    if not question:

        raise HTTPException(status_code=404, detail="Not found")

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

        raise HTTPException(status_code=404, detail="Application Not found")

    application.status = status

    db.commit()

    return {"message": "Status updated successfully ✅"}


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
        "test_score": getattr(profile, "test_score", 0),
        "resume_url": getattr(profile, "resume_url", ""),
        "ai_summary": ai_summary,
        "recommendation": recommendation,
        "recruiter_notes": application.recruiter_notes,
        "interview_date": application.interview_date,
        "meeting_link": application.meeting_link,
        "interview_time": application.interview_time,
        "interview_mode": application.interview_mode,
        "interview_notes": application.interview_notes,
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
