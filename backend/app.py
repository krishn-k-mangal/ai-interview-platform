from flask import Flask, request, jsonify
from flask import render_template, redirect, url_for
from flask import session
from resume_parser import extract_text_from_pdf , extract_skills
import sqlite3 
import pickle
import numpy as np
import os
from flask_cors import CORS



app = Flask(__name__)
app.secret_key = "secret123"

@app.route("/")
def login_page():
    return render_template("login.html")

@app.route("/register_page")
def register_page():
    return render_template("register.html")

@app.route("/register", methods=["POST"])
def register():

    data = request.form

    conn = sqlite3.connect("database.db", timeout=10)
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO users (name, email, password, role)
            VALUES (?, ?, ?, ?)
        """, (data["name"], data["email"], data["password"], data["role"]))

        conn.commit()

    except Exception as e:
        return str(e)

    finally:
        conn.close()

    return redirect("/login_page")
@app.route("/login_page")
def login_page1():
    return render_template("login.html")

@app.route("/login", methods=["POST"])
def login():

    data = request.form

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
    if not email or not password:
        return "All fields required"    
    if user:
        session["user_id"] = user[0]   # ✅ store user
        session["role"] = user[2]

        if user[2] == "recruiter":
            return redirect("/recruiter_dashboard")
        else:
            return redirect("/candidate_dashboard")
    else:
        return "Invalid login"

@app.route("/recruiter_dashboard")
def recruiter_dashboard():

    if "user_id" not in session:
        return redirect("/login_page")

    if session.get("role") != "recruiter":
        return "Access Denied"

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    # 🔥 GET filter from URL
    min_score = request.args.get("min_score")

    # Base query
    query = """
        SELECT users.name,
               candidate_profiles.hiring_score,
               candidate_profiles.test_score,
               candidate_profiles.skill_score,
               candidate_profiles.status,
               candidate_profiles.user_id
        FROM candidate_profiles
        JOIN users ON users.id = candidate_profiles.user_id
    """

    # Apply filter if exists
    if min_score:
        query += " WHERE candidate_profiles.hiring_score >= ?"
        cursor.execute(query, (min_score,))
    else:
        cursor.execute(query)

    # Always sort
    candidates = cursor.fetchall()

    conn.close()

    return render_template("recruiter_dashboard.html", candidates=candidates)
    
@app.route("/candidate_dashboard")
def candidate_dashboard():

    if "user_id" not in session:
        return redirect("/login_page")

    if session.get("role") != "candidate":
        return "Access Denied"

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM candidate_profiles WHERE user_id=?", (session["user_id"],))
    profile = cursor.fetchone()

    conn.close()

    return render_template("candidate_dashboard.html", profile=profile)

@app.route("/upload_resume_page")
def upload_resume_page():

    if "user_id" not in session:
        return redirect("/login_page")

    if session.get("role") != "candidate":
        return "Access Denied"

    return render_template("upload_resume.html")


@app.route("/test_page")
def test_page():

    if "user_id" not in session:
        return redirect("/login_page")

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    # 🔥 Fetch questions
    cursor.execute("""
        SELECT id, question, option1, option2, option3, option4 
        FROM questions
    """)

    questions = cursor.fetchall()   # ✅ NOW it exists

    conn.close()
    
    return render_template("test.html", questions=questions)

    

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

    if "user_id" not in session:
        return redirect("/login_page")

    if "resume" not in request.files:
        return "No resume uploaded"

    file = request.files["resume"]

    if file.filename == "":
        return "No file selected"

    filename = file.filename

    if not filename.lower().endswith(".pdf"):
        return "Only PDF files are allowed"

    base_dir = os.path.dirname(os.path.abspath(__file__))
    upload_folder = os.path.join(base_dir, "uploads")
    os.makedirs(upload_folder, exist_ok=True)

    filepath = os.path.join(upload_folder, filename)

    file.save(filepath)

    # Extract data safely
    try:
        text = extract_text_from_pdf(filepath)
        skills = extract_skills(text)
    except Exception:
        return "Invalid PDF file. Please upload a valid resume."

    skill_score = len(skills) * 10
    experience = 2
    test_score = 0

    weighted_score = (
    skill_score * 0.7 +
    experience * 10 * 0.3
    )

    hiring_score = weighted_score

    user_id = session["user_id"]

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM candidate_profiles WHERE user_id=?", (user_id,))
    existing = cursor.fetchone()

    if existing:
        cursor.execute("""
            UPDATE candidate_profiles
            SET resume_path=?, skill_score=?, experience=?, hiring_score=?
            WHERE user_id=?
        """, (filepath, skill_score, experience, hiring_score, user_id))
    else:
        cursor.execute("""
            INSERT INTO candidate_profiles
            (user_id, resume_path, experience, test_score, skill_score, hiring_score)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (user_id, filepath, experience, test_score, skill_score, hiring_score))

    conn.commit()
    conn.close()

    return render_template(
    "resume_result.html",
    skills=skills,
    skill_score=skill_score
    )

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

@app.route("/update_status/<int:user_id>/<status>")
def update_status(user_id, status):

    if session.get("role") != "recruiter":
        return "Access Denied"

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE candidate_profiles
        SET status=?
        WHERE user_id=?
    """, (status, user_id))

    conn.commit()
    conn.close()

    return redirect("/recruiter_dashboard")

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

    # 🔐 Auth check
    if "user_id" not in session:
        return redirect("/login_page")

    if session.get("role") != "candidate":
        return "Access Denied"

    user_id = session.get("user_id")
    data = request.form

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    # 🧠 Calculate test score
    score = 0
    for q_id, answer in data.items():
        cursor.execute("SELECT correct_answer FROM questions WHERE id=?", (q_id,))
        correct = cursor.fetchone()[0]

        if answer == correct:
            score += 10

    # 📊 Get candidate profile
    cursor.execute("""
        SELECT experience, skill_score
        FROM candidate_profiles
        WHERE user_id=?
    """, (user_id,))
    
    row = cursor.fetchone()

    if row is None:
        return "Please upload resume first"

    experience, skill_score = row

    # ⚙️ Get recruiter weights
    cursor.execute("""
        SELECT skill_weight, test_weight, experience_weight
        FROM recruiter_settings
        LIMIT 1
    """)

    weights = cursor.fetchone()

    if weights is None:
        skill_w, test_w, exp_w = 0.5, 0.3, 0.2
    else:
        skill_w, test_w, exp_w = weights

    # 🧮 Final scoring logic
    hiring_score = (
        skill_score * skill_w +
        score * test_w +
        experience * 10 * exp_w
    )

    # 💾 Update DB
    cursor.execute("""
        UPDATE candidate_profiles
        SET test_score=?, hiring_score=?
        WHERE user_id=?
    """, (score, hiring_score, user_id))

    conn.commit()
    conn.close()

    # 📄 Show result
    return render_template(
        "result.html",
        score=score,
        hiring_score=round(hiring_score, 2)
    )
@app.route("/add_question_page")
def add_question_page():
    if session.get("role") != "recruiter":
        return "Access Denied"
    return render_template("add_question.html")

@app.route("/add_question", methods=["POST"])
def add_question():

    if session.get("role") != "recruiter":
        return "Access Denied"

    data = request.form

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO questions 
        (question, option1, option2, option3, option4, correct_answer)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (data["question"], data["o1"], data["o2"], data["o3"], data["o4"], data["answer"]))

    conn.commit()
    conn.close()

    return redirect("/recruiter_dashboard")

@app.route("/settings_page")
def settings_page():

    if session.get("role") != "recruiter":
        return "Access Denied"

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM recruiter_settings LIMIT 1")
    settings = cursor.fetchone()

    conn.close()

    return render_template("settings.html", settings=settings)

@app.route("/update_settings", methods=["POST"])
def update_settings():

    if session.get("role") != "recruiter":
        return "Access Denied"

    data = request.form

    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE recruiter_settings
        SET skill_weight=?, test_weight=?, experience_weight=?
        WHERE id=1
    """, (data["skill"], data["test"], data["exp"]))

    conn.commit()
    conn.close()

    return redirect("/recruiter_dashboard")

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login_page")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "scoring_model.pkl")

model = pickle.load(open(MODEL_PATH, "rb"))



if __name__ == "__main__":
    app.run(debug=True)
