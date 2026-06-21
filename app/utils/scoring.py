def calculate_final_score(
    resume_score,
    test_score,
    resume_quality_score
):

    final_score = (
        resume_score * 0.4 +
        test_score * 0.3 +
        resume_quality_score * 0.3
    )

    return round(final_score)