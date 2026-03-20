import sqlite3

conn = sqlite3.connect("database.db")
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    skills TEXT,
    experience INTEGER,
    test_score INTEGER,
    hiring_score REAL
)
""")



cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS candidate_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    resume_path TEXT,
    experience INTEGER,
    test_score INTEGER,
    skill_score INTEGER,
    hiring_score REAL
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT,
    option1 TEXT,
    option2 TEXT,
    option3 TEXT,
    option4 TEXT,
    correct_answer TEXT
)
""")
cursor.execute("""
CREATE TABLE IF NOT EXISTS recruiter_settings (
    id INTEGER PRIMARY KEY,
    skill_weight REAL,
    test_weight REAL,
    experience_weight REAL
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    skills TEXT
)
""")


conn.commit()
conn.close()

print("Users table created successfully")