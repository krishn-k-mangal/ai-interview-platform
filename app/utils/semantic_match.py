from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

def calculate_semantic_match(
    candidate_skills,
    required_skills
):

    matched = []
    missing = []

    total_similarity = 0

    candidate_embeddings = model.encode(
        candidate_skills
    )

    required_embeddings = model.encode(
        required_skills
    )

    for i, req in enumerate(required_skills):

        similarities = cosine_similarity(
            [required_embeddings[i]],
            candidate_embeddings
        )[0]

        best_score = np.max(similarities)

        total_similarity += best_score

        if best_score > 0.60:
            matched.append(req)
        else:
            missing.append(req)

    avg_similarity = (
        total_similarity /
        len(required_skills)
    )

    match_score = round(
        avg_similarity * 100,
        2
    )

    return {

        "match_score": match_score,

        "matched_skills": matched,

        "missing_skills": missing,

        "extra_skills": []
    }