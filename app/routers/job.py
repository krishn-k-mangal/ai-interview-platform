from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.job import Job
from app.utils.deps import require_role
from app.models.application import Application

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)

@router.post("/create-job")
def create_job(

    data: dict,

    current_user: dict = Depends(require_role("recruiter")),

    db: Session = Depends(get_db)
    ):

    job = Job(

        title=data["title"],

        description=data["description"],

        required_skills=data["required_skills"],

        experience=data["experience"],

        salary=data["salary"],

        location=data["location"],

        recruiter_id=current_user["user_id"]
    )

    db.add(job)

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

    current_user: dict = Depends(require_role("candidate")),

    db: Session = Depends(get_db)
    ):

    # already applied check
    existing = db.query(Application).filter(

        Application.job_id == job_id,

        Application.candidate_id == current_user["user_id"]

    ).first()

    if existing:

        return {
            "message": "Already applied ❌"
        }

    application = Application(

        candidate_id=current_user["user_id"],

        job_id=job_id
    )

    db.add(application)

    db.commit()

    return {
        "message": "Applied successfully ✅"
}


@router.get("/all-jobs")
def get_all_jobs(

    db: Session = Depends(get_db)
    ):

    jobs = db.query(Job).all()

    return jobs