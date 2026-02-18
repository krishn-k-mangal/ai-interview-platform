from flask import Flask, request, jsonify
import sqlite3 
import pickle
import numpy as np

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
        INSERT INTO candidates (name, email, skills, experience, test_score)
        VALUES (?, ?, ?, ?, ?)
    """, (name, email, skills, experience, test_score))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Candidate added successfully",
        "hiring_score": float(hiring_score)
    })


@app.route("/get_candidates", methods=["GET"])
def get_candidates():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM candidates")
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
            "test_score": row[5]
        })

    return jsonify(candidates)


model = pickle.load(open("model.pkl", "rb"))

if __name__ == "__main__":
    app.run(debug=True)
