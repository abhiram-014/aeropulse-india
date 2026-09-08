-- Air Quality Insight Platform Database Schema (PostgreSQL / PostGIS compatible)

CREATE TABLE IF NOT EXISTS locations (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(10) DEFAULT 'IN',
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    elevation DOUBLE PRECISION,
    station_type VARCHAR(50) DEFAULT 'CAAQMS_URBAN',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_locations_city ON locations(city);
CREATE INDEX IF NOT EXISTS idx_locations_coords ON locations(latitude, longitude);

CREATE TABLE IF NOT EXISTS air_quality_observations (
    id BIGSERIAL PRIMARY KEY,
    location_id VARCHAR(64) REFERENCES locations(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL,
    pm25 DOUBLE PRECISION,
    pm10 DOUBLE PRECISION,
    no2 DOUBLE PRECISION,
    so2 DOUBLE PRECISION,
    co DOUBLE PRECISION,
    o3 DOUBLE PRECISION,
    nh3 DOUBLE PRECISION,
    source VARCHAR(50) NOT NULL,
    data_quality_score DOUBLE PRECISION DEFAULT 1.0,
    is_validated BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_location_timestamp UNIQUE (location_id, timestamp)
);

CREATE INDEX IF NOT EXISTS idx_aq_obs_loc_time ON air_quality_observations(location_id, timestamp DESC);

CREATE TABLE IF NOT EXISTS weather_observations (
    id BIGSERIAL PRIMARY KEY,
    location_id VARCHAR(64) REFERENCES locations(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL,
    temperature DOUBLE PRECISION,
    relative_humidity DOUBLE PRECISION,
    surface_pressure DOUBLE PRECISION,
    wind_speed DOUBLE PRECISION,
    wind_direction DOUBLE PRECISION,
    rainfall DOUBLE PRECISION DEFAULT 0.0,
    cloud_cover DOUBLE PRECISION,
    boundary_layer_height DOUBLE PRECISION,
    source VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_weather_loc_time UNIQUE (location_id, timestamp)
);

CREATE INDEX IF NOT EXISTS idx_weather_obs_loc_time ON weather_observations(location_id, timestamp DESC);

CREATE TABLE IF NOT EXISTS satellite_observations (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    product VARCHAR(50) NOT NULL, -- e.g. 'INSAT_3D_L2_AOD'
    variable_name VARCHAR(50) NOT NULL, -- e.g. 'aerosol_optical_depth_550nm'
    value DOUBLE PRECISION NOT NULL,
    quality_flag INTEGER DEFAULT 0,
    source_file VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sat_obs_coords_time ON satellite_observations(latitude, longitude, timestamp DESC);

CREATE TABLE IF NOT EXISTS aqi_records (
    id BIGSERIAL PRIMARY KEY,
    location_id VARCHAR(64) REFERENCES locations(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL,
    aqi INTEGER NOT NULL,
    category VARCHAR(50) NOT NULL,
    dominant_pollutant VARCHAR(20) NOT NULL,
    methodology VARCHAR(50) DEFAULT 'CPCB_INDIA_2014',
    sub_indices JSONB NOT NULL,
    pollutant_count INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_aqi_loc_time UNIQUE (location_id, timestamp)
);

CREATE INDEX IF NOT EXISTS idx_aqi_records_loc_time ON aqi_records(location_id, timestamp DESC);

CREATE TABLE IF NOT EXISTS predictions (
    id BIGSERIAL PRIMARY KEY,
    location_id VARCHAR(64) REFERENCES locations(id) ON DELETE CASCADE,
    generated_at TIMESTAMPTZ NOT NULL,
    target_timestamp TIMESTAMPTZ NOT NULL,
    forecast_step_hours INTEGER NOT NULL,
    predicted_pm25 DOUBLE PRECISION NOT NULL,
    predicted_aqi INTEGER NOT NULL,
    predicted_category VARCHAR(50) NOT NULL,
    lower_bound_pm25 DOUBLE PRECISION,
    upper_bound_pm25 DOUBLE PRECISION,
    model_version VARCHAR(50) NOT NULL,
    model_type VARCHAR(50) DEFAULT 'XGBoost_Reg_v1',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_predictions_loc_target ON predictions(location_id, target_timestamp ASC);
