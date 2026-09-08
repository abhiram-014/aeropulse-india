-- Seed data for key Indian air quality monitoring stations

INSERT INTO locations (id, name, city, state, country, latitude, longitude, elevation, station_type) VALUES
('delhi-anand-vihar', 'Anand Vihar CAAQMS', 'Delhi', 'Delhi', 'IN', 28.6476, 77.3158, 216.0, 'CAAQMS_URBAN'),
('delhi-ito', 'ITO Cross Road', 'Delhi', 'Delhi', 'IN', 28.6289, 77.2405, 218.0, 'CAAQMS_TRAFFIC'),
('mumbai-bandra', 'Bandra Kurla Complex (BKC)', 'Mumbai', 'Maharashtra', 'IN', 19.0657, 72.8683, 14.0, 'CAAQMS_URBAN'),
('mumbai-worli', 'Worli Sea Face', 'Mumbai', 'Maharashtra', 'IN', 19.0178, 72.8178, 8.0, 'CAAQMS_COASTAL'),
('bengaluru-btm', 'BTM Layout CAAQMS', 'Bengaluru', 'Karnataka', 'IN', 12.9166, 77.6101, 920.0, 'CAAQMS_RESIDENTIAL'),
('bengaluru-silk-board', 'Central Silk Board', 'Bengaluru', 'Karnataka', 'IN', 12.9174, 77.6229, 915.0, 'CAAQMS_TRAFFIC'),
('kolkata-victoria', 'Victoria Memorial Hall', 'Kolkata', 'West Bengal', 'IN', 22.5448, 88.3426, 9.0, 'CAAQMS_URBAN'),
('kolkata-jadavpur', 'Jadavpur University Campus', 'Kolkata', 'West Bengal', 'IN', 22.4988, 88.3712, 11.0, 'CAAQMS_SUBURBAN'),
('chennai-alagappa', 'Alagappa Nagar CAAQMS', 'Chennai', 'Tamil Nadu', 'IN', 13.0827, 80.2707, 6.0, 'CAAQMS_URBAN'),
('hyderabad-sanathnagar', 'Sanathnagar Industrial Area', 'Hyderabad', 'Telangana', 'IN', 17.4578, 78.4398, 536.0, 'CAAQMS_INDUSTRIAL'),
('ahmedabad-maninagar', 'Maninagar CAAQMS', 'Ahmedabad', 'Gujarat', 'IN', 22.9978, 72.6033, 53.0, 'CAAQMS_URBAN'),
('pune-shivajinagar', 'Shivajinagar Station', 'Pune', 'Maharashtra', 'IN', 18.5314, 73.8446, 560.0, 'CAAQMS_URBAN'),
('lucknow-lalbagh', 'Lalbagh Municipal Office', 'Lucknow', 'Uttar Pradesh', 'IN', 26.8467, 80.9462, 123.0, 'CAAQMS_URBAN'),
('patna-muradpur', 'Muradpur CAAQMS', 'Patna', 'Bihar', 'IN', 25.6127, 85.1588, 53.0, 'CAAQMS_URBAN'),
('jaipur-shastri-nagar', 'Shastri Nagar', 'Jaipur', 'Rajasthan', 'IN', 26.9388, 75.8012, 431.0, 'CAAQMS_URBAN'),
('chandigarh-sector-22', 'Sector 22 CAAQMS', 'Chandigarh', 'Chandigarh', 'IN', 30.7298, 76.7767, 321.0, 'CAAQMS_URBAN')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude;
