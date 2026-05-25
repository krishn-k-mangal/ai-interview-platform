from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.question import Question
from app.utils.deps import require_role
from app.models.candidate_profile import CandidateProfile


router = APIRouter(prefix="/test", tags=["Test"])

@router.get("/questions")
def get_questions(db: Session = Depends(get_db)):

    questions = db.query(Question).all()

    result = []

    for q in questions:
        result.append({
            "id": q.id,
            "question": q.question,
            "options": [q.option1, q.option2, q.option3, q.option4]
        })

    return result


@router.post("/submit-test")
def submit_test(
    answers: dict,
    current_user: dict = Depends(require_role("candidate")),
    
    db: Session = Depends(get_db)
    
):

    score = 0

    for q_id, answer in answers.items():

        question = db.query(Question).filter(Question.id == int(q_id)).first()

        if question and answer == question.correct_answer:
            score += 10

    # get candidate profile
    profile = db.query(CandidateProfile).filter(
        CandidateProfile.user_id == current_user["user_id"]
    ).first()

    if not profile:
        return {"error": "Upload resume first ❌"}

    # simple final score (for now)
    final_score = profile.skill_score * 0.5 + score * 0.5

    # update DB
    profile.test_score = score
    profile.final_score = final_score

    db.commit()
    db.refresh(profile)

    return {
    "message": "Test submitted successfully ✅",
    "resume_score": profile.skill_score,
    "test_score": score,
    "final_score": final_score
    }