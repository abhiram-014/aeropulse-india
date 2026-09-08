# REST API Specification: AeroPulse Platform

## Base URL
`http://localhost:5000/api`

---

## Endpoints

### 1. Monitoring Locations
- **`GET /locations`**
- **Response**: Array of Indian CAAQMS station objects with `id`, `name`, `city`, `state`, `latitude`, `longitude`, `elevation`.

### 2. Current Air Quality Observation
- **`GET /air-quality/current?locationId={id}`**
- **Response**: Complete summary object containing:
  - `location`: Station metadata
  - `aqiResult`: CPCB calculated overall AQI, category, dominant pollutant, sub-index details for all 8 pollutants
  - `pollutants`: Raw pollutant values (PM2.5, PM10, NO2, SO2, CO, O3, NH3, Pb)
  - `weather`: Meteorological parameters (temp, humidity, wind vector, pressure, boundary layer height)
  - `satelliteContext`: INSAT-3DR AOD 550nm columnar observation and scientific note
  - `dataSource`: Origin name, timestamp, and demo/live flag

### 3. All Stations Map Feed
- **`GET /map`**
- **Response**: Array of current summaries across all Indian monitoring stations for geospatial rendering.

### 4. 24-Hour Historical Trend
- **`GET /air-quality/history?locationId={id}&hours=24`**
- **Response**: Array of past hourly observations with AQI and individual pollutant concentrations.

### 5. 24-Hour ML Forecast
- **`GET /forecast?locationId={id}`**
- **Response**: 24-hour forward projection object with:
  - `trend`: `Improving` | `Stable` | `Deteriorating`
  - `trendDescription`: Meteorological narrative
  - `forecast`: Array of 24 hourly steps with `predictedPm25`, `predictedAqi`, `predictedCategory`, and empirical 90% quantile prediction intervals (`lowerBoundPm25`, `upperBoundPm25`).

### 6. Interactive AQI Calculation
- **`POST /aqi/calculate`**
- **Body**: `{ pm25: number, pm10: number, no2: number, so2: number, co: number, o3: number, nh3: number, pb: number }`
- **Response**: Exact CPCB sub-index breakdown, validity flag, dominant driver, and contextual health recommendations.

### 7. ML Model Performance Metadata
- **`GET /model/info`**
- **Response**: Specifications of the trained model, MAE/RMSE/R2 on held-out test data, and feature importance rankings.

### 8. Data Sources & Methodology
- **`GET /data-sources`**
- **`GET /aqi/methodology`**
- **Response**: Provenance documentation, CPCB breakpoints, and validity rules.
