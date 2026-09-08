"""
Generate TypeScript India Administrative Registry
"""

import json
import os

def main():
    json_path = "data/processed/india_districts.json"
    if not os.path.exists(json_path):
        print("Missing india_districts.json")
        return

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    states_dict = {}
    for feat in data.get("features", []):
        props = feat.get("properties", {})
        state = props.get("state")
        dist = props.get("district")
        centroid = props.get("centroid", [20.0, 78.0])
        bbox = props.get("bbox", [15.0, 75.0, 25.0, 85.0])
        feat_id = props.get("id")

        if state not in states_dict:
            states_dict[state] = []
        
        states_dict[state].append({
            "id": feat_id,
            "name": dist,
            "state": state,
            "centroid": centroid,
            "bbox": bbox
        })

    # Sort states and districts
    sorted_states = sorted(states_dict.keys())
    for s in sorted_states:
        states_dict[s] = sorted(states_dict[s], key=lambda d: d["name"])

    # Define monitoring stations with district
    stations = [
        {
            "id": "delhi-anand-vihar",
            "name": "Anand Vihar CAAQMS",
            "city": "Delhi",
            "district": "East Delhi",
            "state": "Delhi",
            "country": "IN",
            "latitude": 28.6476,
            "longitude": 77.3158,
            "elevation": 216.0,
            "stationType": "CAAQMS_URBAN"
        },
        {
            "id": "delhi-ito",
            "name": "ITO Cross Road",
            "city": "Delhi",
            "district": "Central Delhi",
            "state": "Delhi",
            "country": "IN",
            "latitude": 28.6289,
            "longitude": 77.2405,
            "elevation": 218.0,
            "stationType": "CAAQMS_TRAFFIC"
        },
        {
            "id": "mumbai-bandra",
            "name": "Bandra Kurla Complex (BKC)",
            "city": "Mumbai",
            "district": "Mumbai Suburban",
            "state": "Maharashtra",
            "country": "IN",
            "latitude": 19.0657,
            "longitude": 72.8683,
            "elevation": 14.0,
            "stationType": "CAAQMS_URBAN"
        },
        {
            "id": "mumbai-worli",
            "name": "Worli Sea Face",
            "city": "Mumbai",
            "district": "Mumbai City",
            "state": "Maharashtra",
            "country": "IN",
            "latitude": 19.0178,
            "longitude": 72.8178,
            "elevation": 8.0,
            "stationType": "CAAQMS_COASTAL"
        },
        {
            "id": "bengaluru-btm",
            "name": "BTM Layout CAAQMS",
            "city": "Bengaluru",
            "district": "Bangalore",
            "state": "Karnataka",
            "country": "IN",
            "latitude": 12.9166,
            "longitude": 77.6101,
            "elevation": 920.0,
            "stationType": "CAAQMS_RESIDENTIAL"
        },
        {
            "id": "bengaluru-silk-board",
            "name": "Central Silk Board",
            "city": "Bengaluru",
            "district": "Bangalore",
            "state": "Karnataka",
            "country": "IN",
            "latitude": 12.9174,
            "longitude": 77.6229,
            "elevation": 915.0,
            "stationType": "CAAQMS_TRAFFIC"
        },
        {
            "id": "kolkata-victoria",
            "name": "Victoria Memorial Hall",
            "city": "Kolkata",
            "district": "Kolkata",
            "state": "West Bengal",
            "country": "IN",
            "latitude": 22.5448,
            "longitude": 88.3426,
            "elevation": 9.0,
            "stationType": "CAAQMS_URBAN"
        },
        {
            "id": "kolkata-jadavpur",
            "name": "Jadavpur University",
            "city": "Kolkata",
            "district": "Kolkata",
            "state": "West Bengal",
            "country": "IN",
            "latitude": 22.4988,
            "longitude": 88.3712,
            "elevation": 11.0,
            "stationType": "CAAQMS_SUBURBAN"
        },
        {
            "id": "chennai-alagappa",
            "name": "Alagappa Nagar CAAQMS",
            "city": "Chennai",
            "district": "Chennai",
            "state": "Tamil Nadu",
            "country": "IN",
            "latitude": 13.0827,
            "longitude": 80.2707,
            "elevation": 16.0,
            "stationType": "CAAQMS_URBAN"
        },
        {
            "id": "chennai-manali",
            "name": "Manali Industrial Area",
            "city": "Chennai",
            "district": "Chennai",
            "state": "Tamil Nadu",
            "country": "IN",
            "latitude": 13.1677,
            "longitude": 80.2683,
            "elevation": 12.0,
            "stationType": "CAAQMS_INDUSTRIAL"
        },
        {
            "id": "hyderabad-sanathnagar",
            "name": "Sanathnagar Industrial Area",
            "city": "Hyderabad",
            "district": "Hyderabad",
            "state": "Telangana",
            "country": "IN",
            "latitude": 17.4578,
            "longitude": 78.4398,
            "elevation": 536.0,
            "stationType": "CAAQMS_INDUSTRIAL"
        },
        {
            "id": "hyderabad-zoo-park",
            "name": "Nehru Zoological Park",
            "city": "Hyderabad",
            "district": "Hyderabad",
            "state": "Telangana",
            "country": "IN",
            "latitude": 17.3616,
            "longitude": 78.4511,
            "elevation": 521.0,
            "stationType": "CAAQMS_RESIDENTIAL"
        },
        {
            "id": "ahmedabad-maninagar",
            "name": "Maninagar Station",
            "city": "Ahmedabad",
            "district": "Ahmadabad",
            "state": "Gujarat",
            "country": "IN",
            "latitude": 22.9978,
            "longitude": 72.6033,
            "elevation": 53.0,
            "stationType": "CAAQMS_URBAN"
        },
        {
            "id": "pune-shivajinagar",
            "name": "Shivajinagar Station",
            "city": "Pune",
            "district": "Pune",
            "state": "Maharashtra",
            "country": "IN",
            "latitude": 18.5314,
            "longitude": 73.8446,
            "elevation": 560.0,
            "stationType": "CAAQMS_URBAN"
        },
        {
            "id": "lucknow-lalbagh",
            "name": "Lalbagh Municipal Office",
            "city": "Lucknow",
            "district": "Lucknow",
            "state": "Uttar Pradesh",
            "country": "IN",
            "latitude": 26.8467,
            "longitude": 80.9462,
            "elevation": 123.0,
            "stationType": "CAAQMS_URBAN"
        },
        {
            "id": "patna-muradpur",
            "name": "Muradpur CAAQMS",
            "city": "Patna",
            "district": "Patna",
            "state": "Bihar",
            "country": "IN",
            "latitude": 25.6127,
            "longitude": 85.1588,
            "elevation": 53.0,
            "stationType": "CAAQMS_URBAN"
        },
        {
            "id": "jaipur-shastri-nagar",
            "name": "Shastri Nagar CAAQMS",
            "city": "Jaipur",
            "district": "Jaipur",
            "state": "Rajasthan",
            "country": "IN",
            "latitude": 26.9388,
            "longitude": 75.8012,
            "elevation": 431.0,
            "stationType": "CAAQMS_RESIDENTIAL"
        },
        {
            "id": "chandigarh-sector-22",
            "name": "Sector 22 CAAQMS",
            "city": "Chandigarh",
            "district": "Chandigarh",
            "state": "Chandigarh",
            "country": "IN",
            "latitude": 30.7298,
            "longitude": 76.7767,
            "elevation": 321.0,
            "stationType": "CAAQMS_URBAN"
        },
        {
            "id": "bhopal-tt-nagar",
            "name": "TT Nagar CAAQMS",
            "city": "Bhopal",
            "district": "Bhopal",
            "state": "Madhya Pradesh",
            "country": "IN",
            "latitude": 23.2599,
            "longitude": 77.4126,
            "elevation": 497.0,
            "stationType": "CAAQMS_RESIDENTIAL"
        },
        {
            "id": "nagpur-civil-lines",
            "name": "Civil Lines CAAQMS",
            "city": "Nagpur",
            "district": "Nagpur",
            "state": "Maharashtra",
            "country": "IN",
            "latitude": 21.1458,
            "longitude": 79.0882,
            "elevation": 311.0,
            "stationType": "CAAQMS_URBAN"
        }
    ]

    # Generate TypeScript code
    ts_code = f"""/**
 * Indian Administrative Geographic Hierarchy & Monitoring Station Registry
 * Hierarchy: INDIA -> STATE -> DISTRICT -> CITY/TOWN -> MONITORING STATION
 * Boundary Source: DataMeet Survey of India Administrative Boundary Dataset (ODbL / CC BY 4.0)
 */

export interface DistrictInfo {{
  id: string;
  name: string;
  state: string;
  centroid: [number, number]; // [lat, lon]
  bbox: [number, number, number, number]; // [minLat, minLon, maxLat, maxLon]
}}

export interface MonitoringStationInfo {{
  id: string;
  name: string;
  city: string;
  district: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  stationType?: string;
}}

export const INDIA_STATES: string[] = {json.dumps(sorted_states, indent=2)};

export const INDIA_DISTRICTS_BY_STATE: Record<string, DistrictInfo[]> = {json.dumps(states_dict, indent=2)};

export const INDIAN_MONITORING_STATIONS: MonitoringStationInfo[] = {json.dumps(stations, indent=2)};

/**
 * Resolves a district by state and district name
 */
export function getDistrictInfo(state: string, districtName: string): DistrictInfo | undefined {{
  const districts = INDIA_DISTRICTS_BY_STATE[state];
  if (!districts) return undefined;
  const target = districtName.toLowerCase().trim();
  return districts.find(d => d.name.toLowerCase().trim() === target || d.name.toLowerCase().includes(target));
}}

/**
 * Returns all real stations belonging to a district
 */
export function getStationsForDistrict(state: string, districtName: string): MonitoringStationInfo[] {{
  const targetState = state.toLowerCase().trim();
  const targetDist = districtName.toLowerCase().trim();
  return INDIAN_MONITORING_STATIONS.filter(s => 
    s.state.toLowerCase().trim() === targetState &&
    (s.district.toLowerCase().trim() === targetDist || s.district.toLowerCase().includes(targetDist) || targetDist.includes(s.district.toLowerCase()))
  );
}}
"""

    os.makedirs("backend/src/data", exist_ok=True)
    os.makedirs("frontend/src/data", exist_ok=True)

    with open("backend/src/data/indiaAdminData.ts", "w", encoding="utf-8") as f:
        f.write(ts_code)
    with open("frontend/src/data/indiaAdminData.ts", "w", encoding="utf-8") as f:
        f.write(ts_code)

    print("Generated backend/src/data/indiaAdminData.ts and frontend/src/data/indiaAdminData.ts")

if __name__ == "__main__":
    main()
