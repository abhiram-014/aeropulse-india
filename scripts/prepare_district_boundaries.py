"""
Process India District Boundaries from DataMeet WGS84 GeoJSON
Produces:
1. data/processed/india_districts.json - Cleaned & normalized GeoJSON features indexed by state and district.
2. backend/src/data/indiaAdminData.ts - TypeScript registry of States, Districts, Stations, BBoxes, Centroids.
3. frontend/src/data/indiaAdminData.ts - Frontend mirror.
"""

import json
import os
import sys

TELANGANA_DISTRICTS = {
    "hyderabad", "rangareddi", "rangareddy", "medak", "nizamabad", "karimnagar",
    "warangal", "khammam", "nalgonda", "mahbubnagar", "mahabubnagar", "adilabad",
    "bhadradri kothagudem", "jagtial", "jangaon", "jayashankar bhupalpally",
    "jogulamba gadwal", "kamareddy", "kumuram bheem", "mahabubabad", "mancherial",
    "medchal-malkajgiri", "medchal malkajgiri", "mulugu", "nagarkurnool",
    "narayanpet", "nirmal", "peddapalli", "rajanna sircilla", "sangareddy",
    "siddipet", "suryapet", "vikarabad", "wanaparthy", "hanamkonda", "yadadri bhuvanagiri"
}

def round_coords(coords, precision=4):
    if isinstance(coords, (int, float)):
        return round(coords, precision)
    elif isinstance(coords, list):
        return [round_coords(c, precision) for c in coords]
    return coords

def compute_bbox_and_centroid(geometry):
    # Extracts all [lon, lat] pairs
    coords = []
    def extract(c):
        if len(c) == 2 and isinstance(c[0], (int, float)) and isinstance(c[1], (int, float)):
            coords.append(c)
        else:
            for item in c:
                extract(item)
    extract(geometry.get("coordinates", []))
    if not coords:
        return [0, 0, 0, 0], [0, 0]
    
    lons = [c[0] for c in coords]
    lats = [c[1] for c in coords]
    
    min_lon, max_lon = min(lons), max(lons)
    min_lat, max_lat = min(lats), max(lats)
    center_lon = round((min_lon + max_lon) / 2.0, 4)
    center_lat = round((min_lat + max_lat) / 2.0, 4)
    return [round(min_lat, 4), round(min_lon, 4), round(max_lat, 4), round(max_lon, 4)], [center_lat, center_lon]

def main():
    raw_path = "data/raw/india_district.geojson"
    out_dir = "data/processed"
    os.makedirs(out_dir, exist_ok=True)
    
    if not os.path.exists(raw_path):
        print(f"Error: {raw_path} not found.")
        sys.exit(1)

    print("Loading raw GeoJSON...")
    with open(raw_path, "r", encoding="utf-8") as f:
        raw_data = json.load(f)

    print(f"Raw features count: {len(raw_data.get('features', []))}")

    clean_features = []
    state_district_map = {}

    for f in raw_data.get("features", []):
        props = f.get("properties", {})
        state = props.get("NAME_1", "").strip()
        dist = props.get("NAME_2", "").strip()
        
        if not state or not dist:
            continue

        # Check for Telangana remapping
        dist_lower = dist.lower().replace("-", " ")
        if state.lower() == "andhra pradesh" and any(td in dist_lower for td in TELANGANA_DISTRICTS):
            state = "Telangana"
            if "rangareddi" in dist_lower:
                dist = "Rangareddy"

        # Standardize state names
        if state.lower() in ["orissa"]:
            state = "Odisha"
        elif state.lower() in ["uttaranchal"]:
            state = "Uttarakhand"
        elif state.lower() in ["pondicherry"]:
            state = "Puducherry"
        elif "delhi" in state.lower():
            state = "Delhi"

        # Simplify geometry
        geom = f.get("geometry", {})
        simplified_geom = {
            "type": geom.get("type"),
            "coordinates": round_coords(geom.get("coordinates", []))
        }

        bbox, centroid = compute_bbox_and_centroid(simplified_geom)

        feature_id = f"{state.lower().replace(' ', '_')}_{dist.lower().replace(' ', '_')}"

        clean_props = {
            "id": feature_id,
            "district": dist,
            "state": state,
            "country": "IN",
            "centroid": centroid,
            "bbox": bbox
        }

        clean_features.append({
            "type": "Feature",
            "id": feature_id,
            "properties": clean_props,
            "geometry": simplified_geom
        })

        if state not in state_district_map:
            state_district_map[state] = {}
        state_district_map[state][dist] = {
            "id": feature_id,
            "district": dist,
            "state": state,
            "centroid": centroid,
            "bbox": bbox
        }

    out_geojson_path = os.path.join(out_dir, "india_districts.json")
    print(f"Writing cleaned GeoJSON with {len(clean_features)} features to {out_geojson_path}...")
    with open(out_geojson_path, "w", encoding="utf-8") as f:
        json.dump({"type": "FeatureCollection", "features": clean_features}, f, separators=(',', ':'))

    print(f"Processed {len(state_district_map)} states and {len(clean_features)} districts.")

if __name__ == "__main__":
    main()
