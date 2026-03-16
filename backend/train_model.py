import os
import pickle
import pandas as pd
from sklearn.linear_model import LinearRegression

# sample training data
data = {
    "experience": [1, 2, 3, 4, 5],
    "test_score": [50, 60, 70, 80, 90],
    "skill_score": [10, 20, 30, 40, 50],
    "hiring_score": [55, 65, 75, 85, 95]
}

df = pd.DataFrame(data)

X = df[["experience", "test_score", "skill_score"]]
y = df["hiring_score"]

model = LinearRegression()
model.fit(X, y)

# get backend directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# models folder path
models_dir = os.path.join(BASE_DIR, "models")

# create folder if missing
os.makedirs(models_dir, exist_ok=True)

model_path = os.path.join(models_dir, "scoring_model.pkl")

with open(model_path, "wb") as f:
    pickle.dump(model, f)

print("Model saved at:", model_path)
