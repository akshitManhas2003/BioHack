"""
Utility functions for alert generation and risk analysis
"""
from datetime import datetime, timedelta
from math import radians, cos, sin, asin, sqrt
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from app.models.models import HumanData, AnimalData, EnvironmentalData, AlertEvent
import uuid


def haversine(lon1: float, lat1: float, lon2: float, lat2: float) -> float:
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees).
    Returns distance in kilometers.
    """
    # Convert decimal degrees to radians
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * asin(sqrt(a))
    r = 6371  # Radius of earth in kilometers
    return c * r


def check_zoonotic_risk_alert(db: Session, human_case: HumanData) -> AlertEvent:
    """
    Check for zoonotic risk: Human respiratory case + Animal mortality event
    within 10km and 48 hours window.
    """
    alert = None
    
    # Look for poultry deaths within 48 hours
    time_threshold = human_case.created_at - timedelta(hours=48)
    
    potential_animal_events = db.query(AnimalData).filter(
        and_(
            AnimalData.species.in_(['poultry', 'waterfowl', 'wild_bird']),
            AnimalData.created_at >= time_threshold,
            AnimalData.created_at <= human_case.created_at + timedelta(hours=48),
            AnimalData.mortality_count > 0
        )
    ).all()
    
    for animal_event in potential_animal_events:
        # Calculate distance
        distance_km = haversine(
            human_case.longitude, human_case.latitude,
            animal_event.longitude, animal_event.latitude
        )
        
        if distance_km <= 10:  # Within 10km
            # Calculate time difference
            time_diff = abs((animal_event.created_at - human_case.created_at).total_seconds() / 3600)
            
            if time_diff <= 48:  # Within 48 hours
                # Create alert
                alert = AlertEvent(
                    alert_id=f"ALERT_{uuid.uuid4().hex[:8].upper()}",
                    risk_level="high",
                    alert_type="zoonotic_risk",
                    human_case_id=human_case.id,
                    animal_event_id=animal_event.id,
                    description=(
                        f"High risk: Respiratory case ({human_case.case_type}) in {human_case.location_name} "
                        f"within {distance_km:.2f}km of {animal_event.species} mortality event "
                        f"({animal_event.mortality_count} deaths) in {animal_event.location_name}"
                    ),
                    distance_km=distance_km,
                    time_diff_hours=time_diff,
                    recommendation=(
                        "Immediate investigation required. Coordinate with veterinary and environmental teams. "
                        "Recommend specimen collection and pathogen screening for both human and animal cases."
                    ),
                    status="active"
                )
                break
    
    return alert


def check_environmental_risk_alert(db: Session, human_case: HumanData) -> AlertEvent:
    """
    Check for environmental risk: Human case near environmental contamination.
    """
    alert = None
    
    # Look for environmental samples with pathogens within 5km and recent date
    time_threshold = human_case.created_at - timedelta(days=3)
    
    potential_env_samples = db.query(EnvironmentalData).filter(
        and_(
            EnvironmentalData.pathogen_detected.isnot(None),
            EnvironmentalData.created_at >= time_threshold,
        )
    ).all()
    
    for env_sample in potential_env_samples:
        distance_km = haversine(
            human_case.longitude, human_case.latitude,
            env_sample.longitude, env_sample.latitude
        )
        
        if distance_km <= 5:  # Within 5km
            alert = AlertEvent(
                alert_id=f"ALERT_{uuid.uuid4().hex[:8].upper()}",
                risk_level="moderate",
                alert_type="environmental_risk",
                human_case_id=human_case.id,
                environmental_sample_id=env_sample.id,
                description=(
                    f"Environmental risk: {human_case.case_type} case near contaminated {env_sample.sample_type}. "
                    f"Pathogens detected: {', '.join(env_sample.pathogen_detected)}"
                ),
                distance_km=distance_km,
                recommendation=(
                    "Investigate potential exposure route. Recommend public health measures for contaminated sources."
                ),
                status="active"
            )
            break
    
    return alert


def check_disease_cluster_alert(db: Session) -> list:
    """
    Check for disease clusters: Multiple cases within 2km within 7 days.
    """
    alerts = []
    
    # Find clusters of human cases
    time_threshold = datetime.utcnow() - timedelta(days=7)
    
    cases = db.query(HumanData).filter(
        HumanData.created_at >= time_threshold
    ).all()
    
    cluster_radius_km = 2
    min_cases_in_cluster = 3
    
    processed_cases = set()
    
    for case in cases:
        if case.id in processed_cases:
            continue
        
        # Find nearby cases
        nearby_cases = []
        for other_case in cases:
            if other_case.id == case.id or other_case.id in processed_cases:
                continue
            
            distance = haversine(
                case.longitude, case.latitude,
                other_case.longitude, other_case.latitude
            )
            
            if distance <= cluster_radius_km:
                nearby_cases.append(other_case)
        
        # If cluster found
        if len(nearby_cases) >= (min_cases_in_cluster - 1):
            cluster_cases = [case] + nearby_cases
            
            alert = AlertEvent(
                alert_id=f"ALERT_{uuid.uuid4().hex[:8].upper()}",
                risk_level="high" if len(cluster_cases) >= 5 else "moderate",
                alert_type="disease_cluster",
                human_case_id=case.id,
                description=(
                    f"Disease cluster detected: {len(cluster_cases)} cases of {case.case_type} "
                    f"within {cluster_radius_km}km in area of {case.location_name}"
                ),
                recommendation=(
                    "Activate disease cluster investigation protocol. "
                    "Increase surveillance and implement outbreak control measures."
                ),
                status="active"
            )
            
            alerts.append(alert)
            
            # Mark all cluster cases as processed
            for cluster_case in cluster_cases:
                processed_cases.add(cluster_case.id)
    
    return alerts


def generate_all_alerts(db: Session, human_case: HumanData = None) -> list:
    """
    Generate all relevant alerts based on new data or periodic check.
    """
    new_alerts = []
    
    if human_case:
        # Check zoonotic risk
        zoonotic_alert = check_zoonotic_risk_alert(db, human_case)
        if zoonotic_alert:
            new_alerts.append(zoonotic_alert)
        
        # Check environmental risk
        env_alert = check_environmental_risk_alert(db, human_case)
        if env_alert:
            new_alerts.append(env_alert)
    
    # Check disease clusters
    cluster_alerts = check_disease_cluster_alert(db)
    new_alerts.extend(cluster_alerts)
    
    return new_alerts


def get_risk_level_color(risk_level: str) -> str:
    """Map risk level to color for frontend visualization"""
    color_map = {
        "critical": "#8B0000",  # Dark Red
        "high": "#FF0000",       # Red
        "moderate": "#FFA500",   # Orange
        "low": "#FFFF00"         # Yellow
    }
    return color_map.get(risk_level, "#808080")  # Gray for unknown


def get_data_type_color(data_type: str) -> str:
    """Map data type to color for frontend visualization"""
    color_map = {
        "human": "#FF0000",           # Red
        "animal": "#FFD700",          # Gold/Yellow
        "environmental": "#00AA00",   # Green
        "alert": "#8B0000"            # Dark Red
    }
    return color_map.get(data_type, "#808080")
