def get_recommendation_label(

    match_score
):

    if match_score >= 85:

        return "Highly Recommended"

    elif match_score >= 70:

        return "Recommended"

    elif match_score >= 50:

        return "Average Fit"

    else:

        return "Low Fit"