-- One Health Surveillance System Database Schema
-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Human Cases Table
CREATE TABLE IF NOT EXISTS human_data (
    id SERIAL PRIMARY KEY,
    case_id VARCHAR(50) UNIQUE NOT NULL,
    patient_name VARCHAR(255),
    age INT,
    gender VARCHAR(10),
    symptoms TEXT[],
    case_type VARCHAR(50) NOT NULL, -- respiratory, gastrointestinal, other
    severity VARCHAR(20) NOT NULL, -- mild, moderate, severe, critical
    location_name VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    geom GEOMETRY(Point, 4326),
    contact_count INT DEFAULT 0,
    hospitalized BOOLEAN DEFAULT FALSE,
    outcome VARCHAR(20), -- recovered, deceased, ongoing
    reported_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_human_date (created_at),
    INDEX idx_human_type (case_type),
    INDEX idx_human_severity (severity)
);

-- Animal Data Table
CREATE TABLE IF NOT EXISTS animal_data (
    id SERIAL PRIMARY KEY,
    event_id VARCHAR(50) UNIQUE NOT NULL,
    species VARCHAR(100) NOT NULL, -- poultry, swine, cattle, wild_bird, etc.
    species_detail VARCHAR(255),
    population_count INT,
    mortality_count INT,
    morbidity_count INT,
    location_name VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    geom GEOMETRY(Point, 4326),
    clinical_signs TEXT[],
    reported_by VARCHAR(255),
    farm_id VARCHAR(100),
    vaccination_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_animal_date (created_at),
    INDEX idx_animal_species (species),
    INDEX idx_animal_mortality (mortality_count)
);

-- Environmental Data Table
CREATE TABLE IF NOT EXISTS environmental_data (
    id SERIAL PRIMARY KEY,
    sample_id VARCHAR(50) UNIQUE NOT NULL,
    sample_type VARCHAR(100) NOT NULL, -- water, air, soil, feed
    location_name VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    geom GEOMETRY(Point, 4326),
    temperature DECIMAL(5, 2),
    humidity DECIMAL(5, 2),
    water_quality_ph DECIMAL(4, 2),
    water_turbidity DECIMAL(8, 2),
    pathogen_detected VARCHAR(255)[],
    pollutant_level DECIMAL(10, 4),
    pollutant_type VARCHAR(100),
    air_quality_index DECIMAL(6, 2),
    notes TEXT,
    reported_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_env_date (created_at),
    INDEX idx_env_type (sample_type)
);

-- Alert Events Table
CREATE TABLE IF NOT EXISTS alert_events (
    id SERIAL PRIMARY KEY,
    alert_id VARCHAR(50) UNIQUE NOT NULL,
    risk_level VARCHAR(20) NOT NULL, -- low, moderate, high, critical
    alert_type VARCHAR(100) NOT NULL, -- disease_cluster, environmental_risk, zoonotic_risk
    human_case_id INT REFERENCES human_data(id),
    animal_event_id INT REFERENCES animal_data(id),
    environmental_sample_id INT REFERENCES environmental_data(id),
    description TEXT,
    distance_km DECIMAL(8, 2),
    time_diff_hours DECIMAL(8, 2),
    recommendation TEXT,
    status VARCHAR(50) DEFAULT 'active', -- active, resolved, archived
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_alert_level (risk_level),
    INDEX idx_alert_status (status),
    INDEX idx_alert_date (created_at)
);

-- Alerts History Table
CREATE TABLE IF NOT EXISTS alert_history (
    id SERIAL PRIMARY KEY,
    alert_id INT REFERENCES alert_events(id),
    previous_status VARCHAR(50),
    new_status VARCHAR(50),
    changed_by VARCHAR(255),
    reason TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Accounts Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'field_worker', -- field_worker, analyst, admin
    organization VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Spatial Indexes for PostGIS
CREATE INDEX idx_human_geom ON human_data USING GIST(geom);
CREATE INDEX idx_animal_geom ON animal_data USING GIST(geom);
CREATE INDEX idx_env_geom ON environmental_data USING GIST(geom);

-- Create View for Active Alerts
CREATE OR REPLACE VIEW active_alerts_view AS
SELECT 
    a.alert_id,
    a.risk_level,
    a.alert_type,
    a.distance_km,
    a.time_diff_hours,
    a.created_at,
    hd.case_id as human_case_id,
    hd.geom as human_location,
    ad.event_id as animal_event_id,
    ad.geom as animal_location
FROM alert_events a
LEFT JOIN human_data hd ON a.human_case_id = hd.id
LEFT JOIN animal_data ad ON a.animal_event_id = ad.id
WHERE a.status = 'active'
ORDER BY a.created_at DESC;
