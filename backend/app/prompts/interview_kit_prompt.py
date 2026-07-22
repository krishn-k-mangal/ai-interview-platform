def build_interview_kit_prompt(
    job_title,
    job_description,
    required_skills,
    candidate_skills,
    match_score,
    resume_score,
    test_score,
    ai_summary,
):

    return f"""
You are an experienced Senior Technical Hiring Manager.

Your task is to generate a professional interview kit for the recruiter.

Candidate Information:

Job Title:
{job_title}

Job Description:
{job_description}

Required Skills:
{", ".join(required_skills)}

Candidate Skills:
{", ".join(candidate_skills)}

Resume Score:
{resume_score}

Test Score:
{test_score}

Match Score:
{match_score}

Resume Analysis:
{ai_summary}

--------------------------------------------------

Return ONLY valid JSON.

Do NOT return Markdown.

Do NOT return explanations.

Do NOT return any text outside the JSON.

The JSON MUST follow this structure exactly:

{{
    "candidate_summary": "string",

    "strengths": [
        "string"
    ],

    "weaknesses": [
        "string"
    ],

    "focus_areas": [
        "string"
    ],

    "red_flags": [
        "string"
    ],

    "hiring_recommendation": "Strong Hire",

    "confidence_score": 95,

    "questions": [
        {{
            "skill": "Python",
            "difficulty": "Easy",
            "question": "Explain list and tuple."
        }}
    ]
}}

Generate 10-15 interview questions.

Include Easy, Medium and Hard questions.

Focus on the candidate's missing skills.

The output MUST be valid JSON only.
"""