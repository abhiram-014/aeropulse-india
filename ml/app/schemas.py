from typing import List, Optional
from pydantic import BaseModel, Field


class WeatherPoint(BaseModel):
    temperature: float
    relativeHumidity: float
    windSpeed: float
    windDirection: float
    surfacePressure: Optional[float] = 1013.0
    boundaryLayerHeight: Optional[float] = 600.0


class PredictRequest(BaseModel):
    location_id: str
    latitude: float
    longitude: float
    current_pm25: float
    history_pm25: List[float] = Field(default_factory=list, description="Past 24 hours of PM2.5 readings")
    weather_forecast: List[WeatherPoint] = Field(default_factory=list, description="Next 24 hours of weather forecast")


class ForecastItem(BaseModel):
    targetTimestamp: str
    hoursAhead: int
    predictedPm25: float
    predictedAqi: int
    predictedCategory: str
    lowerBoundPm25: float
    upperBoundPm25: float
    dominantPollutant: str = "pm25"
    uncertaintyMethod: str


class PredictResponse(BaseModel):
    location_id: str
    generated_at: str
    model_version: str
    forecast: List[ForecastItem]
