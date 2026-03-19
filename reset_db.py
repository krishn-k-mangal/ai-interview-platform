import sqlite3

conn = sqlite3.connect("database.db")
cursor = conn.cursor()

# # Delete all data
# cursor.execute("DELETE FROM users")
# cursor.execute("DELETE FROM candidate_profiles")

# # Reset ID counters
# cursor.execute("DELETE FROM sqlite_sequence WHERE name='users'")
# cursor.execute("DELETE FROM sqlite_sequence WHERE name='candidate_profiles'")
cursor.execute("""
INSERT INTO recruiter_settings (skill_weight, test_weight, experience_weight)
VALUES (0.5, 0.3, 0.2)
""")
conn.commit()
conn.close()

print("Database reset successfully")