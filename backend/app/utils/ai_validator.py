REQUIRED_FIELDS = [
    "candidate_summary",
    "strengths",
    "weaknesses",
    "focus_areas",
    "red_flags",
    "hiring_recommendation",
    "confidence_score",
    "questions",
]


def validate_interview_result(result):

    missing = []

    for field in REQUIRED_FIELDS:
        if field not in result:
            missing.append(field)

    if missing:
        raise Exception(
            f"Gemini missing fields: {', '.join(missing)}"
        )

    return True