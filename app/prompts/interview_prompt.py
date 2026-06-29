def build_interview_prompt(
    job_title: str,
    required_skills: list,
    candidate_skills: list,
):
    return f"""
You are a Senior Technical Interviewer.

Job Title:
{job_title}

Required Skills:
{", ".join(required_skills)}

Candidate Skills:
{", ".join(candidate_skills)}

Generate 10 interview questions.

Return ONLY valid JSON.

{{
    "questions":[
        {{
            "skill":"Python",
            "difficulty":"Easy",
            "question":"Explain list comprehension."
        }}
    ]
}}
"""
