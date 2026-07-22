from app.utils.json_parser import extract_json
from app.prompts.resume_prompt import build_resume_prompt
from app.services.gemini_service import ask_gemini
from app.prompts.interview_prompt import build_interview_prompt


def analyze_resume(
    resume_text: str,
    skills: list,
    resume_quality_score: int,
):

    prompt = build_resume_prompt(
        resume_text=resume_text,
        skills=skills,
        resume_quality_score=resume_quality_score,
    )

    response = ask_gemini(prompt)

    try:

        return extract_json(response)

    except Exception:

        raise Exception(
            "Gemini returned invalid JSON."
        )
        
def generate_interview_questions(
    job_title: str,
    required_skills: list,
    candidate_skills: list,
):

    prompt = build_interview_prompt(
        job_title=job_title,
        required_skills=required_skills,
        candidate_skills=candidate_skills,
    )

    try:
        response = ask_gemini(prompt)
        return extract_json(response)
    except Exception as e:
        print(f"Failed to generate interview questions: {e}")
        return {
            "questions": [],
            "error": "AI generation is temporarily unavailable due to API limits."
        }






        
        
        