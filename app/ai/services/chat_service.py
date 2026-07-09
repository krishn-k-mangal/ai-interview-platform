from app.ai.builders.prompt_builder import (
    build_candidate_chat_prompt,
    build_recruiter_chat_prompt,
)
from app.services.gemini_service import ask_gemini
from app.ai.prompts.recruiter_dashboard_prompt import (
    RECRUITER_DASHBOARD_PROMPT,
)


def generate_chat_response(role, context, user_message, history=None):
    """
    Generate AI response using previous conversation.
    """

    history_text = ""

    if history:

        history_text = "\n\n".join([f"""
User:
{chat.message}

Assistant:
{chat.response}
""" for chat in history])

    if role == "candidate":

        prompt = build_candidate_chat_prompt(
            context=context,
            user_message=user_message,
        )

    elif role == "recruiter":

        prompt = build_recruiter_chat_prompt(
            context=context,
            user_message=user_message,
        )

    elif role == "recruiter_dashboard":

        prompt = f"""
{RECRUITER_DASHBOARD_PROMPT}

========================
Recruitment Data
========================

{context}

========================
Recruiter Question
========================

{user_message}
"""

    else:

        raise ValueError("Invalid role")

    if history_text:

        prompt += f"""

=========================
Conversation History
=========================

The following conversation happened earlier.

Use it to understand references like:

- this
- that
- second point
- previous answer
- continue

If the current question refers to previous messages,
answer using the conversation history.

{history_text}

=========================
Current User Question
=========================

{user_message}

"""

    response = ask_gemini(prompt)

    return {
        "answer": response,
        "intent": role,
        "confidence": "high",
        "follow_up": [
            "Compare candidates",
            "Explain hiring decisions",
            "Generate interview questions",
            "Summarize recruitment",
        ],
        "next_actions": [
            "Review shortlisted candidates",
            "Schedule interviews",
            "Check missing skills",
        ],
    }
