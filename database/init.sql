-- Initialization script for One Health Surveillance System
-- This script creates sample data for testing

INSERT INTO users (username, email, password_hash, full_name, role, organization)
VALUES 
    ('field_worker_01', 'worker01@health.gov', 'hashed_password_1', 'John Smith', 'field_worker', 'Health Ministry'),
    ('analyst_01', 'analyst01@health.gov', 'hashed_password_2', 'Jane Analyst', 'analyst', 'Health Ministry'),
    ('admin_01', 'admin@health.gov', 'hashed_password_3', 'Admin User', 'admin', 'Health Ministry')
ON CONFLICT DO NOTHING;

-- Sample Human Cases
INSERT INTO human_data (case_id, patient_name, age, gender, symptoms, case_type, severity, location_name, latitude, longitude, geom, contact_count, hospitalized, outcome, reported_by, created_at)
VALUES 
    ('CASE_H_001', 'Patient A', 35, 'M', ARRAY['fever', 'dry_cough', 'shortness_of_breath'], 'respiratory', 'severe', 'City District Hospital', 40.7128, -74.0060, ST_SetSRID(ST_MakePoint(-74.0060, 40.7128), 4326), 5, TRUE, 'ongoing', 'field_worker_01', CURRENT_TIMESTAMP - INTERVAL '24 hours'),
    ('CASE_H_002', 'Patient B', 28, 'F', ARRAY['fever', 'cough', 'fatigue'], 'respiratory', 'moderate', 'Clinic North', 40.7200, -74.0050, ST_SetSRID(ST_MakePoint(-74.0050, 40.7200), 4326), 3, FALSE, 'recovered', 'field_worker_01', CURRENT_TIMESTAMP - INTERVAL '48 hours'),
    ('CASE_H_003', 'Patient C', 55, 'M', ARRAY['fever', 'diarrhea', 'nausea'], 'gastrointestinal', 'mild', 'Market Area', 40.7100, -74.0080, ST_SetSRID(ST_MakePoint(-74.0080, 40.7100), 4326), 2, FALSE, 'recovered', 'field_worker_01', CURRENT_TIMESTAMP - INTERVAL '72 hours')
ON CONFLICT DO NOTHING;

-- Sample Animal Data
INSERT INTO animal_data (event_id, species, species_detail, population_count, mortality_count, morbidity_count, location_name, latitude, longitude, geom, clinical_signs, reported_by, farm_id, vaccination_status, created_at)
VALUES 
    ('EVENT_A_001', 'poultry', 'Layer hens', 5000, 120, 450, 'Farm Zone A', 40.7140, -74.0065, ST_SetSRID(ST_MakePoint(-74.0065, 40.7140), 4326), ARRAY['ruffled_feathers', 'nasal_discharge', 'reduced_egg_production'], 'field_worker_01', 'FARM_001', 'partial', CURRENT_TIMESTAMP - INTERVAL '12 hours'),
    ('EVENT_A_002', 'swine', 'Breeding sows', 200, 10, 50, 'Farm Zone B', 40.7250, -74.0100, ST_SetSRID(ST_MakePoint(-74.0100, 40.7250), 4326), ARRAY['fever', 'respiratory_signs', 'anorexia'], 'field_worker_01', 'FARM_002', 'up_to_date', CURRENT_TIMESTAMP - INTERVAL '5 days'),
    ('EVENT_A_003', 'wild_bird', 'Migratory waterfowl', 50, 8, 15, 'Wetland Area', 40.7300, -74.0150, ST_SetSRID(ST_MakePoint(-74.0150, 40.7300), 4326), ARRAY['lethargy', 'neurological_signs'], 'field_worker_01', NULL, 'unknown', CURRENT_TIMESTAMP - INTERVAL '3 days')
ON CONFLICT DO NOTHING;

-- Sample Environmental Data
INSERT INTO environmental_data (sample_id, sample_type, location_name, latitude, longitude, geom, temperature, humidity, water_quality_ph, water_turbidity, pathogen_detected, pollutant_level, pollutant_type, air_quality_index, notes, reported_by, created_at)
VALUES 
    ('SAMPLE_E_001', 'water', 'Local Water Source - Farm Zone A', 40.7140, -74.0065, ST_SetSRID(ST_MakePoint(-74.0065, 40.7140), 4326), 22.5, 65.0, 7.2, 2.1, ARRAY['E_coli', 'influenza_virus_detected'], 0.5, 'nitrate', 45.0, 'Water sample from farm area near poultry outbreak', 'field_worker_01', CURRENT_TIMESTAMP - INTERVAL '6 hours'),
    ('SAMPLE_E_002', 'air', 'City Center', 40.7128, -74.0060, ST_SetSRID(ST_MakePoint(-74.0060, 40.7128), 4326), 20.0, 55.0, NULL, NULL, ARRAY['PM2.5', 'particulate_matter'], 85.0, 'airborne_particles', 120.0, 'Air quality monitoring in urban center', 'field_worker_01', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
    ('SAMPLE_E_003', 'soil', 'Farm Zone A', 40.7140, -74.0065, ST_SetSRID(ST_MakePoint(-74.0065, 40.7140), 4326), 18.0, 70.0, 6.8, NULL, ARRAY['salmonella'], 2.3, 'heavy_metals', NULL, 'Soil contamination check', 'field_worker_01', CURRENT_TIMESTAMP - INTERVAL '24 hours')
ON CONFLICT DO NOTHING;

-- Create Alert Examples
INSERT INTO alert_events (alert_id, risk_level, alert_type, human_case_id, animal_event_id, environmental_sample_id, description, distance_km, time_diff_hours, recommendation, status, created_at)
SELECT 
    'ALERT_001',
    'high',
    'zoonotic_risk',
    hd.id,
    ad.id,
    ed.id,
    'High risk alert: Respiratory case within 10km of poultry mortality event within 48 hours',
    ST_Distance(hd.geom::geography, ad.geom::geography) / 1000 as distance_km,
    EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - CURRENT_TIMESTAMP)) / 3600 as time_diff_hours,
    'Immediate investigation recommended. Coordinate with animal health and environmental teams.',
    'active',
    CURRENT_TIMESTAMP
FROM human_data hd
CROSS JOIN animal_data ad
CROSS JOIN environmental_data ed
WHERE hd.case_id = 'CASE_H_001' AND ad.event_id = 'EVENT_A_001' AND ed.sample_id = 'SAMPLE_E_001'
ON CONFLICT DO NOTHING;
