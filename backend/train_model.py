import os
import pandas as pd
import joblib
from sklearn.linear_model import LinearRegression

# -------------------------------
# 1. Create training data
# -------------------------------
data = {
    "experience": [1, 2, 3, 4, 5],
    "test_score": [50, 60, 70, 80, 90],
    "skill_score": [10, 20, 30, 40, 50],
    "hiring_score": [55, 65, 75, 85, 95]
}

df = pd.DataFrame(data)

X = df[["experience", "test_score", "skill_score"]]
y = df["hiring_score"]

# -------------------------------
# 2. Train model
# -------------------------------
model = LinearRegression()
model.fit(X, y)

# -------------------------------
# 3. Create models directory
# -------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
models_dir = os.path.join(BASE_DIR, "models")

os.makedirs(models_dir, exist_ok=True)

# -------------------------------
# 4. Save model (IMPORTANT FIX)
# -------------------------------
model_path = os.path.join(models_dir, "scoring_model.pkl")

joblib.dump(model, model_path)

print(f"✅ Model saved successfully at: {model_path}")

# -------------------------------
# 5. Test model (VERY IMPORTANT)
# -------------------------------
loaded_model = joblib.load(model_path)

test_input = [[2, 60, 20]]
prediction = loaded_model.predict(test_input)

print(f"✅ Test prediction: {prediction}")