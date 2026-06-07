from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.job import Job
from app.utils.deps import require_role
from app.models.application import Application
from app.models.user import User
from app.models.candidate_profile import CandidateProfile
from app.utils.matching import calculate_match
from app.schemas.job import JobCreate
from app.utils.ai_summary import generate_resume_summary
from app.utils.recommendation import get_recommendation_label



router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)

@router.post("/create-job")
def create_job(

    job: JobCreate,

    current_user: dict = Depends(
        require_role("recruiter")
    ),

    db: Session = Depends(get_db)
    ):

    new_job = Job(

        title=job.title,

        description=job.description,

        required_skills=job.required_skills,

        salary=job.salary,

        location=job.location,

        recruiter_id=current_user["user_id"]
    )

    db.add(new_job)

    db.commit()

    return {
        "message": "Job created successfully ✅"
    }

@router.get("/my-jobs")
def get_my_jobs(

    current_user: dict = Depends(require_role("recruiter")),

    db: Session = Depends(get_db)
    ):

    jobs = db.query(Job).filter(
        Job.recruiter_id == current_user["user_id"]
    ).all()

    return jobs


@router.post("/apply/{job_id}")
def apply_job(

    job_id: int,

    current_user: dict = Depends(
        require_role("candidate")
    ),

    db: Session = Depends(get_db)
    ):

    try:

        
        # already applied check
        existing = db.query(Application).filter(

            Application.job_id == job_id,

            Application.candidate_id ==
            current_user["user_id"]

        ).first()

        if existing:

            return {
                "message": "Already applied ❌"
            }

        # get job
        job = db.query(Job).filter(
            Job.id == job_id
        ).first()

        if not job:

            return {
                "message": "Job not found ❌"
            }

        # candidate profile
        profile = db.query(
            CandidateProfile
        ).filter(

            CandidateProfile.user_id ==
            current_user["user_id"]

        ).first()

        if not profile or not profile.skills:

            return {
                "message":
                "Please upload resume first ❌"
            }

        # skills
        candidate_skills = (
            profile.skills.split(",")
        )

        required_skills = (
            job.required_skills.split(",")
        )

        # AI matching
        result = calculate_match(

            candidate_skills,

            required_skills
        )

        recommendation = (
            get_recommendation_label(
                result["match_score"]
            )
        )

        summary = (
            generate_resume_summary(
                candidate_skills
            )
        )

        # create application
        application = Application(

            candidate_id=
            current_user["user_id"],

            job_id=job_id,

            match_score=
            result["match_score"],

            matched_skills=", ".join(
                result["matched_skills"]
            ),

            missing_skills=", ".join(
                result["missing_skills"]
            ),

            extra_skills=", ".join(
                result["extra_skills"]
            ),

            ai_summary=summary,

            recommendation=recommendation,
        )

        db.add(application)

        db.commit()

        db.refresh(application)

        print(
            "✅ APPLICATION SAVED:",
            application.id
        )

        return {

            "message":
            "Applied successfully ✅",

            "application_id":
            application.id
        }

    except Exception as e:

        db.rollback()

        
        raise e
@router.get("/all-jobs")
def get_all_jobs(



    db: Session = Depends(get_db)
    ):

    jobs = db.query(Job).all()

    return jobs


@router.get("/job-applicants/{job_id}")
def get_job_applicants(

    job_id: int,

    current_user: dict = Depends(require_role("recruiter")),

    db: Session = Depends(get_db)
    ):

    # verify recruiter owns this job
    job = db.query(Job).filter(

        Job.id == job_id,

        Job.recruiter_id == current_user["user_id"]

    ).first()

    if not job:

        return {
            "error": "Unauthorized ❌"
        }

    applications = db.query(Application).filter(
    Application.job_id == job_id
    ).order_by(
        Application.match_score.desc()
    ).all()

    result = []

    for app in applications:

        user = db.query(User).filter(
            User.id == app.candidate_id
        ).first()

        profile = db.query(CandidateProfile).filter(
            CandidateProfile.user_id == app.candidate_id
        ).first()

        result.append({

        "application_id": app.id,

        "candidate_id": user.id,

        "name": user.name,

        "email": user.email,

        "resume_score": getattr(profile, "skill_score", 0),

        "test_score": getattr(profile, "test_score", 0),

        "status": app.status,

        "match_score": app.match_score,

        "matched_skills": app.matched_skills,

        "missing_skills": app.missing_skills,

        "extra_skills": app.extra_skills,

        "recommendation": app.recommendation,

        "job_id": app.job_id
    })
    return result

@router.put("/update-notes/{application_id}")
def update_notes(

    application_id: int,

    data: dict,

    current_user: dict = Depends(
        require_role("recruiter")
    ),

    db: Session = Depends(get_db)
    ):

    application = db.query(Application).filter(
        Application.id == application_id
    ).first()

    if not application:

        return {
            "message": "Application not found ❌"
        }

    application.recruiter_notes = data["notes"]

    db.commit()

    return {
        "message": "Notes updated successfully ✅"
    }

@router.put("/schedule-interview/{application_id}")
def schedule_interview(

    application_id: int,

    data: dict,

    current_user: dict = Depends(
        require_role("recruiter")
    ),

    db: Session = Depends(get_db)
    ):

    application = db.query(Application).filter(
        Application.id == application_id
    ).first()

    if not application:
        return {
            "message": "Application not found ❌"
        }
    print("APPLICATION ID:", application_id)
    print("DATA:", data)
    application.interview_date = data["interview_date"]

    application.interview_time = data["interview_time"]

    application.meeting_link = data["meeting_link"]

    application.status = "interview_scheduled"
    print("SAVING...")
    db.commit()

    return {
        "message": "Interview scheduled successfully ✅"
    }

@router.get("/analytics")
def recruiter_analytics(

    current_user: dict = Depends(require_role("recruiter")),

    db: Session = Depends(get_db)
    ):

    # recruiter jobs
    jobs = db.query(Job).filter(
        Job.recruiter_id == current_user["user_id"]
    ).all()

    job_ids = [job.id for job in jobs]

    applications = db.query(Application).filter(
        Application.job_id.in_(job_ids)
    ).all()
    
    applied = len([
    a for a in applications
    if a.status == "applied"
    ])

    screening = len([
        a for a in applications
        if a.status == "screening"
    ])

    interview_scheduled = len([
        a for a in applications
        if a.status == "interview_scheduled"
    ])

    technical_round = len([
        a for a in applications
        if a.status == "technical_round"
    ])

    hr_round = len([
        a for a in applications
        if a.status == "hr_round"
    ])

    total_jobs = len(jobs)

    total_applicants = len(applications)

    shortlisted = len([
        a for a in applications
        if a.status == "shortlisted"
    ])

    rejected = len([
        a for a in applications
        if a.status == "rejected"
    ])

    selected = len([
        a for a in applications
        if a.status == "selected"
    ])

    avg_match = 0

    if applications:

        avg_match = round(

            sum(a.match_score for a in applications)
            /
            len(applications),

            2
        )

    return {

        "total_jobs": total_jobs,

        "total_applicants": total_applicants,

        "shortlisted": shortlisted,

        "rejected": rejected,

        "selected": selected,

        "avg_match_score": avg_match,
        
        "applied": applied,

        "screening": screening,

        "interview_scheduled": interview_scheduled,

        "technical_round": technical_round,

        "hr_round": hr_round,
}

@router.get("/my-applications")
def my_applications(

    current_user: dict = Depends(require_role("candidate")),

    db: Session = Depends(get_db)
    ):

    applications = db.query(Application).filter(
        Application.candidate_id == current_user["user_id"]
    ).all()

    result = []

    for app in applications:

        job = db.query(Job).filter(
            Job.id == app.job_id
        ).first()

        result.append({

            "application_id": app.id,

            "job_title": job.title,

            "location": job.location,

            "status": app.status,

            "match_score": app.match_score,

            "matched_skills": app.matched_skills,

            "missing_skills": app.missing_skills,

            "interview_date": app.interview_date,

            "interview_time": app.interview_time,

            "meeting_link": app.meeting_link,

            # "recommendation": app.recommendation,
        })
    print(result)

    return result


@router.delete("/delete-job/{job_id}")
def delete_job(

    job_id: int,

    current_user: dict = Depends(
        require_role("recruiter")
    ),

    db: Session = Depends(get_db)
    ):

    job = db.query(Job).filter(

        Job.id == job_id,

        Job.recruiter_id == current_user["user_id"]

    ).first()

    if not job:

        return {
            "message": "Job not found ❌"
        }

    db.delete(job)

    db.commit()

    return {
        "message": "Job deleted ✅"
    }




