from flask import Flask, request, jsonify
from resume_parser import extract_text_from_pdf , extract_skills
import sqlite3 
import pickle
import numpy as np
import os
from flask_cors import CORS



app = Flask(__name__)

CORS(app)
@app.route("/")
def home():
    return "AI Interview Platform Running"

@app.route("/add_candidate", methods=["POST"])
def add_candidate():
    data = request.json

    name = data["name"]
    email = data["email"]
    skills = data["skills"]
    experience = data["experience"]
    test_score = data["test_score"]

    # simple skill score logic
    skill_score = len(skills.split(",")) * 10

    # ML prediction
    input_data = np.array([[experience, test_score, skill_score]])
    hiring_score = model.predict(input_data)[0]

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO candidates (name, email, skills, experience, test_score, hiring_score)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (name, email, skills, experience, test_score, hiring_score))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Candidate added successfully",
        "hiring_score": float(hiring_score)
    })


@app.route("/candidates", methods=["GET"])
def get_candidates():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM candidates ORDER BY hiring_score DESC")

    rows = cursor.fetchall()

    conn.close()

    candidates = []

    for row in rows:
        candidates.append({
            "id": row[0],
            "name": row[1],
            "email": row[2],
            "skills": row[3],
            "experience": row[4],
            "test_score": row[5],
            "hiring_score": row[6]
        })


    return jsonify(candidates)

@app.route("/upload_resume", methods=["POST"])
def upload_resume():

    if "resume" not in request.files:
        return {"error": "No resume file uploaded"}, 400

    file = request.files["resume"]

    base_dir = os.path.dirname(os.path.abspath(__file__))
    upload_folder = os.path.join(base_dir, "uploads")

    # ensure folder exists
    os.makedirs(upload_folder, exist_ok=True)

    # full file path INCLUDING filename
    filepath = os.path.join(upload_folder, file.filename)

    print("Saving file to:", filepath)   # debug line

    file.save(filepath)

    from resume_parser import extract_text_from_pdf, extract_skills

    
    text = extract_text_from_pdf(filepath)

    skills = extract_skills(text)

    skill_score = len(skills) * 10
    experience = 2   # temporary value
    test_score = 75  # temporary value

    features = np.array([[experience, test_score, skill_score]])

    hiring_score = model.predict(features)[0]

    return {
        "message": "Resume uploaded successfully",
        "skills_detected": skills,
        "skill_score": skill_score,
        "hiring_score": float(hiring_score),
        "resume_preview": text[:200]
    }


@app.route("/register", methods=["POST"])
def register():

    data = request.json

    name = data["name"]
    email = data["email"]
    password = data["password"]
    role = data["role"]

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO users (name, email, password, role)
        VALUES (?, ?, ?, ?)
    """, (name, email, password, role))

    conn.commit()
    conn.close()

    return jsonify({"message": "User registered successfully"})


@app.route("/login", methods=["POST"])
def login():

    data = request.json

    email = data["email"]
    password = data["password"]

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id, name, role FROM users WHERE email=? AND password=?",
        (email, password)
    )

    user = cursor.fetchone()

    conn.close()

    if user:
        return jsonify({
            "message": "Login successful",
            "user_id": user[0],
            "name": user[1],
            "role": user[2]
        })

    else:
        return jsonify({"message": "Invalid email or password"}), 401

@app.route("/evaluate_candidate", methods=["POST"])
def evaluate_candidate():

    data = request.form

    user_id = data["user_id"]
    experience = int(data["experience"])
    test_score = int(data["test_score"])

    file = request.files["resume"]

    upload_folder = os.path.join(os.path.dirname(__file__), "uploads")
    os.makedirs(upload_folder, exist_ok=True)

    filepath = os.path.join(upload_folder, file.filename)
    file.save(filepath)

    text = extract_text_from_pdf(filepath)
    skills = extract_skills(text)

    skill_score = len(skills) * 10

    features = np.array([[experience, test_score, skill_score]])
    hiring_score = model.predict(features)[0]

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO candidate_profiles
        (user_id, resume_path, experience, test_score, skill_score, hiring_score)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (user_id, filepath, experience, test_score, skill_score, hiring_score))

    conn.commit()
    conn.close()

    return jsonify({
        "skills_detected": skills,
        "skill_score": skill_score,
        "hiring_score": float(hiring_score)
    })

@app.route("/evaluated_candidates", methods=["GET"])
def get_evaluated_candidates():

    min_score = request.args.get("min_score")
    sort_order = request.args.get("sort", "desc")

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    query = """
        SELECT 
        users.id,
        users.name,
        candidate_profiles.experience,
        candidate_profiles.test_score,
        candidate_profiles.skill_score,
        candidate_profiles.hiring_score,
        candidate_profiles.status
        FROM candidate_profiles
        JOIN users
        ON users.id = candidate_profiles.user_id
    """

    conditions = []
    params = []

    # Filter condition
    if min_score:
        conditions.append("candidate_profiles.hiring_score >= ?")
        params.append(min_score)

    if conditions:
        query += " WHERE " + " AND ".join(conditions)

    # Sorting
    if sort_order == "asc":
        query += " ORDER BY candidate_profiles.hiring_score ASC"
    else:
        query += " ORDER BY candidate_profiles.hiring_score DESC"

    cursor.execute(query, params)

    rows = cursor.fetchall()
    conn.close()

    candidates = []

    for row in rows:
        candidates.append({
            "user_id": row[0],
            "name": row[1],
            "experience": row[2],
            "test_score": row[3],
            "skill_score": row[4],
            "hiring_score": row[5],
            "status": row[6]
        })

    return jsonify(candidates)

@app.route("/candidate/<int:user_id>", methods=["GET"])
def get_candidate_details(user_id):

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT 
            users.name,
            candidate_profiles.resume_path,
            candidate_profiles.experience,
            candidate_profiles.test_score,
            candidate_profiles.skill_score,
            candidate_profiles.hiring_score
        FROM candidate_profiles
        JOIN users
        ON users.id = candidate_profiles.user_id
        WHERE users.id = ?
    """, (user_id,))

    row = cursor.fetchone()
    conn.close()

    if row:
        return jsonify({
            "name": row[0],
            "resume_path": row[1],
            "experience": row[2],
            "test_score": row[3],
            "skill_score": row[4],
            "hiring_score": row[5]
        })
    else:
        return jsonify({"message": "Candidate not found"}), 404


@app.route("/shortlisted_candidates", methods=["GET"])
def get_shortlisted_candidates():

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
        SELECT 
            users.name,
            candidate_profiles.experience,
            candidate_profiles.test_score,
            candidate_profiles.skill_score,
            candidate_profiles.hiring_score,
            candidate_profiles.status
        FROM candidate_profiles
        JOIN users
        ON users.id = candidate_profiles.user_id
        WHERE candidate_profiles.status = 'shortlisted'
    """)

    rows = cursor.fetchall()
    conn.close()

    candidates = []

    for row in rows:
        candidates.append({
            "name": row[0],
            "experience": row[1],
            "test_score": row[2],
            "skill_score": row[3],
            "hiring_score": row[4],
            "status": row[5]
        })
    print(rows)
    return jsonify(candidates)

@app.route("/update_status", methods=["POST"])
def update_status():

    data = request.json

    user_id = data["user_id"]
    status = data["status"]

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE candidate_profiles
        SET status = ?
        WHERE user_id = ?
    """, (status, user_id))

    conn.commit()
    conn.close()

    return jsonify({"message": f"Candidate {status} successfully"})


@app.route("/questions", methods=["GET"])
def get_questions():

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("SELECT id, question, option1, option2, option3, option4 FROM questions")
    rows = cursor.fetchall()

    conn.close()

    questions = []

    for row in rows:
        questions.append({
            "id": row[0],
            "question": row[1],
            "options": [row[2], row[3], row[4], row[5]]
        })

    return jsonify(questions)

@app.route("/submit_test", methods=["POST"])
def submit_test():

    data = request.json
    answers = data["answers"]  # {question_id: selected_option}

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    score = 0

    for q_id, answer in answers.items():
        cursor.execute("SELECT correct_answer FROM questions WHERE id=?", (q_id,))
        correct = cursor.fetchone()[0]

        if answer == correct:
            score += 10

    conn.close()

    return jsonify({"test_score": score})

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "scoring_model.pkl")

model = pickle.load(open(MODEL_PATH, "rb"))



if __name__ == "__main__":
    app.run(debug=True)
