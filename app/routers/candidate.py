from fastapi import UploadFile, File, APIRouter ,  Depends
import os

from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.user import User
from app.utils.deps import require_role
from app.models.candidate_profile import CandidateProfile
from resume_parser import extract_text_from_pdf, extract_skills
from app.utils.recommendation import get_recommendation_label


router = APIRouter(
    prefix="/candidate",
    tags=["Candidate"]
)

@router.get("/test")
def test_candidate():
    return {"message": "Candidate router working ✅"}

@router.get("/dashboard")
def candidate_dashboard(
    current_user: dict = Depends(require_role("candidate"))
    ):
    return {
        "message": "Candidate Dashboard ✅",
        "user": current_user
    }

@router.post("/upload-resume")
def upload_resume(
    file: UploadFile = File(...),
    current_user: dict = Depends(require_role("candidate")),
    db: Session = Depends(get_db)
    ):

    import os

    # save file
    upload_folder = "uploads"
    os.makedirs(upload_folder, exist_ok=True)

    file_path = os.path.join(
        upload_folder,
        f"{current_user['user_id']}_{file.filename}"
    )

    with open(file_path, "wb") as f:
        f.write(file.file.read())

    # 🔥 parse resume
    text = extract_text_from_pdf(file_path)
    skills = extract_skills(text)

    skill_score = len(skills) * 10

    # 🔥 SAVE TO DB (THIS IS YOUR ANSWER)
    # 🔥 SAVE TO DB (THIS IS YOUR ANSWER)
    # check existing profile
    profile = db.query(CandidateProfile).filter(
        CandidateProfile.user_id == current_user["user_id"]
    ).first()

    # update existing profile
    if profile:

        profile.resume_path = file_path

        profile.resume_file = f"{current_user['user_id']}_{file.filename}"

        profile.skill_score = skill_score

        profile.skills = ", ".join(skills)

    # create new profile
    else:

        profile = CandidateProfile(

            user_id=current_user["user_id"],

            resume_path=file_path,

            resume_file=f"{current_user['user_id']}_{file.filename}",

            skill_score=skill_score,

            status="pending"
        )

        db.add(profile)

    db.commit()
   

    return {
        "message": "Resume processed & saved ✅",
        "skills": skills,
        "skill_score": skill_score
        }

@router.get("/my-profile")
def get_my_profile(
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db)
    ):

    profile = db.query(CandidateProfile).filter(
        CandidateProfile.user_id == current_user["user_id"]
    ).first()

    if not profile:
        return {
            "message": "No profile found"
        }

    final_score = (
        profile.skill_score +
        profile.test_score
    ) / 2

    return {
        "resume_score": profile.skill_score,
        "test_score": profile.test_score,
        "final_score": final_score,
        "status": profile.status
}
    