from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse
from pydantic import BaseModel

from app.database.db import get_db
from app.models.user import User
from app.models.candidate_profile import CandidateProfile
from app.models.question import Question
from app.utils.deps import require_role



class QuestionCreate(BaseModel):

    question: str

    option1: str
    option2: str
    option3: str
    option4: str

    correct_answer: str

router = APIRouter(
    prefix="/recruiter",
    tags=["Recruiter"]
)

# 🔥 Get all candidates
@router.get("/candidates")
def get_candidates(

    current_user: dict = Depends(require_role("recruiter")),
    db: Session = Depends(get_db)
    ):

    candidates = db.query(
        User,
        CandidateProfile
    ).join(
        CandidateProfile,
        User.id == CandidateProfile.user_id
    ).filter(
        User.role == "candidate"
    ).all()

    result = []

    for user, profile in candidates:

        result.append({
            "user_id": user.id,

            "name": user.name,
            "email": user.email,

            "resume_score": profile.skill_score,
            "test_score": profile.test_score,
            "final_score": getattr(profile, "final_score", 0),
            "status": getattr(profile, "status", "pending")
        })

    # 🔥 sort by final score
    result.sort(
        key=lambda x: x["final_score"],
        reverse=True
    )

    return result



@router.post("/add-question")
def add_question(
    data: QuestionCreate,

    current_user: dict = Depends(require_role("recruiter")),

    db: Session = Depends(get_db)
    ):

    new_question = Question(

        question=data.question,

        option1=data.option1,
        option2=data.option2,
        option3=data.option3,
        option4=data.option4,

        correct_answer=data.correct_answer
    )

    db.add(new_question)

    db.commit()

    db.refresh(new_question)

    return {
        "message": "Question added successfully ✅"
}

@router.delete("/delete-question/{question_id}")
def delete_question(

    question_id: int,

    current_user: dict = Depends(require_role("recruiter")),

    db: Session = Depends(get_db)
    ):

    question = db.query(Question).filter(
        Question.id == question_id
    ).first()

    if not question:

        return {
            "error": "Question not found ❌"
        }

    db.delete(question)

    db.commit()

    return {
        "message": "Question deleted successfully ✅"
}

@router.get("/all-questions")
def get_all_questions(

    current_user: dict = Depends(require_role("recruiter")),

    db: Session = Depends(get_db)
    ):

    questions = db.query(Question).all()

    return questions

@router.put("/edit-question/{question_id}")
def edit_question(

    question_id: int,

    data: QuestionCreate,

    current_user: dict = Depends(require_role("recruiter")),

    db: Session = Depends(get_db)
    ):

    question = db.query(Question).filter(
        Question.id == question_id
    ).first()

    if not question:

        return {
            "error": "Question not found ❌"
        }

    question.question = data.question

    question.option1 = data.option1
    question.option2 = data.option2
    question.option3 = data.option3
    question.option4 = data.option4

    question.correct_answer = data.correct_answer

    db.commit()

    return {
        "message": "Question updated successfully ✅"
}

@router.put("/update-status/{candidate_id}")
def update_status(

    candidate_id: int,

    status: str,

    current_user: dict = Depends(require_role("recruiter")),

    db: Session = Depends(get_db)
    ):

    profile = db.query(CandidateProfile).filter(
        CandidateProfile.user_id == candidate_id
    ).first()

    if not profile:

        return {
            "error": "Candidate not found ❌"
        }

    profile.status = status

    db.commit()

    return {
        "message": "Status updated successfully ✅"
}

@router.get("/candidate/{candidate_id}")
def get_candidate_details(

    candidate_id: int,

    current_user: dict = Depends(require_role("recruiter")),

    db: Session = Depends(get_db)
    ):

    # get user
    user = db.query(User).filter(
        User.id == candidate_id
    ).first()

    if not user:

        return {
            "error": "User not found ❌"
        }

    # get profile
    profile = db.query(CandidateProfile).filter(
        CandidateProfile.user_id == candidate_id
    ).first()

    if not profile:

        return {
            "error": "Candidate profile not found ❌"
        }

    return {

        "id": user.id,

        "name": user.name,

        "email": user.email,

        "resume_score": getattr(profile, "skill_score", 0),

        "test_score": getattr(profile, "test_score", 0),

        "final_score": getattr(profile, "final_score", 0),

        "status": getattr(profile, "status", "pending")
}


@router.get("/resume/{candidate_id}")
def view_resume(

    candidate_id: int,

    db: Session = Depends(get_db)
    ):

    profile = db.query(CandidateProfile).filter(
        CandidateProfile.user_id == candidate_id
    ).first()

    if not profile:

        return {
            "error": "Profile not found ❌"
        }

    if not profile.resume_path:

        return {
            "error": "Resume not uploaded ❌"
        }

    return FileResponse(

        path=profile.resume_path,

        media_type="application/pdf",

        filename=profile.resume_file
    )