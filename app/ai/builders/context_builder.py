from app.models.interview_kit import InterviewKit
from app.models.user import User


def build_recruiter_context(
    job,
    applications,
    candidate_profiles,
    interview_kits,
    users,
):
    """
    Build recruiter context for AI chat.
    """

    applicants = []

    profile_map = {profile.user_id: profile for profile in candidate_profiles}

    interview_map = {kit.application_id: kit for kit in interview_kits}

    user_map = {user.id: user for user in users}

    for application in applications:

        profile = profile_map.get(application.candidate_id)

        interview = interview_map.get(application.id)

        user = user_map.get(application.candidate_id)

        applicants.append(
            {
                "candidate_id": application.candidate_id,
                "candidate_name": user.name if user else "Unknown",
                "match_score": application.match_score,
                "matched_skills": application.matched_skills,
                "missing_skills": application.missing_skills,
                "extra_skills": application.extra_skills,
                "recommendation": application.recommendation,
                "skills": profile.skills if profile else None,
                "skill_score": profile.skill_score if profile else None,
                "test_score": profile.test_score if profile else None,
                "final_score": profile.final_score if profile else None,
                "summary": interview.candidate_summary if interview else None,
                "strengths": interview.strengths if interview else None,
                "weaknesses": interview.weaknesses if interview else None,
                "focus_areas": interview.focus_areas if interview else None,
                "red_flags": interview.red_flags if interview else None,
                "confidence": interview.confidence_score if interview else None,
            }
        )

    return {
        "job": {
            "title": job.title,
            "description": job.description,
            "required_skills": job.required_skills,
            "experience": job.experience,
            "location": job.location,
            "salary": job.salary,
        },
        "applicants": applicants,
    }


def build_candidate_context(profile, application, job, interview_kit=None):

    context = {
        "candidate": {
            "skills": profile.skills,
            "skill_score": profile.skill_score,
            "test_score": profile.test_score,
            "final_score": profile.final_score,
            "summary": profile.ai_summary,
            "strengths": profile.ai_strengths,
            "weaknesses": profile.ai_weaknesses,
            "focus_areas": profile.focus_areas,
            "red_flags": profile.red_flags,
            "suggestions": profile.ai_suggestions,
        },
        "application": {
            "match_score": application.match_score,
            "matched_skills": application.matched_skills,
            "missing_skills": application.missing_skills,
            "extra_skills": application.extra_skills,
            "recommendation": application.recommendation,
        },
        "job": {
            "title": job.title,
            "description": job.description,
            "required_skills": job.required_skills,
        },
    }

    if interview_kit:

        context["interview_kit"] = {
            "summary": interview_kit.candidate_summary,
            "strengths": interview_kit.strengths,
            "weaknesses": interview_kit.weaknesses,
            "focus_areas": interview_kit.focus_areas,
            "red_flags": interview_kit.red_flags,
            "recommendation": interview_kit.hiring_recommendation,
            "confidence": interview_kit.confidence_score,
        }

    return context

