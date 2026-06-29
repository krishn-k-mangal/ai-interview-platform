from app.prompts.interview_kit_prompt import build_interview_kit_prompt
from app.services.gemini_service import ask_gemini
from app.utils.json_parser import extract_json
from app.utils.ai_validator import validate_interview_result


def generate_interview_kit(
    job_title,
    job_description,
    required_skills,
    candidate_skills,
    match_score,
    resume_score,
    test_score,
    ai_summary,
):
    prompt = build_interview_kit_prompt(
        job_title=job_title,
        job_description=job_description,
        required_skills=required_skills,
        candidate_skills=candidate_skills,
        match_score=match_score,
        resume_score=resume_score,
        test_score=test_score,
        ai_summary=ai_summary,
    )

    try:

        response = ask_gemini(prompt)

        result = extract_json(response)

        validate_interview_result(result)

        return result

    except Exception as e:

        raise Exception(f"Interview Kit Generation Failed: {str(e)}")
    result = extract_json(response)

    validate_interview_result(result)

    return result
