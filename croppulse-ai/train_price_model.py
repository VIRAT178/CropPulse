import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LinearRegression
import joblib

data = pd.read_csv("price_data.csv")

le_state = LabelEncoder()
le_crop = LabelEncoder()

data["state"] = le_state.fit_transform(data["state"])
data["crop"] = le_crop.fit_transform(data["crop"])

X = data[["state", "crop", "month"]]
y = data["price"]

model = LinearRegression()
model.fit(X, y)

joblib.dump(model, "price_model.pkl")
joblib.dump(le_state, "price_state_encoder.pkl")
joblib.dump(le_crop, "price_crop_encoder.pkl")


