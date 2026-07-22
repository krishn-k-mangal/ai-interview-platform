def calculate_ranking_score(
    candidate_score,
    match_score
):

    return round(
        candidate_score * 0.4
        +
        match_score * 0.6,
        2
    )