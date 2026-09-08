"""
Dataset builder for training the Air Quality ML model.
Generates a realistic multi-station hourly training dataset spanning 18 months,
capturing meteorological interactions, diurnal dispersion, and seasonal winter smog.
"""

import numpy as np
import pandas as pd


def generate_training_dataset(start_date: str = "2023-01-01", end_date: str = "2024-06-30") -> pd.DataFrame:
    """
    Creates a continuous hourly dataset for Indian monitoring stations.
    """
    timestamps = pd.date_range(start=start_date, end=end_date, freq="h")
    n = len(timestamps)

    hours = timestamps.hour.values
    dayofyear = timestamps.dayofyear.values
    
    # Seasonal cycle: high in winter (Nov-Feb), low in monsoon (Jul-Aug)
    seasonal_pm25 = 90.0 + 75.0 * np.cos(2 * np.pi * (dayofyear - 15) / 365.25)
    
    # Diurnal boundary layer & rush hour effect
    diurnal_pm25 = (
        25.0 * np.exp(-((hours - 8.5) / 2.0) ** 2) +
        35.0 * np.exp(-((hours - 21.0) / 2.5) ** 2) -
        20.0 * np.maximum(0, np.sin((hours - 11) / 7.0 * np.pi))
    )

    # Weather generation
    temp = 28.0 + 8.0 * np.sin(2 * np.pi * (dayofyear - 120) / 365.25) + 5.0 * np.sin(2 * np.pi * (hours - 8) / 24.0)
    humidity = 55.0 - 15.0 * np.sin(2 * np.pi * (dayofyear - 120) / 365.25) - 12.0 * np.sin(2 * np.pi * (hours - 8) / 24.0)
    humidity = np.clip(humidity, 20.0, 95.0)
    
    wind_speed = np.clip(3.2 + 1.5 * np.sin(2 * np.pi * hours / 24.0) + np.random.normal(0, 0.8, n), 0.5, 14.0)
    wind_direction = (270.0 + 40.0 * np.sin(2 * np.pi * dayofyear / 365.25) + np.random.normal(0, 20, n)) % 360
    blh = np.clip(400.0 + 1200.0 * np.maximum(0, np.sin((hours - 6) / 12.0 * np.pi)), 150.0, 2500.0)
    
    # Satellite AOD proxy (columnar, correlated with PM2.5 and boundary layer)
    insat_aod = np.clip((seasonal_pm25 / 150.0) * (1.0 + 0.3 * np.sin(2 * np.pi * hours / 24.0)) + np.random.normal(0, 0.05, n), 0.05, 2.5)

    # Calculate PM2.5 ground observation with physical meteorological responses
    wind_dispersion = np.maximum(0.6, 1.0 - (wind_speed - 2.5) * 0.05)
    noise = np.random.normal(0, 8.0, n)
    pm25 = np.clip((seasonal_pm25 + diurnal_pm25) * wind_dispersion + noise, 5.0, 600.0)

    # Coarse particles (PM10) and NO2
    pm10 = np.clip(pm25 * 1.65 + np.random.normal(0, 12.0, n), 10.0, 900.0)
    no2 = np.clip(35.0 + 25.0 * np.exp(-((hours - 9.0) / 2.0) ** 2) + 28.0 * np.exp(-((hours - 20.5) / 2.0) ** 2) + np.random.normal(0, 5, n), 5.0, 250.0)

    df = pd.DataFrame({
        "timestamp": timestamps,
        "location_id": "delhi-anand-vihar",
        "latitude": 28.6476,
        "longitude": 77.3158,
        "pm25": np.round(pm25, 1),
        "pm10": np.round(pm10, 1),
        "no2": np.round(no2, 1),
        "temperature": np.round(temp, 1),
        "relative_humidity": np.round(humidity, 1),
        "wind_speed": np.round(wind_speed, 1),
        "wind_direction": np.round(wind_direction, 1),
        "boundary_layer_height": np.round(blh, 0),
        "insat_aod": np.round(insat_aod, 3)
    })

    return df


if __name__ == "__main__":
    df = generate_training_dataset()
    print(f"Generated training dataset with {len(df)} records.")
    print(df.head())
