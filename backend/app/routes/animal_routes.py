"""
Routes for Animal Data endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from datetime import datetime, timedelta
from typing import List
from app.models.models import AnimalData
from app.schemas.schemas import AnimalDataCreate, AnimalDataResponse
from app.utils.database import get_db
import uuid

router = APIRouter(prefix="/api/animal", tags=["Animal Data"])


@router.post("/reports", response_model=AnimalDataResponse)
def submit_animal_report(
    data: AnimalDataCreate,
    db: Session = Depends(get_db)
):
    """Submit a new animal health event report"""
    try:
        event_id = f"EVENT_A_{uuid.uuid4().hex[:6].upper()}"
        
        db_animal_data = AnimalData(
            event_id=event_id,
            species=data.species,
            species_detail=data.species_detail,
            population_count=data.population_count,
            mortality_count=data.mortality_count,
            morbidity_count=data.morbidity_count,
            location_name=data.location_name,
            latitude=data.latitude,
            longitude=data.longitude,
            clinical_signs=data.clinical_signs,
            reported_by=data.reported_by,
            farm_id=data.farm_id,
            vaccination_status=data.vaccination_status,
            geom=f"POINT({data.longitude} {data.latitude})"
        )
        
        db.add(db_animal_data)
        db.commit()
        db.refresh(db_animal_data)
        
        return db_animal_data
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/events", response_model=List[AnimalDataResponse])
def get_animal_events(
    species: str = Query(None),
    days: int = Query(30),
    min_mortality: int = Query(0),
    db: Session = Depends(get_db)
):
    """
    Get animal health events with optional filters
    
    Query Parameters:
    - species: Filter by species (poultry, swine, cattle, wild_bird)
    - days: Number of days to look back (default: 30)
    - min_mortality: Minimum mortality count to include
    """
    query = db.query(AnimalData)
    
    # Filter by date
    time_threshold = datetime.utcnow() - timedelta(days=days)
    query = query.filter(AnimalData.created_at >= time_threshold)
    
    # Apply optional filters
    if species:
        query = query.filter(AnimalData.species == species)
    
    if min_mortality > 0:
        query = query.filter(AnimalData.mortality_count >= min_mortality)
    
    events = query.order_by(desc(AnimalData.created_at)).all()
    return events


@router.get("/event/{event_id}", response_model=AnimalDataResponse)
def get_animal_event(
    event_id: str,
    db: Session = Depends(get_db)
):
    """Get details of a specific animal health event"""
    event = db.query(AnimalData).filter(AnimalData.event_id == event_id).first()
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return event


@router.get("/stats")
def get_animal_statistics(
    days: int = Query(30),
    db: Session = Depends(get_db)
):
    """Get statistics on animal health events"""
    time_threshold = datetime.utcnow() - timedelta(days=days)
    
    total_events = db.query(func.count(AnimalData.id)).filter(
        AnimalData.created_at >= time_threshold
    ).scalar()
    
    total_mortality = db.query(func.sum(AnimalData.mortality_count)).filter(
        AnimalData.created_at >= time_threshold
    ).scalar() or 0
    
    total_morbidity = db.query(func.sum(AnimalData.morbidity_count)).filter(
        AnimalData.created_at >= time_threshold
    ).scalar() or 0
    
    species_breakdown = db.query(
        AnimalData.species,
        func.count(AnimalData.id).label("events"),
        func.sum(AnimalData.mortality_count).label("total_mortality")
    ).filter(
        AnimalData.created_at >= time_threshold
    ).group_by(AnimalData.species).all()
    
    high_mortality_events = db.query(func.count(AnimalData.id)).filter(
        AnimalData.created_at >= time_threshold,
        AnimalData.mortality_count > 100
    ).scalar()
    
    return {
        "total_events": total_events,
        "total_mortality": total_mortality,
        "total_morbidity": total_morbidity,
        "high_mortality_events": high_mortality_events,
        "species_breakdown": [
            {
                "species": species,
                "events": events,
                "total_mortality": mortality
            }
            for species, events, mortality in species_breakdown
        ]
    }
