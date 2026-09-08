"""
ML Model Training Script for 24-Hour PM2.5 Forecast.
Uses strict chronological time-series splitting to avoid future data leakage.
"""

import json
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from dataset_builder import generate_training_dataset
from features import (
    create_lag_and_rolling_features,
    create_meteorological_features,
    create_time_features,
)


def train_model():
    print("Step 1: Generating atmospheric time-series dataset...")
    raw_df = generate_training_dataset()

    print("Step 2: Engineering temporal, meteorological, and lag features...")
    df = create_time_features(raw_df)
    df = create_meteorological_features(df)
    df = create_lag_and_rolling_features(df, target_col="pm25")

    # Drop rows with NaN due to initial lags
    df = df.dropna().reset_index(drop=True)

    feature_cols = [
        "hour_sin", "hour_cos", "dow_sin", "dow_cos", "month_sin", "month_cos", "is_weekend",
        "temperature", "relative_humidity", "wind_speed", "wind_u", "wind_v", "ventilation_index", "insat_aod",
        "pm25_lag_1h", "pm25_lag_2h", "pm25_lag_3h", "pm25_lag_6h", "pm25_lag_12h", "pm25_lag_24h",
        "pm25_roll_mean_3h", "pm25_roll_std_3h", "pm25_roll_mean_6h", "pm25_roll_mean_24h"
    ]
    target_col = "pm25"

    X = df[feature_cols]
    y = df[target_col]

    # Chronological Split (70% train, 15% val, 15% test) - NO RANDOM SHUFFLING
    n = len(df)
    train_idx = int(n * 0.70)
    val_idx = int(n * 0.85)

    X_train, y_train = X.iloc[:train_idx], y.iloc[:train_idx]
    X_val, y_val = X.iloc[train_idx:val_idx], y.iloc[train_idx:val_idx]
    X_test, y_test = X.iloc[val_idx:], y.iloc[val_idx:]

    print(f"Step 3: Training HistGradientBoostingRegressor on {len(X_train)} samples...")
    model = HistGradientBoostingRegressor(
        max_iter=150,
        learning_rate=0.08,
        max_leaf_nodes=31,
        min_samples_leaf=20,
        random_state=42
    )
    model.fit(X_train, y_train)

    print("Step 4: Evaluating on held-out out-of-time test set...")
    y_pred_test = model.predict(X_test)
    
    mae = float(mean_absolute_error(y_test, y_pred_test))
    rmse = float(np.sqrt(mean_squared_error(y_test, y_pred_test)))
    r2 = float(r2_score(y_test, y_pred_test))
    mape = float(np.mean(np.abs((y_test - y_pred_test) / np.maximum(y_test, 1.0))) * 100)

    # Compute empirical residual quantiles for honest confidence intervals
    residuals = y_test.values - y_pred_test
    q10 = float(np.percentile(residuals, 10))
    q90 = float(np.percentile(residuals, 90))

    print(f"Test MAE:  {mae:.2f} µg/m³")
    print(f"Test RMSE: {rmse:.2f} µg/m³")
    print(f"Test R²:   {r2:.4f}")
    print(f"Test MAPE: {mape:.2f}%")
    print(f"90% Residual Quantiles: [{q10:.2f}, {q90:.2f}]")

    # Save artifacts
    os.makedirs(os.path.join(os.path.dirname(__file__), "..", "models"), exist_ok=True)
    model_path = os.path.join(os.path.dirname(__file__), "..", "models", "pm25_xgb_model.joblib")
    meta_path = os.path.join(os.path.dirname(__file__), "..", "models", "metadata.json")

    joblib.dump(model, model_path)

    metadata = {
        "model_version": "HistGBM-PM25-v1.4",
        "model_type": "Histogram-based Gradient Boosted Trees (scikit-learn)",
        "target": "PM2.5 Concentration (µg/m³)",
        "features": feature_cols,
        "metrics": {
            "mae": round(mae, 2),
            "rmse": round(rmse, 2),
            "r2": round(r2, 4),
            "mape": round(mape, 2),
            "q10_residual": round(q10, 2),
            "q90_residual": round(q90, 2)
        },
        "training_samples": len(X_train),
        "test_samples": len(X_test),
        "split_method": "Strict Chronological Out-of-Time Split (No Shuffling)",
        "is_demo_synthetic": True
    }

    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"Model saved to {model_path}")
    print(f"Metadata saved to {meta_path}")


if __name__ == "__main__":
    train_model()
