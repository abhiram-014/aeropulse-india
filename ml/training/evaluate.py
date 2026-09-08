"""
ML Model Evaluation Script.
Loads a saved model, re-runs predictions on the held-out test set,
and produces a comprehensive performance report.
"""

import json
import os
import sys

import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Allow running from any directory
sys.path.insert(0, os.path.dirname(__file__))

from dataset_builder import generate_training_dataset
from features import (
    create_lag_and_rolling_features,
    create_meteorological_features,
    create_time_features,
)

FEATURE_COLS = [
    "hour_sin", "hour_cos", "dow_sin", "dow_cos", "month_sin", "month_cos", "is_weekend",
    "temperature", "relative_humidity", "wind_speed", "wind_u", "wind_v",
    "ventilation_index", "insat_aod",
    "pm25_lag_1h", "pm25_lag_2h", "pm25_lag_3h", "pm25_lag_6h",
    "pm25_lag_12h", "pm25_lag_24h",
    "pm25_roll_mean_3h", "pm25_roll_std_3h", "pm25_roll_mean_6h", "pm25_roll_mean_24h",
]
TARGET_COL = "pm25"

AQI_BREAKPOINTS = [
    (0, 30, 0, 50),
    (31, 60, 51, 100),
    (61, 90, 101, 200),
    (91, 120, 201, 300),
    (121, 250, 301, 400),
    (251, 380, 401, 500),
]

AQI_CATEGORIES = ["Good", "Satisfactory", "Moderate", "Poor", "Very Poor", "Severe"]


def pm25_to_aqi(pm25: float) -> int:
    """Convert PM2.5 concentration to CPCB AQI sub-index."""
    pm25 = max(0.0, float(pm25))
    for i, (c_lo, c_hi, i_lo, i_hi) in enumerate(AQI_BREAKPOINTS):
        if c_lo <= pm25 <= c_hi:
            return int(round(i_lo + (i_hi - i_lo) / (c_hi - c_lo) * (pm25 - c_lo)))
    return 500


def aqi_to_category(aqi: int) -> str:
    thresholds = [50, 100, 200, 300, 400, 500]
    for cat, thresh in zip(AQI_CATEGORIES, thresholds):
        if aqi <= thresh:
            return cat
    return "Severe"


def evaluate_model():
    model_path = os.path.join(os.path.dirname(__file__), "..", "models", "pm25_xgb_model.joblib")
    meta_path = os.path.join(os.path.dirname(__file__), "..", "models", "metadata.json")

    if not os.path.exists(model_path):
        print(f"[ERROR] Model not found at {model_path}. Run train.py first.")
        sys.exit(1)

    print("Loading saved model...")
    model = joblib.load(model_path)

    print("Rebuilding evaluation dataset...")
    raw_df = generate_training_dataset()
    df = create_time_features(raw_df)
    df = create_meteorological_features(df)
    df = create_lag_and_rolling_features(df, target_col=TARGET_COL)
    df = df.dropna().reset_index(drop=True)

    n = len(df)
    val_idx = int(n * 0.85)
    X_test = df[FEATURE_COLS].iloc[val_idx:]
    y_test = df[TARGET_COL].iloc[val_idx:]

    print(f"Evaluating on {len(X_test)} held-out test samples...")
    y_pred = model.predict(X_test)

    # ── Regression Metrics ──────────────────────────────────────────────────
    mae  = float(mean_absolute_error(y_test, y_pred))
    rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))
    r2   = float(r2_score(y_test, y_pred))
    mape = float(np.mean(np.abs((y_test.values - y_pred) / np.maximum(y_test.values, 1.0))) * 100)

    residuals = y_test.values - y_pred
    q10 = float(np.percentile(residuals, 10))
    q90 = float(np.percentile(residuals, 90))

    # ── AQI Category Accuracy ───────────────────────────────────────────────
    true_cats = [aqi_to_category(pm25_to_aqi(v)) for v in y_test.values]
    pred_cats = [aqi_to_category(pm25_to_aqi(v)) for v in y_pred]
    cat_accuracy = float(np.mean([t == p for t, p in zip(true_cats, pred_cats)]) * 100)

    # ── Within-1-Category Accuracy ──────────────────────────────────────────
    cat_order = {c: i for i, c in enumerate(AQI_CATEGORIES)}
    within_1 = float(np.mean([
        abs(cat_order[t] - cat_order[p]) <= 1
        for t, p in zip(true_cats, pred_cats)
    ]) * 100)

    # ── Print Report ────────────────────────────────────────────────────────
    print("\n" + "=" * 60)
    print("  AIR QUALITY ML MODEL — EVALUATION REPORT")
    print("=" * 60)
    print(f"  Test samples         : {len(X_test)}")
    print(f"  MAE                  : {mae:.2f} µg/m³")
    print(f"  RMSE                 : {rmse:.2f} µg/m³")
    print(f"  R²                   : {r2:.4f}")
    print(f"  MAPE                 : {mape:.2f}%")
    print(f"  Residual q10 / q90   : {q10:.2f} / {q90:.2f} µg/m³")
    print(f"  AQI Category Acc.    : {cat_accuracy:.1f}%")
    print(f"  Within-1-Category    : {within_1:.1f}%")
    print("=" * 60)

    # Per-category breakdown
    print("\n  Per-Category Breakdown:")
    print(f"  {'True Category':<16} {'Count':>6}  {'Pred Match':>10}  {'Acc %':>7}")
    print("  " + "-" * 46)
    for cat in AQI_CATEGORIES:
        idxs = [i for i, c in enumerate(true_cats) if c == cat]
        if not idxs:
            continue
        matches = sum(1 for i in idxs if pred_cats[i] == cat)
        acc = 100 * matches / len(idxs) if idxs else 0.0
        print(f"  {cat:<16} {len(idxs):>6}  {matches:>10}  {acc:>6.1f}%")

    # ── Update metadata with evaluation results ─────────────────────────────
    if os.path.exists(meta_path):
        with open(meta_path) as f:
            metadata = json.load(f)
    else:
        metadata = {}

    metadata["evaluation"] = {
        "mae": round(mae, 2),
        "rmse": round(rmse, 2),
        "r2": round(r2, 4),
        "mape": round(mape, 2),
        "q10_residual": round(q10, 2),
        "q90_residual": round(q90, 2),
        "aqi_category_accuracy_pct": round(cat_accuracy, 1),
        "within_one_category_pct": round(within_1, 1),
        "test_samples": len(X_test),
    }

    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"\n  Evaluation results appended to {meta_path}")


if __name__ == "__main__":
    evaluate_model()
