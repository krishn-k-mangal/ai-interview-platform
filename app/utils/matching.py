def calculate_match(

    candidate_skills,

    required_skills
):

    candidate_set = set(
        [s.strip().lower() for s in candidate_skills]
    )

    required_set = set(
        [s.strip().lower() for s in required_skills]
    )

    # matched
    matched = candidate_set.intersection(required_set)

    # missing
    missing = required_set - candidate_set

    # extra
    extra = candidate_set - required_set

    # required score
    required_score = (

        len(matched)
        /
        len(required_set)

    ) * 80 if required_set else 0

    # bonus score
    bonus_score = min(
        len(extra) * 5,
        20
    )

    final_score = required_score + bonus_score

    return {

        "match_score": round(final_score, 2),

        "matched_skills": list(matched),

        "missing_skills": list(missing),

        "extra_skills": list(extra)
    }