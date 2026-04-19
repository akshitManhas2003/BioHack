"""
Database models for One Health Surveillance System using SQLAlchemy and GeoAlchemy2
"""
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Float, 
    ForeignKey, Text, Index, create_engine, func, JSON
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()


class User(Base):
    """User model for authentication and authorization"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=True)
    full_name = Column(String(255))
    role = Column(String(50), default="field_worker")  # field_worker, analyst, admin
    organization = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)

    human_reports = relationship("HumanData", back_populates="reporter")
    animal_reports = relationship("AnimalData", back_populates="reporter")
    env_reports = relationship("EnvironmentalData", back_populates="reporter")


class HumanData(Base):
    """Model for human disease cases"""
    __tablename__ = "human_data"

    id = Column(Integer, primary_key=True)
    case_id = Column(String(50), unique=True, nullable=False)
    patient_name = Column(String(255))
    age = Column(Integer)
    gender = Column(String(10))
    symptoms = Column(JSON, default=list)
    case_type = Column(String(50), nullable=False)  # respiratory, gastrointestinal, other
    severity = Column(String(20), nullable=False)   # mild, moderate, severe, critical
    location_name = Column(String(255))
    latitude = Column(Float)
    longitude = Column(Float)
    contact_count = Column(Integer, default=0)
    hospitalized = Column(Boolean, default=False)
    outcome = Column(String(20))  # recovered, deceased, ongoing
    reported_by = Column(String(255), ForeignKey("users.username"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    reporter = relationship("User", back_populates="human_reports")
    alerts = relationship("AlertEvent", back_populates="human_case")

    __table_args__ = (
        Index("idx_human_date", created_at),
        Index("idx_human_type", case_type),
        Index("idx_human_severity", severity),
    )


class AnimalData(Base):
    """Model for animal health events"""
    __tablename__ = "animal_data"

    id = Column(Integer, primary_key=True)
    event_id = Column(String(50), unique=True, nullable=False)
    species = Column(String(100), nullable=False)  # poultry, swine, cattle, wild_bird
    species_detail = Column(String(255))
    population_count = Column(Integer)
    mortality_count = Column(Integer)
    morbidity_count = Column(Integer)
    location_name = Column(String(255))
    latitude = Column(Float)
    longitude = Column(Float)
    clinical_signs = Column(JSON, default=list)
    reported_by = Column(String(255), ForeignKey("users.username"))
    farm_id = Column(String(100))
    vaccination_status = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    reporter = relationship("User", back_populates="animal_reports")
    alerts = relationship("AlertEvent", back_populates="animal_event")

    __table_args__ = (
        Index("idx_animal_date", created_at),
        Index("idx_animal_species", species),
        Index("idx_animal_mortality", mortality_count),
    )


class EnvironmentalData(Base):
    """Model for environmental samples and conditions"""
    __tablename__ = "environmental_data"

    id = Column(Integer, primary_key=True)
    sample_id = Column(String(50), unique=True, nullable=False)
    sample_type = Column(String(100), nullable=False)  # water, air, soil, feed
    location_name = Column(String(255))
    latitude = Column(Float)
    longitude = Column(Float)
    temperature = Column(Float)
    humidity = Column(Float)
    water_quality_ph = Column(Float)
    water_turbidity = Column(Float)
    pathogen_detected = Column(JSON, default=list)
    pollutant_level = Column(Float)
    pollutant_type = Column(String(100))
    air_quality_index = Column(Float)
    notes = Column(Text)
    reported_by = Column(String(255), ForeignKey("users.username"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    reporter = relationship("User", back_populates="env_reports")
    alerts = relationship("AlertEvent", back_populates="environmental_sample")

    __table_args__ = (
        Index("idx_env_date", created_at),
        Index("idx_env_type", sample_type),
    )


class AlertEvent(Base):
    """Model for alert events generated from data analysis"""
    __tablename__ = "alert_events"

    id = Column(Integer, primary_key=True)
    alert_id = Column(String(50), unique=True, nullable=False)
    risk_level = Column(String(20), nullable=False)  # low, moderate, high, critical
    alert_type = Column(String(100), nullable=False)  # disease_cluster, environmental_risk, zoonotic_risk
    human_case_id = Column(Integer, ForeignKey("human_data.id"))
    animal_event_id = Column(Integer, ForeignKey("animal_data.id"))
    environmental_sample_id = Column(Integer, ForeignKey("environmental_data.id"))
    description = Column(Text)
    distance_km = Column(Float)
    time_diff_hours = Column(Float)
    recommendation = Column(Text)
    status = Column(String(50), default="active")  # active, resolved, archived
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    human_case = relationship("HumanData", back_populates="alerts")
    animal_event = relationship("AnimalData", back_populates="alerts")
    environmental_sample = relationship("EnvironmentalData", back_populates="alerts")
    history = relationship("AlertHistory", back_populates="alert")

    __table_args__ = (
        Index("idx_alert_level", risk_level),
        Index("idx_alert_status", status),
        Index("idx_alert_date", created_at),
    )


class AlertHistory(Base):
    """Model for tracking alert status changes"""
    __tablename__ = "alert_history"

    id = Column(Integer, primary_key=True)
    alert_id = Column(Integer, ForeignKey("alert_events.id"))
    previous_status = Column(String(50))
    new_status = Column(String(50))
    changed_by = Column(String(255))
    reason = Column(Text)
    changed_at = Column(DateTime, default=datetime.utcnow)

    alert = relationship("AlertEvent", back_populates="history")

    __table_args__ = (
        Index("idx_alert_history_date", changed_at),
    )
