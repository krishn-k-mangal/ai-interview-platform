from app.ai.services.chat_service import generate_chat_response


def analyze_applicants(context):
    """
    Generate AI analysis for all applicants of a job.
    """

    prompt = """
Analyze all applicants for this job.

Your response must include:

1. Overall hiring summary

2. Top candidate and why

3. Rank all candidates

4. Strengths of the applicant pool

5. Risks or concerns

6. Interview focus areas

7. Hiring recommendation

Return the response in a structured and readable format.
"""

    return generate_chat_response(
        role="recruiter", context=context, user_message=prompt, history=[]
    )
