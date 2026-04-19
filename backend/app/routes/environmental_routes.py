"""
Routes for Environmental Data endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from datetime import datetime, timedelta
from typing import List
from app.models.models import EnvironmentalData
from app.schemas.schemas import EnvironmentalDataCreate, EnvironmentalDataResponse
from app.utils.database import get_db
import uuid

router = APIRouter(prefix="/api/environmental", tags=["Environmental Data"])


@router.post("/reports", response_model=EnvironmentalDataResponse)
def submit_environmental_report(
    data: EnvironmentalDataCreate,
    db: Session = Depends(get_db)
):
    """Submit a new environmental sample/data report"""
    try:
        sample_id = f"SAMPLE_E_{uuid.uuid4().hex[:6].upper()}"
        
        db_env_data = EnvironmentalData(
            sample_id=sample_id,
            sample_type=data.sample_type,
            location_name=data.location_name,
            latitude=data.latitude,
            longitude=data.longitude,
            temperature=data.temperature,
            humidity=data.humidity,
            water_quality_ph=data.water_quality_ph,
            water_turbidity=data.water_turbidity,
            pathogen_detected=data.pathogen_detected,
            pollutant_level=data.pollutant_level,
            pollutant_type=data.pollutant_type,
            air_quality_index=data.air_quality_index,
            notes=data.notes,
            reported_by=data.reported_by,
            geom=f"POINT({data.longitude} {data.latitude})"
        )
        
        db.add(db_env_data)
        db.commit()
        db.refresh(db_env_data)
        
        return db_env_data
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/samples", response_model=List[EnvironmentalDataResponse])
def get_environmental_samples(
    sample_type: str = Query(None),
    days: int = Query(30),
    pathogen: str = Query(None),
    db: Session = Depends(get_db)
):
    """
    Get environmental samples with optional filters
    
    Query Parameters:
    - sample_type: Filter by type (water, air, soil, feed)
    - days: Number of days to look back (default: 30)
    - pathogen: Filter by detected pathogen
    """
    query = db.query(EnvironmentalData)
    
    # Filter by date
    time_threshold = datetime.utcnow() - timedelta(days=days)
    query = query.filter(EnvironmentalData.created_at >= time_threshold)
    
    # Apply optional filters
    if sample_type:
        query = query.filter(EnvironmentalData.sample_type == sample_type)
    
    if pathogen:
        query = query.filter(EnvironmentalData.pathogen_detected.contains([pathogen]))
    
    samples = query.order_by(desc(EnvironmentalData.created_at)).all()
    return samples


@router.get("/sample/{sample_id}", response_model=EnvironmentalDataResponse)
def get_environmental_sample(
    sample_id: str,
    db: Session = Depends(get_db)
):
    """Get details of a specific environmental sample"""
    sample = db.query(EnvironmentalData).filter(EnvironmentalData.sample_id == sample_id).first()
    
    if not sample:
        raise HTTPException(status_code=404, detail="Sample not found")
    
    return sample


@router.get("/stats")
def get_environmental_statistics(
    days: int = Query(30),
    db: Session = Depends(get_db)
):
    """Get statistics on environmental samples"""
    time_threshold = datetime.utcnow() - timedelta(days=days)
    
    total_samples = db.query(func.count(EnvironmentalData.id)).filter(
        EnvironmentalData.created_at >= time_threshold
    ).scalar()
    
    contaminated_samples = db.query(func.count(EnvironmentalData.id)).filter(
        EnvironmentalData.created_at >= time_threshold,
        EnvironmentalData.pathogen_detected.isnot(None)
    ).scalar()
    
    sample_type_breakdown = db.query(
        EnvironmentalData.sample_type,
        func.count(EnvironmentalData.id).label("count"),
        func.sum(func.cast(EnvironmentalData.pathogen_detected.isnot(None), func.Integer)).label("contaminated")
    ).filter(
        EnvironmentalData.created_at >= time_threshold
    ).group_by(EnvironmentalData.sample_type).all()
    
    # Get average air quality and water pH
    avg_stats = db.query(
        func.avg(EnvironmentalData.air_quality_index).label("avg_aqi"),
        func.avg(EnvironmentalData.water_quality_ph).label("avg_ph"),
        func.avg(EnvironmentalData.temperature).label("avg_temp"),
        func.avg(EnvironmentalData.humidity).label("avg_humidity")
    ).filter(
        EnvironmentalData.created_at >= time_threshold
    ).first()
    
    return {
        "total_samples": total_samples,
        "contaminated_samples": contaminated_samples,
        "avg_air_quality_index": round(avg_stats.avg_aqi, 2) if avg_stats.avg_aqi else None,
        "avg_water_ph": round(avg_stats.avg_ph, 2) if avg_stats.avg_ph else None,
        "avg_temperature": round(avg_stats.avg_temp, 2) if avg_stats.avg_temp else None,
        "avg_humidity": round(avg_stats.avg_humidity, 2) if avg_stats.avg_humidity else None,
        "sample_type_breakdown": [
            {
                "sample_type": sample_type,
                "total_samples": count,
                "contaminated": contaminated or 0
            }
            for sample_type, count, contaminated in sample_type_breakdown
        ]
    }
