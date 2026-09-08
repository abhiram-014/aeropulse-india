"""
Database Seeder Script
======================
Populates the air-quality platform database with deterministic realistic demo
data for all Indian monitoring stations so the app works end-to-end without
live CPCB/OpenAQ credentials.

Usage:
    python scripts/seed_database.py [--stations N] [--hours H] [--db PATH]

Defaults:
    --stations  20   (stations loaded from demoDataProvider fixture)
    --hours     72   (3 days of hourly observations)
    --db        data/air_quality.db   (SQLite path relative to project root)
"""

import argparse
import json
import math
import os
import random
import sqlite3
import sys
from datetime import datetime, timedelta, timezone

# ── Station Definitions (mirrors backend/src/providers/demoDataProvider.ts) ──
STATIONS = [
    {"id": "delhi-anand-vihar",     "name": "Anand Vihar CAAQMS",          "city": "Delhi",       "state": "Delhi",         "lat": 28.6476, "lon": 77.3158, "elevation": 216.0, "station_type": "CAAQMS_URBAN"},
    {"id": "delhi-ito",             "name": "ITO Cross Road",               "city": "Delhi",       "state": "Delhi",         "lat": 28.6289, "lon": 77.2405, "elevation": 218.0, "station_type": "CAAQMS_TRAFFIC"},
    {"id": "mumbai-bandra",         "name": "Bandra Kurla Complex (BKC)",   "city": "Mumbai",      "state": "Maharashtra",   "lat": 19.0657, "lon": 72.8683, "elevation": 14.0,  "station_type": "CAAQMS_URBAN"},
    {"id": "mumbai-worli",          "name": "Worli Sea Face",               "city": "Mumbai",      "state": "Maharashtra",   "lat": 19.0178, "lon": 72.8178, "elevation": 8.0,   "station_type": "CAAQMS_COASTAL"},
    {"id": "bengaluru-btm",         "name": "BTM Layout CAAQMS",            "city": "Bengaluru",   "state": "Karnataka",     "lat": 12.9166, "lon": 77.6101, "elevation": 920.0, "station_type": "CAAQMS_RESIDENTIAL"},
    {"id": "bengaluru-silk-board",  "name": "Central Silk Board",           "city": "Bengaluru",   "state": "Karnataka",     "lat": 12.9174, "lon": 77.6229, "elevation": 915.0, "station_type": "CAAQMS_TRAFFIC"},
    {"id": "kolkata-victoria",      "name": "Victoria Memorial Hall",       "city": "Kolkata",     "state": "West Bengal",   "lat": 22.5448, "lon": 88.3426, "elevation": 9.0,   "station_type": "CAAQMS_URBAN"},
    {"id": "kolkata-rabindra",      "name": "Rabindra Sarobar",             "city": "Kolkata",     "state": "West Bengal",   "lat": 22.5076, "lon": 88.3474, "elevation": 7.0,   "station_type": "CAAQMS_RESIDENTIAL"},
    {"id": "chennai-alagappa",      "name": "Alagappa Nagar CAAQMS",        "city": "Chennai",     "state": "Tamil Nadu",    "lat": 13.0827, "lon": 80.2707, "elevation": 16.0,  "station_type": "CAAQMS_URBAN"},
    {"id": "chennai-manali",        "name": "Manali Industrial Area",       "city": "Chennai",     "state": "Tamil Nadu",    "lat": 13.1677, "lon": 80.2683, "elevation": 12.0,  "station_type": "CAAQMS_INDUSTRIAL"},
    {"id": "hyderabad-sanathnagar", "name": "Sanathnagar Industrial Area",  "city": "Hyderabad",   "state": "Telangana",     "lat": 17.4578, "lon": 78.4398, "elevation": 536.0, "station_type": "CAAQMS_INDUSTRIAL"},
    {"id": "hyderabad-zoo-park",    "name": "Nehru Zoological Park",        "city": "Hyderabad",   "state": "Telangana",     "lat": 17.3616, "lon": 78.4511, "elevation": 521.0, "station_type": "CAAQMS_RESIDENTIAL"},
    {"id": "pune-katraj",           "name": "Katraj Municipal Monitoring",  "city": "Pune",        "state": "Maharashtra",   "lat": 18.4529, "lon": 73.8674, "elevation": 567.0, "station_type": "CAAQMS_RESIDENTIAL"},
    {"id": "lucknow-lalbagh",       "name": "Lalbagh Municipal Office",     "city": "Lucknow",     "state": "Uttar Pradesh", "lat": 26.8467, "lon": 80.9462, "elevation": 111.0, "station_type": "CAAQMS_URBAN"},
    {"id": "patna-muradpur",        "name": "Muradpur CAAQMS",              "city": "Patna",       "state": "Bihar",         "lat": 25.6127, "lon": 85.1588, "elevation": 56.0,  "station_type": "CAAQMS_URBAN"},
    {"id": "jaipur-shastri-nagar",  "name": "Shastri Nagar CAAQMS",        "city": "Jaipur",      "state": "Rajasthan",     "lat": 26.9124, "lon": 75.7873, "elevation": 432.0, "station_type": "CAAQMS_RESIDENTIAL"},
    {"id": "ahmedabad-ctm",         "name": "CTM Crossroads",               "city": "Ahmedabad",   "state": "Gujarat",       "lat": 23.0225, "lon": 72.5714, "elevation": 55.0,  "station_type": "CAAQMS_TRAFFIC"},
    {"id": "surat-lal-darwaja",     "name": "Lal Darwaja Industrial Area",  "city": "Surat",       "state": "Gujarat",       "lat": 21.1702, "lon": 72.8311, "elevation": 13.0,  "station_type": "CAAQMS_INDUSTRIAL"},
    {"id": "bhopal-tt-nagar",       "name": "TT Nagar CAAQMS",             "city": "Bhopal",      "state": "Madhya Pradesh","lat": 23.2599, "lon": 77.4126, "elevation": 497.0, "station_type": "CAAQMS_RESIDENTIAL"},
    {"id": "nagpur-civil-lines",    "name": "Civil Lines CAAQMS",           "city": "Nagpur",      "state": "Maharashtra",   "lat": 21.1458, "lon": 79.0882, "elevation": 311.0, "station_type": "CAAQMS_URBAN"},
]

# City-level baseline PM2.5 (µg/m³) — realistic 24-hour averages
CITY_BASELINE_PM25 = {
    "Delhi": 95.0, "Mumbai": 42.0, "Bengaluru": 28.0, "Kolkata": 68.0,
    "Chennai": 30.0, "Hyderabad": 35.0, "Pune": 32.0, "Lucknow": 72.0,
    "Patna": 82.0, "Jaipur": 55.0, "Ahmedabad": 48.0, "Surat": 45.0,
    "Bhopal": 38.0, "Nagpur": 40.0,
}

STATION_TYPE_MULTIPLIER = {
    "CAAQMS_INDUSTRIAL": 1.35, "CAAQMS_TRAFFIC": 1.20,
    "CAAQMS_URBAN": 1.00, "CAAQMS_RESIDENTIAL": 0.85, "CAAQMS_COASTAL": 0.75,
}

AQI_BREAKPOINTS = [
    (0, 30, 0, 50), (31, 60, 51, 100), (61, 90, 101, 200),
    (91, 120, 201, 300), (121, 250, 301, 400), (251, 380, 401, 500),
]
AQI_CATEGORIES = ["Good", "Satisfactory", "Moderate", "Poor", "Very Poor", "Severe"]


def pm25_to_aqi(pm25: float) -> int:
    pm25 = max(0.0, pm25)
    for c_lo, c_hi, i_lo, i_hi in AQI_BREAKPOINTS:
        if c_lo <= pm25 <= c_hi:
            return int(round(i_lo + (i_hi - i_lo) / (c_hi - c_lo) * (pm25 - c_lo)))
    return 500


def aqi_category(aqi: int) -> str:
    for cat, thresh in zip(AQI_CATEGORIES, [50, 100, 200, 300, 400, 500]):
        if aqi <= thresh:
            return cat
    return "Severe"


def dominant_pollutant(pm25: float, pm10: float) -> str:
    si25 = pm25_to_aqi(pm25)
    si10 = pm25_to_aqi(pm10 / 2.4)  # rough PM10 sub-index scale
    return "pm25" if si25 >= si10 else "pm10"


def hourly_pm25(base: float, hour: int, rng: random.Random) -> float:
    """Diurnal cycle: morning peak (8-10h), evening peak (19-22h), trough (3-5h)."""
    diurnal = (
        0.4 * math.sin(2 * math.pi * (hour - 9) / 24)
        + 0.3 * math.sin(2 * math.pi * (hour - 20) / 24)
    )
    noise = rng.gauss(0, base * 0.08)
    return max(5.0, round(base * (1 + 0.35 * diurnal) + noise, 1))


def create_schema(conn: sqlite3.Connection):
    conn.executescript("""
    CREATE TABLE IF NOT EXISTS locations (
        id            TEXT PRIMARY KEY,
        name          TEXT NOT NULL,
        city          TEXT NOT NULL,
        state         TEXT NOT NULL,
        country       TEXT NOT NULL DEFAULT 'IN',
        latitude      REAL NOT NULL,
        longitude     REAL NOT NULL,
        elevation     REAL,
        station_type  TEXT
    );

    CREATE TABLE IF NOT EXISTS air_quality_observations (
        id                  INTEGER PRIMARY KEY AUTOINCREMENT,
        location_id         TEXT NOT NULL REFERENCES locations(id),
        timestamp           TEXT NOT NULL,
        pm25                REAL,
        pm10                REAL,
        no2                 REAL,
        so2                 REAL,
        co                  REAL,
        o3                  REAL,
        nh3                 REAL,
        source              TEXT NOT NULL,
        data_quality_score  REAL DEFAULT 1.0,
        is_validated        INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS aqi_records (
        id                  INTEGER PRIMARY KEY AUTOINCREMENT,
        location_id         TEXT NOT NULL REFERENCES locations(id),
        timestamp           TEXT NOT NULL,
        aqi                 INTEGER NOT NULL,
        category            TEXT NOT NULL,
        dominant_pollutant  TEXT NOT NULL,
        methodology         TEXT NOT NULL DEFAULT 'CPCB_INDIA_2014',
        sub_indices         TEXT NOT NULL,
        pollutant_count     INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_obs_location_time
        ON air_quality_observations (location_id, timestamp);
    CREATE INDEX IF NOT EXISTS idx_aqi_location_time
        ON aqi_records (location_id, timestamp);
    """)
    conn.commit()
    print("  ✓ Schema created / verified.")


def seed_locations(conn: sqlite3.Connection, stations: list):
    conn.executemany(
        """INSERT OR REPLACE INTO locations
           (id, name, city, state, country, latitude, longitude, elevation, station_type)
           VALUES (?,?,?,?,?,?,?,?,?)""",
        [
            (s["id"], s["name"], s["city"], s["state"], "IN",
             s["lat"], s["lon"], s["elevation"], s["station_type"])
            for s in stations
        ]
    )
    conn.commit()
    print(f"  ✓ Seeded {len(stations)} locations.")


def seed_observations(conn: sqlite3.Connection, stations: list, hours: int):
    rng = random.Random(42)
    now_utc = datetime.now(timezone.utc).replace(minute=0, second=0, microsecond=0)

    obs_rows = []
    aqi_rows = []

    for station in stations:
        city   = station["city"]
        stype  = station["station_type"]
        base   = CITY_BASELINE_PM25.get(city, 45.0) * STATION_TYPE_MULTIPLIER.get(stype, 1.0)

        for h in range(hours, 0, -1):
            ts = now_utc - timedelta(hours=h)
            ts_str = ts.isoformat()

            pm25 = hourly_pm25(base, ts.hour, rng)
            pm10 = round(pm25 * rng.uniform(1.5, 2.2), 1)
            no2  = round(rng.uniform(15, 80) * STATION_TYPE_MULTIPLIER.get(stype, 1.0), 1)
            so2  = round(rng.uniform(5, 40), 1)
            co   = round(rng.uniform(0.4, 3.5), 2)
            o3   = round(rng.uniform(10, 80), 1)
            nh3  = round(rng.uniform(2, 25), 1)
            dq   = round(rng.uniform(0.90, 1.00), 3)

            obs_rows.append((
                station["id"], ts_str, pm25, pm10, no2, so2, co, o3, nh3,
                "DEMO_SIMULATION", dq, 1
            ))

            # AQI record
            aqi_val = pm25_to_aqi(pm25)
            cat     = aqi_category(aqi_val)
            dom     = dominant_pollutant(pm25, pm10)
            sub_idx = json.dumps({
                "pm25": pm25_to_aqi(pm25),
                "pm10": pm25_to_aqi(pm10 / 2.4),
                "no2":  int(no2 * 0.8),
                "so2":  int(so2 * 0.6),
                "co":   int(co * 30),
                "o3":   int(o3 * 0.9),
                "nh3":  int(nh3 * 0.4),
            })
            aqi_rows.append((
                station["id"], ts_str, aqi_val, cat, dom,
                "CPCB_INDIA_2014", sub_idx, 7
            ))

    conn.executemany(
        """INSERT OR IGNORE INTO air_quality_observations
           (location_id, timestamp, pm25, pm10, no2, so2, co, o3, nh3,
            source, data_quality_score, is_validated)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
        obs_rows
    )
    conn.executemany(
        """INSERT OR IGNORE INTO aqi_records
           (location_id, timestamp, aqi, category, dominant_pollutant,
            methodology, sub_indices, pollutant_count)
           VALUES (?,?,?,?,?,?,?,?)""",
        aqi_rows
    )
    conn.commit()
    print(f"  ✓ Seeded {len(obs_rows)} observations across {len(stations)} stations ({hours}h window).")


def main():
    parser = argparse.ArgumentParser(description="Air Quality Platform — Database Seeder")
    parser.add_argument("--stations", type=int, default=len(STATIONS),
                        help=f"Number of stations to seed (max {len(STATIONS)})")
    parser.add_argument("--hours", type=int, default=72,
                        help="Hours of historical observations to generate")
    parser.add_argument("--db", type=str, default="data/air_quality.db",
                        help="SQLite database path (relative to project root)")
    args = parser.parse_args()

    # Resolve path relative to project root (two levels up from scripts/)
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_path = os.path.join(project_root, args.db)
    os.makedirs(os.path.dirname(db_path), exist_ok=True)

    stations = STATIONS[: args.stations]

    print(f"\n{'='*55}")
    print("  Air Quality Platform — Database Seeder")
    print(f"{'='*55}")
    print(f"  DB path   : {db_path}")
    print(f"  Stations  : {len(stations)}")
    print(f"  Hours     : {args.hours}")
    print(f"{'='*55}\n")

    conn = sqlite3.connect(db_path)
    try:
        create_schema(conn)
        seed_locations(conn, stations)
        seed_observations(conn, stations, args.hours)
        print(f"\n  ✅ Database seeded successfully → {db_path}\n")
    finally:
        conn.close()


if __name__ == "__main__":
    main()
