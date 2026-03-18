import sqlite3

conn = sqlite3.connect("database.db")
cursor = conn.cursor()


# cursor.execute("UPDATE candidate_profiles SET status='rejected' WHERE user_id=2")
# cursor.execute("UPDATE candidate_profiles SET status='shortlisted' WHERE user_id=1")

# conn.commit()
# conn.close()

# print("Status updated")

# import sqlite3




# cursor.execute("DELETE FROM sqlite_sequence WHERE name='users'")
# cursor.execute("DELETE FROM sqlite_sequence WHERE name='candidate_profiles'")


conn.close()