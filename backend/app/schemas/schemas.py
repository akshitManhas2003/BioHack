"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class UserCreate(BaseModel):
    username: str
    email: str
    full_name: str
    role: str = "field_worker"
    organization: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    role: str
    organization: str
    created_at: datetime

    class Config:
        from_attributes = True


class HumanDataCreate(BaseModel):
    patient_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    symptoms: List[str]
    case_type: str  # respiratory, gastrointestinal, other
    severity: str   # mild, moderate, severe, critical
    location_name: str
    latitude: float
    longitude: float
    contact_count: int = 0
    hospitalized: bool = False
    reported_by: str


class HumanDataResponse(BaseModel):
    id: int
    case_id: str
    patient_name: Optional[str]
    age: Optional[int]
    gender: Optional[str]
    symptoms: List[str]
    case_type: str
    severity: str
    location_name: str
    latitude: float
    longitude: float
    contact_count: int
    hospitalized: bool
    outcome: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AnimalDataCreate(BaseModel):
    species: str  # poultry, swine, cattle, wild_bird
    species_detail: Optional[str] = None
    population_count: Optional[int] = None
    mortality_count: int
    morbidity_count: int
    location_name: str
    latitude: float
    longitude: float
    clinical_signs: List[str]
    reported_by: str
    farm_id: Optional[str] = None
    vaccination_status: Optional[str] = None


class AnimalDataResponse(BaseModel):
    id: int
    event_id: str
    species: str
    species_detail: Optional[str]
    population_count: Optional[int]
    mortality_count: int
    morbidity_count: int
    location_name: str
    latitude: float
    longitude: float
    clinical_signs: List[str]
    farm_id: Optional[str]
    vaccination_status: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class EnvironmentalDataCreate(BaseModel):
    sample_type: str  # water, air, soil, feed
    location_name: str
    latitude: float
    longitude: float
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    water_quality_ph: Optional[float] = None
    water_turbidity: Optional[float] = None
    pathogen_detected: Optional[List[str]] = None
    pollutant_level: Optional[float] = None
    pollutant_type: Optional[str] = None
    air_quality_index: Optional[float] = None
    notes: Optional[str] = None
    reported_by: str


class EnvironmentalDataResponse(BaseModel):
    id: int
    sample_id: str
    sample_type: str
    location_name: str
    latitude: float
    longitude: float
    temperature: Optional[float]
    humidity: Optional[float]
    water_quality_ph: Optional[float]
    water_turbidity: Optional[float]
    pathogen_detected: Optional[List[str]]
    pollutant_level: Optional[float]
    pollutant_type: Optional[str]
    air_quality_index: Optional[float]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AlertEventResponse(BaseModel):
    id: int
    alert_id: str
    risk_level: str
    alert_type: str
    description: Optional[str]
    distance_km: Optional[float]
    time_diff_hours: Optional[float]
    recommendation: Optional[str]
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DashboardStats(BaseModel):
    total_human_cases: int
    total_animal_events: int
    total_environmental_samples: int
    active_alerts: int
    high_risk_alerts: int
    critical_alerts: int


class MapDataPoint(BaseModel):
    id: int
    type: str  # human, animal, environmental
    latitude: float
    longitude: float
    location_name: str
    severity: Optional[str] = None
    species: Optional[str] = None
    sample_type: Optional[str] = None
    created_at: datetime
    details: Optional[dict] = None
