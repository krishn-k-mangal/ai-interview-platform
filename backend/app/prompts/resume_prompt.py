def build_resume_prompt(
    resume_text: str,
    skills: list,
    resume_quality_score: int,
):
    return f"""
You are an experienced Senior Technical Recruiter.

Analyze the following resume.

Resume:

{resume_text}

Detected Skills:

{", ".join(skills)}

Resume Quality Score:

{resume_quality_score}/100


Return ONLY valid JSON.

The JSON format MUST be:

{{
    "summary": "...",

    "strengths": [
        "...",
        "..."
    ],

    "weaknesses": [
        "...",
        "..."
    ],

    "missing_sections": [
        "...",
        "..."
    ],

    "suggestions": [
        "...",
        "..."
    ]
}}

Do NOT write markdown.

Do NOT explain anything.

Return ONLY JSON.
"""