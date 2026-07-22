import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), "test.db")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

def add_column_if_not_exists(table, column, col_type="VARCHAR"):
    cursor.execute(f"PRAGMA table_info({table})")
    columns = [col[1] for col in cursor.fetchall()]
    if column not in columns:
        print(f"Adding {column} to {table}...")
        cursor.execute(f"ALTER TABLE {table} ADD COLUMN {column} {col_type}")

# candidate_profiles missing columns based on SQLAlchemy model:
add_column_if_not_exists("candidate_profiles", "user_id", "INTEGER")
add_column_if_not_exists("candidate_profiles", "resume_path", "VARCHAR")
add_column_if_not_exists("candidate_profiles", "resume_file", "VARCHAR")
add_column_if_not_exists("candidate_profiles", "skills", "VARCHAR")
add_column_if_not_exists("candidate_profiles", "test_score", "FLOAT")
add_column_if_not_exists("candidate_profiles", "final_score", "FLOAT")
add_column_if_not_exists("candidate_profiles", "status", "VARCHAR")
add_column_if_not_exists("candidate_profiles", "resume_quality_score", "FLOAT")
add_column_if_not_exists("candidate_profiles", "ai_summary", "VARCHAR")
add_column_if_not_exists("candidate_profiles", "ai_strengths", "JSON")
add_column_if_not_exists("candidate_profiles", "ai_weaknesses", "JSON")
add_column_if_not_exists("candidate_profiles", "focus_areas", "JSON")
add_column_if_not_exists("candidate_profiles", "red_flags", "JSON")
add_column_if_not_exists("candidate_profiles", "ai_missing_sections", "VARCHAR")
add_column_if_not_exists("candidate_profiles", "ai_last_updated", "DATETIME")

# user_id should probably be populated from candidate_id if it's empty
cursor.execute("UPDATE candidate_profiles SET user_id = candidate_id WHERE user_id IS NULL")

conn.commit()
conn.close()

print("Schema sync complete.")
