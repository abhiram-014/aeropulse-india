# System Architecture: AeroPulse Air Quality Insight Platform

## 1. Overview
AeroPulse is an end-to-end environmental intelligence platform designed for the Indian subcontinent. It aggregates ground-truth telemetry from continuous air monitoring stations (CPCB CAAQMS), integrates numerical weather prediction (NWP) parameters (Open-Meteo), processes geostationary satellite remote sensing data (MOSDAC/ISRO INSAT-3DR AOD), and runs machine learning pipelines to forecast 24-hour pollutant concentrations and derived AQI categories.

```
+-------------------------------------------------------------------------------+
|                             DATA SOURCES LAYER                                |
|  - CPCB / State Pollution Boards (Ground Truth Observations)                  |
|  - Open-Meteo High-Resolution NWP (Boundary Layer, Wind, Temp, Humidity)     |
|  - MOSDAC / SAC / ISRO INSAT-3DR L2B (Aerosol Optical Depth - AOD NetCDF-4)  |
|  - OpenAQ Open REST API Bridge                                                |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
|                       INGESTION & ADAPTER LAYER (TypeScript/Python)           |
|  - AirQualityAdapter (CPCB / OpenAQ / Synthetic Fallback)                     |
|  - WeatherAdapter (Open-Meteo Global Surface & Boundary Layer)                |
|  - MOSDAC Satellite Pipeline (`scripts/ingest_mosdac.py` xarray engine)       |
|  - Range Validation, Anomaly Filtering & Data Quality Scoring                 |
+-------------------------------------------------------------------------------+
                                      |
                                      v
+-------------------------------------------------------------------------------+
|                       DATABASE & PERSISTENCE LAYER                            |
|  - PostgreSQL + PostGIS (Optional Docker container) / In-Memory Seed          |
|  - Tables: locations, air_quality_observations, weather_observations,        |
|            satellite_observations, aqi_records, predictions                   |
+-------------------------------------------------------------------------------+
                   |                                           |
                   v                                           v
+------------------------------------+     +------------------------------------+
|        CORE ENGINE (Node/Express)  |     |      ML PIPELINE (Python/FastAPI)  |
|  - CPCB 2014 NAQI Math Engine      |     |  - Chronological Lag Features      |
|  - Multi-Pollutant Sub-Indices     |     |  - Cyclical Temporal Transforms    |
|  - Health Recommendation Engine    |     |  - HistGradientBoosting / XGBoost  |
|  - REST Controllers & API Routes   |     |  - 90% Empirical Residual Bounds   |
+------------------------------------+     +------------------------------------+
                   \                                           /
                    \                                         /
                     v                                       v
+-------------------------------------------------------------------------------+
|                         FRONTEND SPA (React / Vite / TS)                      |
|  - Overview Dashboard (Hero AQI Meter, Pollutant Grid, Weather, Trends)       |
|  - Geospatial India Map (Leaflet Dark Theme, Station Popups, Layer Toggles)   |
|  - 24-Hour ML Multi-Step Forecast (Trajectory & Empirical Uncertainty)       |
|  - ML Model Intelligence & Feature Importance Breakdown                       |
|  - CPCB NAQI What-If Calculator & Breakpoint Guide                            |
|  - Data Provenance & Ingestion Pipeline Audit                                 |
+-------------------------------------------------------------------------------+
```

## 2. Core Modules
- **`backend/src/aqi/`**: Exact implementation of the CPCB 2014 piecewise linear interpolation formulas with edge-case validation and dominant pollutant extraction.
- **`backend/src/health/`**: Granular evidence-based public health guidelines mapped to AQI categories and specific dominant pollutants.
- **`backend/src/providers/`**: Decoupled data adapters for OpenAQ, Open-Meteo, and high-fidelity simulated Indian metropolitan stations.
- **`ml/`**: Machine learning forecasting service with feature extraction, chronological time-series splitting, model training, and FastAPI inference.
- **`scripts/ingest_mosdac.py`**: Standalone satellite ingestion tool parsing NetCDF/HDF files with coordinates extraction and quality masking.
- **`frontend/src/`**: Modern glassmorphic web dashboard built with React 18, Vite, TypeScript, Tailwind CSS, Leaflet, and Recharts.
