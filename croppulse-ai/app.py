from pathlib import Path
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np

app = FastAPI(title="CropPulse AI Service")

@app.get("/")
def root():
    return {"status": "CropPulse backend running"}
    
BASE_DIR = Path(__file__).resolve().parent


def load_artifact(name: str):
    """Load a persisted artifact relative to this file; raise a clear error if missing."""
    path = BASE_DIR / name
    if not path.exists():
        raise FileNotFoundError(
            f"Missing artifact '{name}'. Run train_model.py and train_price_model.py in {BASE_DIR} to generate it."
        )
    return joblib.load(path)


model = load_artifact("crop_recommendation_model.pkl")
state_encoder = load_artifact("label_encoder_state.pkl")
soil_encoder = load_artifact("label_encoder_soil.pkl")
crop_encoder = load_artifact("label_encoder_crop.pkl")

price_model = load_artifact("price_model.pkl")
price_state_encoder = load_artifact("price_state_encoder.pkl")
price_crop_encoder = load_artifact("price_crop_encoder.pkl")

try:
    PRICE_DF = pd.read_csv(BASE_DIR / "price_data.csv")
except Exception:
    PRICE_DF = None


class CropRequest(BaseModel):
    state: str
    soilType: str
    landSize: float

class CropResponse(BaseModel):
    recommendedCrop: str
    expectedPrice: float
    riskLevel: str
    confidenceScore: float



@app.post("/recommend-crop", response_model=CropResponse)
def recommend_crop(data: CropRequest):

    state_input = data.state.upper() if len(data.state) <= 2 else data.state.title()
    soil_input = data.soilType.capitalize()  # Black, Red, Alluvial
    
    state_encoded = state_encoder.transform([state_input])[0]
    soil_encoded = soil_encoder.transform([soil_input])[0]

    X_crop = [[state_encoded, soil_encoded, data.landSize]]
    crop_pred = model.predict(X_crop)
    crop = crop_encoder.inverse_transform(crop_pred)[0]

    # --- Price Prediction ---
    state_p = price_state_encoder.transform([state_input])[0]
    month = 8  # assume current season

    
    try:
        crop_p = price_crop_encoder.transform([crop])[0]
        price = price_model.predict([[state_p, crop_p, month]])[0]
        used_fallback = False
    except Exception:
        
        used_fallback = True
        price = _fallback_price_estimate(state=data.state, month=month)

    if price > 5000:
        risk = "Low"
        confidence = 0.85 if not used_fallback else 0.65
    else:
        risk = "Medium"
        confidence = 0.65 if not used_fallback else 0.55

    return CropResponse(
        recommendedCrop=crop,
        expectedPrice=round(price, 2),
        riskLevel=risk,
        confidenceScore=confidence
    )


def _fallback_price_estimate(state: str, month: int) -> float:
    """Estimate price when the crop label is unseen for the price encoder.
    Tries state+month mean, then state mean, then global mean.
    """
    if PRICE_DF is None or PRICE_DF.empty:
        return 4000.0  

    df = PRICE_DF
    # Try state + month
    subset = df[(df["state"] == state) & (df["month"] == month)]
    if not subset.empty:
        return float(subset["price"].mean())

    # Try state only
    subset = df[(df["state"] == state)]
    if not subset.empty:
        return float(subset["price"].mean())

    # Global mean
    return float(df["price"].mean())
