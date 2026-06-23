from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # <- or use ["*"] to allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
model = joblib.load("pipeline.pkl")

class CropInput(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    

@app.post("/predict")
def predict_crop(data: CropInput):
    features = np.array([[data.N, data.P, data.K, data.temperature,
                          data.humidity, data.ph]])



    probs = model.predict_proba(features)[0]
    classes = model.classes_


    top_indices = np.argsort(probs)[::-1][:3]

 
    predictions = {classes[i]: round(probs[i], 2) for i in top_indices}

    return {"predicted_crops": predictions}
   
@app.get("/")
def root():
    return {"message": "Crop Prediction API is running!"}
