"""
Routes for Alert endpoints - Core alert generation and monitoring
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from datetime import datetime, timedelta
from typing import List
from app.models.models import AlertEvent, HumanData, AnimalData, EnvironmentalData, AlertHistory
from app.schemas.schemas import AlertEventResponse, DashboardStats, MapDataPoint
from app.utils.database import get_db
from app.utils.alert_generator import (
    generate_all_alerts,
    check_zoonotic_risk_alert,
    get_risk_level_color,
    get_data_type_color
)

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])


@router.get("/check", response_model=List[AlertEventResponse])
def check_for_alerts(
    db: Session = Depends(get_db)
):
    """
    Main alert checking endpoint.
    Runs logic to detect zoonotic and environmental risks,
    disease clusters, and other patterns.
    
    Returns list of newly generated alerts.
    """
    try:
        # Get recent human cases without corresponding alerts
        time_threshold = datetime.utcnow() - timedelta(hours=48)
        
        recent_cases = db.query(HumanData).filter(
            HumanData.created_at >= time_threshold
        ).all()
        
        all_new_alerts = []
        
        for case in recent_cases:
            # Generate alerts for this case
            alerts = generate_all_alerts(db, case)
            
            for alert in alerts:
                # Check if similar alert already exists
                existing = db.query(AlertEvent).filter(
                    AlertEvent.alert_type == alert.alert_type,
                    AlertEvent.human_case_id == alert.human_case_id,
                    AlertEvent.animal_event_id == alert.animal_event_id,
                    AlertEvent.status == "active"
                ).first()
                
                if not existing:
                    db.add(alert)
                    all_new_alerts.append(alert)
        
        db.commit()
        
        return all_new_alerts
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/active", response_model=List[AlertEventResponse])
def get_active_alerts(
    risk_level: str = Query(None),
    alert_type: str = Query(None),
    db: Session = Depends(get_db)
):
    """
    Get all active alerts with optional filters.
    
    Query Parameters:
    - risk_level: Filter by risk level (low, moderate, high, critical)
    - alert_type: Filter by alert type (disease_cluster, environmental_risk, zoonotic_risk)
    """
    query = db.query(AlertEvent).filter(AlertEvent.status == "active")
    
    if risk_level:
        query = query.filter(AlertEvent.risk_level == risk_level)
    
    if alert_type:
        query = query.filter(AlertEvent.alert_type == alert_type)
    
    alerts = query.order_by(desc(AlertEvent.created_at)).all()
    return alerts


@router.get("/alert/{alert_id}", response_model=AlertEventResponse)
def get_alert_details(
    alert_id: str,
    db: Session = Depends(get_db)
):
    """Get detailed information about a specific alert"""
    alert = db.query(AlertEvent).filter(AlertEvent.alert_id == alert_id).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    return alert


@router.put("/alert/{alert_id}/status")
def update_alert_status(
    alert_id: str,
    new_status: str,
    reason: str = "",
    changed_by: str = "system",
    db: Session = Depends(get_db)
):
    """
    Update alert status (active, resolved, archived)
    
    Body:
    - new_status: Target status (active, resolved, archived)
    - reason: Reason for status change
    - changed_by: User/system making the change
    """
    alert = db.query(AlertEvent).filter(AlertEvent.alert_id == alert_id).first()
    
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    if new_status not in ["active", "resolved", "archived"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    old_status = alert.status
    alert.status = new_status
    alert.updated_at = datetime.utcnow()
    
    # Record history
    history = AlertHistory(
        alert_id=alert.id,
        previous_status=old_status,
        new_status=new_status,
        changed_by=changed_by,
        reason=reason
    )
    
    db.add(history)
    db.commit()
    db.refresh(alert)
    
    return {
        "message": f"Alert {alert_id} status updated to {new_status}",
        "alert": alert
    }


@router.get("/statistics")
def get_alert_statistics(
    days: int = Query(30),
    db: Session = Depends(get_db)
):
    """Get statistical summary of alerts"""
    time_threshold = datetime.utcnow() - timedelta(days=days)
    
    total_alerts = db.query(func.count(AlertEvent.id)).filter(
        AlertEvent.created_at >= time_threshold
    ).scalar()
    
    active_alerts = db.query(func.count(AlertEvent.id)).filter(
        AlertEvent.status == "active"
    ).scalar()
    
    risk_level_breakdown = db.query(
        AlertEvent.risk_level,
        func.count(AlertEvent.id).label("count")
    ).filter(
        AlertEvent.created_at >= time_threshold
    ).group_by(AlertEvent.risk_level).all()
    
    alert_type_breakdown = db.query(
        AlertEvent.alert_type,
        func.count(AlertEvent.id).label("count")
    ).filter(
        AlertEvent.created_at >= time_threshold
    ).group_by(AlertEvent.alert_type).all()
    
    high_risk_count = db.query(func.count(AlertEvent.id)).filter(
        AlertEvent.risk_level.in_(["high", "critical"]),
        AlertEvent.status == "active"
    ).scalar()
    
    return {
        "total_alerts": total_alerts,
        "active_alerts": active_alerts,
        "high_risk_active": high_risk_count,
        "risk_level_breakdown": [
            {"risk_level": level, "count": count}
            for level, count in risk_level_breakdown
        ],
        "alert_type_breakdown": [
            {"alert_type": alert_type, "count": count}
            for alert_type, count in alert_type_breakdown
        ]
    }


@router.get("/dashboard/stats", response_model=DashboardStats)
def get_dashboard_statistics(
    db: Session = Depends(get_db)
):
    """Get statistics for dashboard display"""
    total_human_cases = db.query(func.count(HumanData.id)).scalar()
    total_animal_events = db.query(func.count(AnimalData.id)).scalar()
    total_env_samples = db.query(func.count(EnvironmentalData.id)).scalar()
    active_alerts = db.query(func.count(AlertEvent.id)).filter(
        AlertEvent.status == "active"
    ).scalar()
    high_risk_alerts = db.query(func.count(AlertEvent.id)).filter(
        AlertEvent.risk_level == "high",
        AlertEvent.status == "active"
    ).scalar()
    critical_alerts = db.query(func.count(AlertEvent.id)).filter(
        AlertEvent.risk_level == "critical",
        AlertEvent.status == "active"
    ).scalar()
    
    return DashboardStats(
        total_human_cases=total_human_cases or 0,
        total_animal_events=total_animal_events or 0,
        total_environmental_samples=total_env_samples or 0,
        active_alerts=active_alerts or 0,
        high_risk_alerts=high_risk_alerts or 0,
        critical_alerts=critical_alerts or 0
    )


@router.get("/map/data", response_model=List[MapDataPoint])
def get_map_data(
    include_alerts: bool = Query(True),
    days: int = Query(30),
    db: Session = Depends(get_db)
):
    """
    Get all data points for map visualization
    
    Query Parameters:
    - include_alerts: Whether to include alert locations
    - days: Number of days of data to include
    """
    time_threshold = datetime.utcnow() - timedelta(days=days)
    map_points = []
    
    # Get human cases
    human_cases = db.query(HumanData).filter(
        HumanData.created_at >= time_threshold
    ).all()
    
    for case in human_cases:
        map_points.append(MapDataPoint(
            id=case.id,
            type="human",
            latitude=case.latitude,
            longitude=case.longitude,
            location_name=case.location_name,
            severity=case.severity,
            created_at=case.created_at,
            details={
                "case_id": case.case_id,
                "case_type": case.case_type,
                "symptoms": case.symptoms
            }
        ))
    
    # Get animal events
    animal_events = db.query(AnimalData).filter(
        AnimalData.created_at >= time_threshold
    ).all()
    
    for event in animal_events:
        map_points.append(MapDataPoint(
            id=event.id,
            type="animal",
            latitude=event.latitude,
            longitude=event.longitude,
            location_name=event.location_name,
            species=event.species,
            created_at=event.created_at,
            details={
                "event_id": event.event_id,
                "mortality": event.mortality_count,
                "morbidity": event.morbidity_count
            }
        ))
    
    # Get environmental samples
    env_samples = db.query(EnvironmentalData).filter(
        EnvironmentalData.created_at >= time_threshold
    ).all()
    
    for sample in env_samples:
        map_points.append(MapDataPoint(
            id=sample.id,
            type="environmental",
            latitude=sample.latitude,
            longitude=sample.longitude,
            location_name=sample.location_name,
            sample_type=sample.sample_type,
            created_at=sample.created_at,
            details={
                "sample_id": sample.sample_id,
                "pathogens": sample.pathogen_detected
            }
        ))
    
    # Get alerts if requested
    if include_alerts:
        alerts = db.query(AlertEvent).filter(
            AlertEvent.status == "active",
            AlertEvent.created_at >= time_threshold
        ).all()
        
        for alert in alerts:
            # Use center point of human and animal cases if available
            lat = None
            lon = None
            
            if alert.human_case:
                lat = alert.human_case.latitude
                lon = alert.human_case.longitude
            elif alert.animal_event:
                lat = alert.animal_event.latitude
                lon = alert.animal_event.longitude
            
            if lat and lon:
                map_points.append(MapDataPoint(
                    id=alert.id,
                    type="alert",
                    latitude=lat,
                    longitude=lon,
                    location_name=f"Alert: {alert.alert_type}",
                    severity=alert.risk_level,
                    created_at=alert.created_at,
                    details={
                        "alert_id": alert.alert_id,
                        "risk_level": alert.risk_level,
                        "description": alert.description
                    }
                ))
    
    return map_points
