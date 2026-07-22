import re

def calculate_resume_quality(text, skills):

    text = text.lower()

    score = 0

    # ------------------
    # Skills (25)
    # ------------------
    score += min(len(skills) * 2.5, 25)

    # ------------------
    # Length (10)
    # ------------------
    word_count = len(text.split())

    if 300 <= word_count <= 1200:
        score += 10
    elif word_count >= 150:
        score += 5

    # ------------------
    # Projects (20)
    # ------------------
    project_keywords = [
        "project",
        "developed",
        "built",
        "created",
        "implemented"
    ]

    project_hits = sum(
        1 for word in project_keywords
        if word in text
    )

    score += min(project_hits * 4, 20)

    # ------------------
    # Experience (15)
    # ------------------
    experience_keywords = [
        "experience",
        "internship",
        "worked",
        "company",
        "software engineer"
    ]

    experience_hits = sum(
        1 for word in experience_keywords
        if word in text
    )

    score += min(experience_hits * 3, 15)

    # ------------------
    # Education (10)
    # ------------------
    education_keywords = [
        "education",
        "b.tech",
        "bachelor",
        "college",
        "university"
    ]

    if any(word in text for word in education_keywords):
        score += 10

    # ------------------
    # Certifications (10)
    # ------------------
    certification_keywords = [
        "certification",
        "certified",
        "aws",
        "oracle",
        "databricks",
        "azure",
        "google cloud"
    ]

    cert_hits = sum(
        1 for word in certification_keywords
        if word in text
    )

    score += min(cert_hits * 2, 10)

    # ------------------
    # Contact Info (10)
    # ------------------
    email_found = bool(
        re.search(
            r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
            text
        )
    )

    phone_found = bool(
        re.search(
            r"\d{10}",
            text
        )
    )

    linkedin_found = "linkedin" in text

    contact_score = 0

    if email_found:
        contact_score += 4

    if phone_found:
        contact_score += 3

    if linkedin_found:
        contact_score += 3

    score += contact_score

    return round(min(score, 100))