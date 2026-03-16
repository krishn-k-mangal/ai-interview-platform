import pdfplumber

def extract_text_from_pdf(file_path):
    text = ""

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text()

    return text

def extract_skills(text):

    skills_db = [
        "python",
        "java",
        "sql",
        "machine learning",
        "deep learning",
        "react",
        "node",
        "django",
        "flask",
        "tensorflow",
        "pandas",
        "numpy"
    ]

    text = text.lower()

    found_skills = []

    for skill in skills_db:
        if skill in text:
            found_skills.append(skill)

    return found_skills
