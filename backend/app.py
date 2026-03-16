from flask import Flask, request, jsonify
from resume_parser import extract_text_from_pdf , extract_skills
import sqlite3 
import pickle
import numpy as np
import os



app = Flask(__name__)


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

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "scoring_model.pkl")

model = pickle.load(open(MODEL_PATH, "rb"))



if __name__ == "__main__":
    app.run(debug=True)
