import re

def calculate_resume_quality(text):

    score = 0

    checks = []

    text_lower = text.lower()

    if "education" in text_lower:
        score += 15
        checks.append("Education")

    if "project" in text_lower:
        score += 20
        checks.append("Projects")

    if "skill" in text_lower:
        score += 15
        checks.append("Skills")

    if "experience" in text_lower:
        score += 20
        checks.append("Experience")

    if "github.com" in text_lower:
        score += 15
        checks.append("Github")

    if "linkedin.com" in text_lower:
        score += 15
        checks.append("LinkedIn")

    return {
        "resume_quality_score": score,
        "sections_found": checks
    }