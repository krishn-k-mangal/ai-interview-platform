from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.schemas.chat import ChatRequest

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db

from app.schemas.chat import ChatRequest
from app.utils.deps import require_role

from app.models.application import Application
from app.models.candidate_profile import CandidateProfile
from app.models.job import Job
from app.models.chat_history import ChatHistory

from app.ai.builders.context_builder import (
    build_candidate_context,
    build_recruiter_context,
)
from app.ai.services.chat_service import generate_chat_response
from app.models.interview_kit import InterviewKit
from app.models.user import User
from app.models.interview_kit import InterviewKit
from app.ai.chat_memory import (
    load_chat_history,
    save_chat_history,
)

from app.ai.services.applicant_analyzer import analyze_applicants
from app.ai.builders.recruiter_dashboard_context import (
    build_recruiter_dashboard_context,
)

router = APIRouter(prefix="/ai/chat", tags=["AI Chat"])


@router.post("/candidate/{application_id}")
def candidate_chat(
    application_id: int,
    request: ChatRequest,
    current_user: dict = Depends(require_role("candidate")),
    db: Session = Depends(get_db),
):

    # Verify application ownership
    application = (
        db.query(Application)
        .filter(
            Application.id == application_id,
            Application.candidate_id == current_user["user_id"],
        )
        .first()
    )

    if not application:
        raise HTTPException(status_code=404, detail="Application not found.")

    # Candidate Profile
    profile = (
        db.query(CandidateProfile)
        .filter(CandidateProfile.user_id == current_user["user_id"])
        .first()
    )

    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found.")

    # Job
    job = db.query(Job).filter(Job.id == application.job_id).first()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    # Last 10 messages
    history = (
        db.query(ChatHistory)
        .filter(
            ChatHistory.user_id == current_user["user_id"],
            ChatHistory.application_id == application_id,
            ChatHistory.role == "candidate",
        )
        .order_by(ChatHistory.created_at.desc())
        .limit(10)
        .all()
    )

    history.reverse()
    interview_kit = (
        db.query(InterviewKit)
        .filter(
            InterviewKit.application_id == application.id,
            InterviewKit.active == True,
        )
        .first()
    )
    # Build Context
    context = build_candidate_context(
        profile,
        application,
        job,
        interview_kit,
    )

    # Generate Response
    result = generate_chat_response(
        role="candidate",
        context=context,
        user_message=request.message,
        history=history,
    )

    # Save Conversation
    save_chat_history(
        db=db,
        user_id=current_user["user_id"],
        role="candidate",
        application_id=application_id,
        message=request.message,
        response=result["answer"],
    )

    return {
        "success": True,
        "application_id": application_id,
        "conversation_saved": True,
        "response": result,
    }


@router.get("/history/{application_id}")
def get_chat_history(
    application_id: int,
    current_user: dict = Depends(require_role("candidate")),
    db: Session = Depends(get_db),
):

    # Verify application ownership
    application = (
        db.query(Application)
        .filter(
            Application.id == application_id,
            Application.candidate_id == current_user["user_id"],
        )
        .first()
    )

    if not application:
        raise HTTPException(status_code=404, detail="Application not found.")

    history = load_chat_history(
        db=db,
        user_id=current_user["user_id"],
        application_id=application_id,
        role="candidate",
    )

    return {
        "success": True,
        "application_id": application_id,
        "total_messages": len(history),
        "messages": [
            {
                "id": chat.id,
                "message": chat.message,
                "response": chat.response,
                "created_at": chat.created_at,
            }
            for chat in history
        ],
    }


@router.delete("/history/{application_id}")
def delete_chat_history(
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
        raise HTTPException(status_code=404, detail="Application not found.")

    deleted = db.query(ChatHistory).filter(
        ChatHistory.user_id == current_user["user_id"],
        ChatHistory.application_id == application_id,
        ChatHistory.role == "candidate",
    )

    count = deleted.count()

    deleted.delete(synchronize_session=False)

    db.commit()

    return {
        "success": True,
        "deleted_messages": count,
        "message": "Chat history deleted successfully.",
    }


@router.post("/recruiter/{job_id}")
def recruiter_chat(
    job_id: int,
    request: ChatRequest,
    current_user: dict = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):

    # Verify recruiter owns the job
    job = (
        db.query(Job)
        .filter(
            Job.id == job_id,
            Job.recruiter_id == current_user["user_id"],
        )
        .first()
    )

    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    # Load applications
    applications = db.query(Application).filter(Application.job_id == job_id).all()

    candidate_ids = [app.candidate_id for app in applications]
    application_ids = [app.id for app in applications]

    # Load candidate profiles
    candidate_profiles = (
        db.query(CandidateProfile)
        .filter(CandidateProfile.user_id.in_(candidate_ids))
        .all()
        if candidate_ids
        else []
    )

    # Load users
    users = (
        db.query(User).filter(User.id.in_(candidate_ids)).all() if candidate_ids else []
    )

    # Load interview kits
    interview_kits = (
        db.query(InterviewKit)
        .filter(
            InterviewKit.application_id.in_(application_ids),
            InterviewKit.active == True,
        )
        .all()
        if application_ids
        else []
    )

    # Build recruiter context
    context = build_recruiter_context(
        job=job,
        applications=applications,
        candidate_profiles=candidate_profiles,
        interview_kits=interview_kits,
        users=users,
    )

    # Load recruiter chat history
    history = load_chat_history(
        db=db,
        user_id=current_user["user_id"],
        application_id=job_id,
        role="recruiter",
    )

    # Generate AI response
    result = generate_chat_response(
        role="recruiter",
        context=context,
        user_message=request.message,
        history=history,
    )

    # Save chat
    save_chat_history(
        db=db,
        user_id=current_user["user_id"],
        role="recruiter",
        application_id=job_id,
        message=request.message,
        response=result["answer"],
    )

    return {
        "success": True,
        "job_id": job_id,
        "conversation_saved": True,
        "response": result,
    }


@router.post("/analyze-applicants/{job_id}")
def analyze_all_applicants(
    job_id: int,
    current_user: dict = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):
    # Verify recruiter owns the job
    job = (
        db.query(Job)
        .filter(
            Job.id == job_id,
            Job.recruiter_id == current_user["user_id"],
        )
        .first()
    )

    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    # Load applications
    applications = db.query(Application).filter(Application.job_id == job_id).all()

    if not applications:
        return {
            "success": True,
            "job_id": job_id,
            "analysis": "No applicants found for this job.",
        }

    candidate_ids = [app.candidate_id for app in applications]
    application_ids = [app.id for app in applications]

    # Candidate Profiles
    candidate_profiles = (
        db.query(CandidateProfile)
        .filter(CandidateProfile.user_id.in_(candidate_ids))
        .all()
    )

    # Interview Kits
    interview_kits = (
        db.query(InterviewKit)
        .filter(
            InterviewKit.application_id.in_(application_ids),
            InterviewKit.active == True,
        )
        .all()
    )

    # Candidate Names
    users = db.query(User).filter(User.id.in_(candidate_ids)).all()

    # Build AI Context
    context = build_recruiter_context(
        job,
        applications,
        candidate_profiles,
        interview_kits,
        users,
    )

    # AI Analysis
    analysis = analyze_applicants(context)

    return {
        "success": True,
        "job_id": job_id,
        "total_applicants": len(applications),
        "analysis": analysis,
    }


@router.post("/recruiter-dashboard")
def recruiter_dashboard_chat(
    request: ChatRequest,
    current_user: dict = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):

    jobs = db.query(Job).filter(Job.recruiter_id == current_user["user_id"]).all()

    job_ids = [job.id for job in jobs]

    applications = db.query(Application).filter(Application.job_id.in_(job_ids)).all()
    candidate_ids = [app.candidate_id for app in applications]
    application_ids = [app.id for app in applications]
    candidate_profiles = (
        db.query(CandidateProfile)
        .filter(CandidateProfile.user_id.in_(candidate_ids))
        .all()
        if candidate_ids
        else []
    )
    users = (
        db.query(User).filter(User.id.in_(candidate_ids)).all() if candidate_ids else []
    )
    
    interview_kits = (
        db.query(InterviewKit)
        .filter(
            InterviewKit.application_id.in_(application_ids),
            InterviewKit.active == True,
        )
        .all()
        if application_ids
        else []
    )
    context = build_recruiter_dashboard_context(
        jobs=jobs,
        applications=applications,
        candidate_profiles=candidate_profiles,
        interview_kits=interview_kits,
        users=users,
    )

    response = generate_chat_response(
        role="recruiter_dashboard",
        context=context,
        user_message=request.message,
        history=[],
    )

    return {"response": response}
