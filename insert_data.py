import sqlite3

conn = sqlite3.connect("database.db")
cursor = conn.cursor()

# USERS
users_data = [
    ("Rahul", "rahul@gmail.com", "123", "candidate"),
    ("Aman", "aman@gmail.com", "123", "candidate"),
    ("Neha", "neha@gmail.com", "123", "candidate")
]

cursor.executemany("""
INSERT INTO users (name, email, password, role)
VALUES (?, ?, ?, ?)
""", users_data)

# Now IDs will be 1,2,3

# PROFILES (match IDs)
profiles_data = [
    (1, "uploads/resume1.pdf", 2, 85, 30, 88.5, "shortlisted"),
    (2, "uploads/resume2.pdf", 1, 70, 20, 75.2, "pending"),
    (3, "uploads/resume3.pdf", 0, 55, 10, 60.3, "pending")
]

cursor.executemany("""
INSERT INTO candidate_profiles 
(user_id, resume_path, experience, test_score, skill_score, hiring_score, status)
VALUES (?, ?, ?, ?, ?, ?, ?)
""", profiles_data)

cursor.executemany("""
INSERT OR IGNORE INTO users (name, email, password, role)
VALUES (?, ?, ?, ?)
""", users_data)
questions = [
    ("What is Python?", "Language", "Car", "Food", "Game", "Language"),
    ("2 + 2 = ?", "3", "4", "5", "6", "4"),
    ("HTML is used for?", "Backend", "Frontend", "Database", "AI", "Frontend")
]

cursor.executemany("""
INSERT INTO questions (question, option1, option2, option3, option4, correct_answer)
VALUES (?, ?, ?, ?, ?, ?)
""", questions)
conn.commit()
conn.close()

print("Fresh clean data inserted")