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
    test_score INTEGER
)
""")

conn.commit()
conn.close()

print("Database created successfully")
