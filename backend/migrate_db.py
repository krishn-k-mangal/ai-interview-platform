import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), "test.db")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

def column_exists(table, column):
    cursor.execute(f"PRAGMA table_info({table})")
    columns = [col[1] for col in cursor.fetchall()]
    return column in columns

print("Migrating test.db...")

# users table
if not column_exists("users", "phone"):
    print("Adding phone to users...")
    cursor.execute("ALTER TABLE users ADD COLUMN phone VARCHAR")
if not column_exists("users", "location"):
    print("Adding location to users...")
    cursor.execute("ALTER TABLE users ADD COLUMN location VARCHAR")

# candidate_profiles table
if column_exists("candidate_profiles", "id"):  # Table exists
    if not column_exists("candidate_profiles", "education"):
        print("Adding education to candidate_profiles...")
        cursor.execute("ALTER TABLE candidate_profiles ADD COLUMN education VARCHAR")
    if not column_exists("candidate_profiles", "experience"):
        print("Adding experience to candidate_profiles...")
        cursor.execute("ALTER TABLE candidate_profiles ADD COLUMN experience VARCHAR")

conn.commit()
conn.close()

print("Migration complete.")
