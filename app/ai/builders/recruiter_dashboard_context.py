def build_recruiter_dashboard_context(
    jobs,
    applications,
    candidate_profiles,
    interview_kits,
    users,
):
    user_map = {user.id: user for user in users}

    profile_map = {
        profile.user_id: profile
        for profile in candidate_profiles
    }

    candidates = []

    for application in applications:

        user = user_map.get(application.candidate_id)
        profile = profile_map.get(application.candidate_id)

        candidates.append(
            {
                "candidate_name": user.name if user else "Unknown",
                "email": user.email if user else "",

                "job_id": application.job_id,

                "status": application.status,

                "match_score": application.match_score,

                "recommendation": application.recommendation,

                "matched_skills": application.matched_skills,

                "missing_skills": application.missing_skills,

                "extra_skills": application.extra_skills,

                "resume_quality_score": (
                    profile.resume_quality_score
                    if profile
                    else 0
                ),

                "skill_score": (
                    profile.skill_score
                    if profile
                    else 0
                ),

                "test_score": (
                    profile.test_score
                    if profile
                    else 0
                ),

                "final_score": (
                    profile.final_score
                    if profile
                    else 0
                ),

                "ai_summary": (
                    profile.ai_summary
                    if profile
                    else ""
                ),
            }
        )

    return {

        "total_jobs": len(jobs),

        "total_candidates": len(candidates),

        "jobs": [
            {
                "id": job.id,
                "title": job.title,
                "required_skills": job.required_skills,
                "location": job.location,
                "experience": job.experience,
            }
            for job in jobs
        ],

        "candidates": candidates,
    }