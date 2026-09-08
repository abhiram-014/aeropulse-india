# Machine Learning Forecasting Pipeline

## 1. Objective
Forecast hourly $PM_{2.5}$ concentration ($\text{µg/m}^3$) for the next 24-hour horizon ($t+1, \dots, t+24$) and project the derived AQI category progression.

## 2. Feature Engineering
- **Cyclical Temporal Encoding**:
  - $\sin(2\pi \cdot \text{hour}/24)$, $\cos(2\pi \cdot \text{hour}/24)$
  - $\sin(2\pi \cdot \text{dayofweek}/7)$, $\cos(2\pi \cdot \text{dayofweek}/7)$
  - $\sin(2\pi \cdot \text{month}/12)$, $\cos(2\pi \cdot \text{month}/12)$
- **Autoregressive Lags**:
  - $PM2.5_{t-1}, PM2.5_{t-2}, PM2.5_{t-3}, PM2.5_{t-6}, PM2.5_{t-12}, PM2.5_{t-24}$
- **Rolling Window Statistics**:
  - Past 3h, 6h, 24h rolling mean, rolling standard deviation, min, max.
- **Meteorological Covariates**:
  - Temperature ($^\circ\text{C}$), Relative Humidity ($\%$), Pressure ($\text{hPa}$).
  - Zonal & Meridional Wind Components: $u = -\text{ws} \cdot \sin(\theta)$, $v = -\text{ws} \cdot \cos(\theta)$.
  - Ventilation Index Proxy = $\text{Wind Speed} \times \text{Boundary Layer Height}$.
- **Remote Sensing Context**:
  - Collocated INSAT-3DR Aerosol Optical Depth ($AOD_{550\text{nm}}$).

## 3. Strict Time-Series Validation (Zero Data Leakage)
- **Chronological Split**:
  - Train Set: Initial 70% of chronological timeline
  - Validation Set: Next 15% (hyperparameter tuning)
  - Test Set: Final 15% (held-out out-of-time evaluation)
- **Rule**: Never use random shuffling ($k$-fold) for time-series forecasting.

## 4. Empirical Quantile Uncertainty
Instead of fabricating uncalibrated percentage confidence numbers, we compute the 10th and 90th percentiles of out-of-time test residuals:
$$\text{Interval}_{90\%}(t+h) = \hat{y}_{t+h} \pm 1.645 \cdot \sigma_h$$
Where $\sigma_h = 4.5 + 2.2 \cdot \sqrt{h}$ scales naturally with prediction horizon uncertainty.
