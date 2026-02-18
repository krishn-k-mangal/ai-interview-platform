import pandas as pd
from sklearn.linear_model import LinearRegression
import pickle

# sample training data
data = {
    "experience": [1, 2, 3, 4, 5],
    "test_score": [50, 60, 70, 80, 90],
    "skill_score": [40, 50, 60, 70, 80],
    "hiring_score": [55, 65, 75, 85, 95]
}

df = pd.DataFrame(data)

X = df[["experience", "test_score", "skill_score"]]
y = df["hiring_score"]

model = LinearRegression()
model.fit(X, y)

# save model
with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

print("Model trained and saved")
