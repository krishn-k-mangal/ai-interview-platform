def generate_ai_summary(

    match_score,

    matched_skills,

    missing_skills
):

    summary = ""

    # performance level
    if match_score >= 80:

        summary += (
            "Strong candidate with high job compatibility. "
        )

    elif match_score >= 60:

        summary += (
            "Moderately suitable candidate for this role. "
        )

    else:

        summary += (
            "Candidate currently has limited compatibility with this role. "
        )

    # matched skills
    if matched_skills:

        summary += (
            f"Strong expertise in {matched_skills}. "
        )

    # missing skills
    if missing_skills:

        summary += (
            f"Missing important skills like {missing_skills}. "
        )

    return summary


def generate_resume_summary(skills):

    if not skills:

        return "No skills found."

    return (

        f"This candidate has experience in "
        f"{', '.join(skills[:5])} "
        f"and demonstrates relevant technical knowledge."
    )