"""
Generates synthetic sample MOSDAC/ISRO INSAT-3DR AOD file for end-to-end verification.
"""

import json
import os
from datetime import datetime, timezone


def generate_sample():
    os.makedirs("data/raw", exist_ok=True)
    sample_path = "data/raw/insat3dr_sample_aod.json"
    
    data = {
        "satellite": "INSAT-3DR",
        "instrument": "IMAGER",
        "product_name": "3RIMG_L2B_AOD",
        "observation_time": datetime.now(timezone.utc).isoformat(),
        "spatial_coverage": {
            "min_latitude": 6.0,
            "max_latitude": 38.0,
            "min_longitude": 68.0,
            "max_longitude": 98.0
        },
        "variables": {
            "aerosol_optical_depth_550nm": {
                "unit": "dimensionless",
                "valid_range": [0.0, 3.0],
                "mean_subcontinent_value": 0.625,
                "fill_value": -999.0
            },
            "cloud_mask": {
                "unit": "bitmask",
                "values": [0, 1]
            }
        },
        "data_provider": "Space Applications Centre (SAC), ISRO / MOSDAC",
        "disclaimer": "INSAT-3DR AOD measures total column aerosol optical thickness and is NOT direct ground-level AQI or PM2.5."
    }

    with open(sample_path, "w") as f:
        json.dump(data, f, indent=2)

    print(f"Sample MOSDAC metadata created at: {sample_path}")


if __name__ == "__main__":
    generate_sample()
