# AeroPulse India — Air Quality Insight & ML Forecasting Platform

A production-grade environmental intelligence platform for the Indian subcontinent combining **CPCB National Air Quality Index (NAQI 2014)** ground truth telemetry, **Open-Meteo** numerical boundary layer meteorology, **MOSDAC / ISRO INSAT-3DR** satellite remote sensing, and **Gradient Boosted Decision Tree (XGBoost)** 24-hour forecasting with empirical quantile uncertainty bands.

---

## 🌟 Key Highlights

1. **Official CPCB 2014 AQI Engine**:
   - Linear interpolation sub-index calculation for all 8 criteria pollutants ($\text{PM}_{2.5}$, $\text{PM}_{10}$, $\text{NO}_2$, $\text{SO}_2$, $\text{CO}$, $\text{O}_3$, $\text{NH}_3$, $\text{Pb}$).
   - Multi-pollutant maximum aggregation rule ($AQI = \max(I_p)$).
   - Strict adherence to CPCB validity rules (minimum 3 pollutants monitored, with mandatory $\text{PM}_{2.5}$ or $\text{PM}_{10}$).
2. **Scientific Satellite Remote Sensing Integrity**:
   - Ingests **MOSDAC / ISRO INSAT-3DR L2B** Aerosol Optical Depth (AOD at 550nm) via an `xarray` / NetCDF-4 pipeline.
   - **Zero Fabrications**: Satellite AOD represents columnar optical thickness and is explicitly treated as an environmental/meteorological covariate—**never** claimed to be direct surface AQI.
3. **24-Hour Machine Learning Multi-Step Forecasting**:
   - Gradient boosted autoregressive regression using lag features ($t-1, t-2, t-3, t-6, t-12, t-24$), rolling statistics, wind vector decomposition ($u, v$), and boundary layer height.
   - **Zero Future Data Leakage**: Evaluated on strict chronological out-of-time test partitions (never randomly shuffled).
   - **Empirical 90% Quantile Uncertainty**: Scientific prediction intervals derived from out-of-time test residual distributions ($q_{10}$ to $q_{90}$) instead of fabricated percentage confidence numbers.
4. **Geospatial India Map**:
   - Interactive Leaflet dark-mode map across major Indian urban monitoring stations (Delhi, Mumbai, Bengaluru, Kolkata, Chennai, Hyderabad, Ahmedabad, Pune, Lucknow, Patna, Jaipur, Chandigarh, etc.).
   - Switchable layers: AQI, $\text{PM}_{2.5}$, $\text{PM}_{10}$, $\text{NO}_2$, $\text{SO}_2$, $\text{O}_3$, and INSAT Satellite AOD.
5. **Contextual Health Guidance**:
   - Evidence-based, non-alarmist public health advisories tailored to AQI categories and specific dominant pollutants.
6. **Data Transparency & Provenance**:
   - Real-time/Demo indicator, sensor health score, and data source provenance on every card.

---

## 🛠️ Architecture & Tech Stack

```
Frontend (React 18 + Vite + TypeScript + Tailwind CSS + Leaflet + Recharts)
   │
   ▼
Backend REST API (Node.js + Express + TypeScript + Zod Validation)
   │
   ├── Data Ingestion Layer (OpenAQ v2/v3, Open-Meteo NWP, CPCB, Demo Provider)
   ├── CPCB AQI Engine (Sub-indices & Dominant Pollutant Aggregation)
   ├── MOSDAC Ingestion Pipeline (`scripts/ingest_mosdac.py` xarray engine)
   └── ML Inference Service (FastAPI / Embedded Gradient Boosted Trees)
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ & npm
- Python 3.10+ (for optional Python ML server and NetCDF ingestion)

### 1. Installation

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Running Locally

You can run the backend and frontend simultaneously:

```bash
# Terminal 1: Start Backend API (Port 5000)
cd backend
npm run dev

# Terminal 2: Start Frontend Dev Server (Port 5173)
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔬 Running the Machine Learning Pipeline

To retrain the ML forecasting model chronologically:

```bash
# Install ML dependencies
pip install -r ml/requirements.txt

# Run chronological training & evaluation
python ml/training/train.py

# (Optional) Start FastAPI ML Inference Server (Port 8000)
uvicorn ml.app.main:app --port 8000 --reload
```

---

## 🛰️ MOSDAC / ISRO Satellite Ingestion

To parse and normalize MOSDAC/ISRO NetCDF-4 / HDF satellite files:

```bash
# 1. Generate sample INSAT-3DR metadata file
python scripts/generate_sample_satellite_nc.py

# 2. Ingest and extract regional AOD covariates
python scripts/ingest_mosdac.py --file data/raw/insat3dr_sample_aod.json --output data/processed/mosdac_aod_latest.json
```

---

## 🐳 Docker Deployment

To launch the entire stack (PostgreSQL, ML service, Express backend, and React frontend) with a single command:

```bash
docker-compose up --build
```

---

## 🧪 Testing

Run backend unit tests verifying CPCB sub-index math and breakpoint boundaries:

```bash
cd backend
npm run test
```

---

## 📚 Detailed Documentation

- [System Architecture](docs/architecture.md)
- [CPCB AQI 2014 Mathematical Methodology](docs/cpcb_aqi_methodology.md)
- [ML Forecasting Pipeline & Validation](docs/ml_pipeline.md)
- [MOSDAC / ISRO Satellite Ingestion](docs/mosdac_ingestion.md)
- [REST API Specification](docs/api_specification.md)
