"""
Routes for Human Data endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, desc, func
from datetime import datetime, timedelta
from typing import List
from app.models.models import HumanData
from app.schemas.schemas import HumanDataCreate, HumanDataResponse
from app.utils.database import get_db
from app.utils.alert_generator import generate_all_alerts
import uuid

router = APIRouter(prefix="/api/human", tags=["Human Data"])


@router.post("/reports", response_model=HumanDataResponse)
def submit_human_report(
    data: HumanDataCreate,
    db: Session = Depends(get_db)
):
    """Submit a new human disease case report"""
    try:
        # Create new case
        case_id = f"CASE_H_{uuid.uuid4().hex[:6].upper()}"
        
        db_human_data = HumanData(
            case_id=case_id,
            patient_name=data.patient_name,
            age=data.age,
            gender=data.gender,
            symptoms=data.symptoms,
            case_type=data.case_type,
            severity=data.severity,
            location_name=data.location_name,
            latitude=data.latitude,
            longitude=data.longitude,
            contact_count=data.contact_count,
            hospitalized=data.hospitalized,
            reported_by=data.reported_by,
            geom=f"POINT({data.longitude} {data.latitude})"
        )
        
        db.add(db_human_data)
        db.flush()  # Flush to get the id
        
        # Generate alerts
        alerts = generate_all_alerts(db, db_human_data)
        for alert in alerts:
            db.add(alert)
        
        db.commit()
        db.refresh(db_human_data)
        
        return db_human_data
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/cases", response_model=List[HumanDataResponse])
def get_human_cases(
    case_type: str = Query(None),
    severity: str = Query(None),
    days: int = Query(30),
    db: Session = Depends(get_db)
):
    """
    Get human cases with optional filters
    
    Query Parameters:
    - case_type: Filter by case type (respiratory, gastrointestinal, other)
    - severity: Filter by severity (mild, moderate, severe, critical)
    - days: Number of days to look back (default: 30)
    """
    query = db.query(HumanData)
    
    # Filter by date
    time_threshold = datetime.utcnow() - timedelta(days=days)
    query = query.filter(HumanData.created_at >= time_threshold)
    
    # Apply optional filters
    if case_type:
        query = query.filter(HumanData.case_type == case_type)
    
    if severity:
        query = query.filter(HumanData.severity == severity)
    
    cases = query.order_by(desc(HumanData.created_at)).all()
    return cases


@router.get("/case/{case_id}", response_model=HumanDataResponse)
def get_human_case(
    case_id: str,
    db: Session = Depends(get_db)
):
    """Get details of a specific human case"""
    case = db.query(HumanData).filter(HumanData.case_id == case_id).first()
    
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    return case


@router.get("/stats")
def get_human_statistics(
    days: int = Query(30),
    db: Session = Depends(get_db)
):
    """Get statistics on human cases"""
    time_threshold = datetime.utcnow() - timedelta(days=days)
    
    total_cases = db.query(func.count(HumanData.id)).filter(
        HumanData.created_at >= time_threshold
    ).scalar()
    
    severity_breakdown = db.query(
        HumanData.severity,
        func.count(HumanData.id).label("count")
    ).filter(
        HumanData.created_at >= time_threshold
    ).group_by(HumanData.severity).all()
    
    case_type_breakdown = db.query(
        HumanData.case_type,
        func.count(HumanData.id).label("count")
    ).filter(
        HumanData.created_at >= time_threshold
    ).group_by(HumanData.case_type).all()
    
    hospitalized_count = db.query(func.count(HumanData.id)).filter(
        and_(
            HumanData.created_at >= time_threshold,
            HumanData.hospitalized == True
        )
    ).scalar()
    
    return {
        "total_cases": total_cases,
        "hospitalized": hospitalized_count,
        "severity_breakdown": [
            {"severity": sev, "count": count} for sev, count in severity_breakdown
        ],
        "case_type_breakdown": [
            {"case_type": case_type, "count": count} for case_type, count in case_type_breakdown
        ]
    }
