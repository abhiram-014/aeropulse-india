# Indian National Air Quality Index (CPCB NAQI 2014) Methodology

## 1. Overview
The National Air Quality Index (NAQI) in India was introduced in 2014 by the Central Pollution Control Board (CPCB) in consultation with IIT Kanpur. It converts complex atmospheric concentrations of multiple criteria pollutants into a single unified numerical index between 0 and 500.

## 2. Mathematical Formula
For any pollutant $p$ with observed concentration $C_p$, the sub-index $I_p$ is calculated using piecewise linear interpolation:

$$I_p = I_{\text{low}} + \frac{I_{\text{high}} - I_{\text{low}}}{B_{\text{high}} - B_{\text{low}}} \times (C_p - B_{\text{low}})$$

Where:
- $B_{\text{low}}$ = Lower breakpoint concentration for the bucket containing $C_p$
- $B_{\text{high}}$ = Upper breakpoint concentration for the bucket containing $C_p$
- $I_{\text{low}}$ = Lower AQI breakpoint value for the corresponding category
- $I_{\text{high}}$ = Upper AQI breakpoint value for the corresponding category

## 3. Official CPCB Breakpoints

| AQI Category | Scale | PM2.5 (24h) | PM10 (24h) | NO2 (24h) | SO2 (24h) | CO (8h mg/m³) | O3 (8h) | NH3 (24h) | Pb (24h) |
|---|---|---|---|---|---|---|---|---|---|
| **Good** | 0 – 50 | 0 – 30 | 0 – 50 | 0 – 40 | 0 – 40 | 0 – 1.0 | 0 – 50 | 0 – 200 | 0 – 0.5 |
| **Satisfactory** | 51 – 100 | 31 – 60 | 51 – 100 | 41 – 80 | 41 – 80 | 1.1 – 2.0 | 51 – 100 | 201 – 400 | 0.6 – 1.0 |
| **Moderate** | 101 – 200 | 61 – 90 | 101 – 250 | 81 – 180 | 81 – 380 | 2.1 – 10.0 | 101 – 168 | 401 – 800 | 1.1 – 2.0 |
| **Poor** | 201 – 300 | 91 – 120 | 251 – 350 | 181 – 280 | 381 – 800 | 10.1 – 17.0 | 169 – 208 | 801 – 1200 | 2.1 – 3.0 |
| **Very Poor** | 301 – 400 | 121 – 250 | 351 – 430 | 281 – 400 | 801 – 1600 | 17.1 – 34.0 | 209 – 748 | 1201 – 1800 | 3.1 – 3.5 |
| **Severe** | 401 – 500 | 251 – 380 | 431 – 510 | 401 – 520 | 1601 – 2400 | 34.1 – 50.0 | 749 – 1000 | 1801 – 2400 | 3.6 – 5.0 |

*All values in $\text{µg/m}^3$ except CO in $\text{mg/m}^3$.*

## 4. Multi-Pollutant Aggregation & Validity Criteria
1. **Dominant Pollutant**: The overall AQI is governed by the highest sub-index:
   $$AQI = \max(I_{\text{pm25}}, I_{\text{pm10}}, I_{\text{no2}}, I_{\text{so2}}, I_{\text{co}}, I_{\text{o3}}, I_{\text{nh3}}, I_{\text{pb}})$$
2. **Minimum Pollutant Constraint**: At least **3 pollutants** must be monitored.
3. **Mandatory Particulate Constraint**: At least one particulate matter fraction (**PM2.5 or PM10**) must be actively monitored. If absent, the official CPCB calculation standard is violated, and only a provisional sub-index can be reported.
