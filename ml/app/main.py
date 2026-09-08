from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .prediction import Predictor
from .schemas import PredictRequest, PredictResponse

app = FastAPI(
    title="Air Quality ML Prediction API",
    description="FastAPI service for 24-hour PM2.5 forecasting and derived AQI projection",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

predictor = Predictor()


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "air-quality-ml-service",
        "model_loaded": predictor.model is not None,
        "metadata": predictor.metadata
    }


@app.post("/predict", response_model=PredictResponse)
def predict_forecast(req: PredictRequest):
    try:
        forecast_items = predictor.forecast_24h(req)
        return PredictResponse(
            location_id=req.location_id,
            generated_at=datetime.now(timezone.utc).isoformat(),
            model_version=predictor.metadata.get("model_version", "XGBoost-PM25-Reg-v1.4"),
            forecast=forecast_items
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
