"""
Feature Engineering Pipeline for Air Quality & PM2.5 Time-Series Forecasting.
Strictly avoids future data leakage by applying rolling & lag transforms chronologically.
"""

import numpy as np
import pandas as pd


def create_time_features(df: pd.DataFrame, time_col: str = "timestamp") -> pd.DataFrame:
    """Extracts cyclical hour, day-of-week, month, and weekend indicator features."""
    df = df.copy()
    if not np.issubdtype(df[time_col].dtype, np.datetime64):
        df[time_col] = pd.to_datetime(df[time_col])

    hour = df[time_col].dt.hour
    dayofweek = df[time_col].dt.dayofweek
    month = df[time_col].dt.month

    # Cyclical sin/cos encodings
    df["hour_sin"] = np.sin(2 * np.pi * hour / 24.0)
    df["hour_cos"] = np.cos(2 * np.pi * hour / 24.0)
    df["dow_sin"] = np.sin(2 * np.pi * dayofweek / 7.0)
    df["dow_cos"] = np.cos(2 * np.pi * dayofweek / 7.0)
    df["month_sin"] = np.sin(2 * np.pi * month / 12.0)
    df["month_cos"] = np.cos(2 * np.pi * month / 12.0)
    df["is_weekend"] = (dayofweek >= 5).astype(int)

    return df


def create_meteorological_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Transforms meteorological variables into physically relevant dispersion indices:
    - Wind vector decomposition (u: zonal, v: meridional)
    - Ventilation Index proxy = Wind Speed * Boundary Layer Height
    """
    df = df.copy()
    if "wind_speed" in df.columns and "wind_direction" in df.columns:
        rad = np.radians(df["wind_direction"])
        df["wind_u"] = -df["wind_speed"] * np.sin(rad)
        df["wind_v"] = -df["wind_speed"] * np.cos(rad)

    if "wind_speed" in df.columns and "boundary_layer_height" in df.columns:
        df["ventilation_index"] = df["wind_speed"] * df["boundary_layer_height"]

    return df


def create_lag_and_rolling_features(
    df: pd.DataFrame, 
    target_col: str = "pm25", 
    lags: list[int] = [1, 2, 3, 6, 12, 24],
    rolling_windows: list[int] = [3, 6, 12, 24]
) -> pd.DataFrame:
    """
    Constructs autoregressive lag features and rolling window aggregates.
    """
    df = df.copy()
    # Sort chronologically by timestamp
    if "timestamp" in df.columns:
        df = df.sort_values("timestamp").reset_index(drop=True)

    for lag in lags:
        df[f"{target_col}_lag_{lag}h"] = df[target_col].shift(lag)

    for window in rolling_windows:
        # Shift 1 to avoid data leakage (rolling over past observed window only)
        shifted = df[target_col].shift(1)
        df[f"{target_col}_roll_mean_{window}h"] = shifted.rolling(window=window, min_periods=1).mean()
        df[f"{target_col}_roll_std_{window}h"] = shifted.rolling(window=window, min_periods=1).std().fillna(0)
        df[f"{target_col}_roll_min_{window}h"] = shifted.rolling(window=window, min_periods=1).min()
        df[f"{target_col}_roll_max_{window}h"] = shifted.rolling(window=window, min_periods=1).max()

    return df
