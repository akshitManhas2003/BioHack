"""
Enhanced Statistics Routes with Advanced Analytics
Real data aggregation and trend analysis for the One Health Surveillance System
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import datetime, timedelta
from typing import List, Dict, Any
from app.models.models import HumanData, AnimalData, EnvironmentalData, AlertEvent
from app.utils.database import get_db
from app.utils.error_handler import NotFoundError, DatabaseError

router = APIRouter(prefix="/api/statistics", tags=["Statistics"])


@router.get("/human/trends")
def get_human_trends(
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Get human case trends over time"""
    try:
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Get daily case counts
        daily_cases = db.query(
            func.date(HumanData.created_at).label('date'),
            func.count(HumanData.id).label('count'),
            HumanData.severity.label('severity')
        ).filter(
            HumanData.created_at >= start_date
        ).group_by(
            func.date(HumanData.created_at),
            HumanData.severity
        ).all()

        # Get case type distribution
        case_types = db.query(
            HumanData.case_type,
            func.count(HumanData.id).label('count'),
            func.avg(HumanData.age).label('avg_age')
        ).filter(
            HumanData.created_at >= start_date
        ).group_by(
            HumanData.case_type
        ).all()

        # Get age statistics
        age_stats = db.query(
            func.avg(HumanData.age).label('avg_age'),
            func.min(HumanData.age).label('min_age'),
            func.max(HumanData.age).label('max_age')
        ).filter(
            HumanData.created_at >= start_date
        ).first()

        # Get hospitalization stats
        hosp_stats = db.query(
            func.count(HumanData.id).label('total'),
            func.sum(HumanData.hospitalized).label('hospitalized')
        ).filter(
            HumanData.created_at >= start_date
        ).first()

        return {
            "period_days": days,
            "daily_trends": [
                {
                    "date": str(item.date),
                    "count": item.count,
                    "severity": item.severity
                }
                for item in daily_cases
            ],
            "case_types": [
                {
                    "name": item.case_type or "Unknown",
                    "count": item.count,
                    "avg_age": round(item.avg_age, 1) if item.avg_age else 0
                }
                for item in case_types
            ],
            "age_statistics": {
                "average": round(age_stats.avg_age, 1) if age_stats.avg_age else 0,
                "minimum": age_stats.min_age or 0,
                "maximum": age_stats.max_age or 0
            },
            "hospitalization": {
                "total_cases": hosp_stats.total or 0,
                "hospitalized_count": hosp_stats.hospitalized or 0,
                "hospitalization_rate": round((hosp_stats.hospitalized or 0) / (hosp_stats.total or 1) * 100, 2)
            }
        }
    except Exception as e:
        raise DatabaseError(f"Failed to fetch human trends: {str(e)}", operation="get_human_trends")


@router.get("/animal/trends")
def get_animal_trends(
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Get animal event trends and statistics"""
    try:
        start_date = datetime.utcnow() - timedelta(days=days)

        # Get daily event counts
        daily_events = db.query(
            func.date(AnimalData.created_at).label('date'),
            func.count(AnimalData.id).label('count'),
            func.sum(AnimalData.mortality_count).label('total_mortality'),
            func.sum(AnimalData.morbidity_count).label('total_morbidity')
        ).filter(
            AnimalData.created_at >= start_date
        ).group_by(
            func.date(AnimalData.created_at)
        ).all()

        # Get species breakdown
        species_data = db.query(
            AnimalData.species,
            func.count(AnimalData.id).label('events'),
            func.sum(AnimalData.mortality_count).label('total_mortality'),
            func.sum(AnimalData.population_count).label('total_population'),
            func.avg(AnimalData.population_count).label('avg_population')
        ).filter(
            AnimalData.created_at >= start_date
        ).group_by(
            AnimalData.species
        ).all()

        # Get mortality statistics
        mortality_stats = db.query(
            func.sum(AnimalData.mortality_count).label('total_mortality'),
            func.sum(AnimalData.morbidity_count).label('total_morbidity'),
            func.sum(AnimalData.population_count).label('total_population')
        ).filter(
            AnimalData.created_at >= start_date
        ).first()

        # Get vaccination status breakdown
        vacc_status = db.query(
            AnimalData.vaccination_status,
            func.count(AnimalData.id).label('count')
        ).filter(
            AnimalData.created_at >= start_date
        ).group_by(
            AnimalData.vaccination_status
        ).all()

        return {
            "period_days": days,
            "daily_trends": [
                {
                    "date": str(item.date),
                    "events": item.count,
                    "mortality": item.total_mortality or 0,
                    "morbidity": item.total_morbidity or 0
                }
                for item in daily_events
            ],
            "species_breakdown": [
                {
                    "species": item.species or "Unknown",
                    "events": item.events,
                    "total_mortality": item.total_mortality or 0,
                    "total_population": item.total_population or 0,
                    "avg_population": round(item.avg_population, 0) if item.avg_population else 0,
                    "mortality_rate": round((item.total_mortality or 0) / (item.total_population or 1) * 100, 2)
                }
                for item in species_data
            ],
            "overall_mortality": {
                "total_mortality": mortality_stats.total_mortality or 0,
                "total_morbidity": mortality_stats.total_morbidity or 0,
                "total_population_affected": mortality_stats.total_population or 0
            },
            "vaccination_status": [
                {
                    "status": item.vaccination_status or "Unknown",
                    "count": item.count
                }
                for item in vacc_status
            ]
        }
    except Exception as e:
        raise DatabaseError(f"Failed to fetch animal trends: {str(e)}", operation="get_animal_trends")


@router.get("/alerts/trends")
def get_alert_trends(
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Get alert trends and risk patterns"""
    try:
        start_date = datetime.utcnow() - timedelta(days=days)

        # Daily alert counts by risk level
        daily_alerts = db.query(
            func.date(AlertEvent.created_at).label('date'),
            AlertEvent.risk_level,
            func.count(AlertEvent.id).label('count')
        ).filter(
            AlertEvent.created_at >= start_date
        ).group_by(
            func.date(AlertEvent.created_at),
            AlertEvent.risk_level
        ).all()

        # Alert type distribution
        alert_types = db.query(
            AlertEvent.alert_type,
            func.count(AlertEvent.id).label('count'),
            AlertEvent.risk_level.label('risk_level')
        ).filter(
            AlertEvent.created_at >= start_date
        ).group_by(
            AlertEvent.alert_type,
            AlertEvent.risk_level
        ).all()

        # Alert status distribution
        statuses = db.query(
            AlertEvent.status,
            func.count(AlertEvent.id).label('count')
        ).group_by(
            AlertEvent.status
        ).all()

        # Risk level summary
        risk_summary = db.query(
            AlertEvent.risk_level,
            func.count(AlertEvent.id).label('count'),
            func.avg(AlertEvent.created_at)
        ).group_by(
            AlertEvent.risk_level
        ).all()

        return {
            "period_days": days,
            "daily_trends": [
                {
                    "date": str(item.date),
                    "risk_level": item.risk_level,
                    "count": item.count
                }
                for item in daily_alerts
            ],
            "alert_types": [
                {
                    "type": item.alert_type,
                    "count": item.count,
                    "risk_level": item.risk_level
                }
                for item in alert_types
            ],
            "status_distribution": [
                {
                    "status": item.status,
                    "count": item.count
                }
                for item in statuses
            ],
            "risk_summary": [
                {
                    "risk_level": item.risk_level,
                    "count": item.count
                }
                for item in risk_summary
            ]
        }
    except Exception as e:
        raise DatabaseError(f"Failed to fetch alert trends: {str(e)}", operation="get_alert_trends")


@router.get("/environmental/trends")
def get_environmental_trends(
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Get environmental data trends"""
    try:
        start_date = datetime.utcnow() - timedelta(days=days)

        # Sample collection trends
        daily_samples = db.query(
            func.date(EnvironmentalData.created_at).label('date'),
            func.count(EnvironmentalData.id).label('count'),
            EnvironmentalData.sample_type.label('sample_type')
        ).filter(
            EnvironmentalData.created_at >= start_date
        ).group_by(
            func.date(EnvironmentalData.created_at),
            EnvironmentalData.sample_type
        ).all()

        # Sample type distribution
        sample_types = db.query(
            EnvironmentalData.sample_type,
            func.count(EnvironmentalData.id).label('count'),
            func.sum(EnvironmentalData.pathogen_detected).label('positive_count')
        ).filter(
            EnvironmentalData.created_at >= start_date
        ).group_by(
            EnvironmentalData.sample_type
        ).all()

        # Pathogen detection statistics
        pathogen_stats = db.query(
            func.count(EnvironmentalData.id).label('total_samples'),
            func.sum(EnvironmentalData.pathogen_detected).label('positive_samples')
        ).filter(
            EnvironmentalData.created_at >= start_date
        ).first()

        return {
            "period_days": days,
            "daily_trends": [
                {
                    "date": str(item.date),
                    "count": item.count,
                    "sample_type": item.sample_type
                }
                for item in daily_samples
            ],
            "sample_types": [
                {
                    "type": item.sample_type or "Unknown",
                    "total_samples": item.count,
                    "positive_samples": item.positive_count or 0,
                    "detection_rate": round((item.positive_count or 0) / item.count * 100, 2) if item.count > 0 else 0
                }
                for item in sample_types
            ],
            "overall_statistics": {
                "total_samples": pathogen_stats.total_samples or 0,
                "positive_samples": pathogen_stats.positive_samples or 0,
                "detection_rate": round((pathogen_stats.positive_samples or 0) / (pathogen_stats.total_samples or 1) * 100, 2)
            }
        }
    except Exception as e:
        raise DatabaseError(f"Failed to fetch environmental trends: {str(e)}", operation="get_environmental_trends")


@router.get("/summary")
def get_comprehensive_summary(
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Get comprehensive system statistics summary"""
    try:
        start_date = datetime.utcnow() - timedelta(days=days)

        # Count all data types
        human_count = db.query(func.count(HumanData.id)).filter(
            HumanData.created_at >= start_date
        ).scalar() or 0

        animal_count = db.query(func.count(AnimalData.id)).filter(
            AnimalData.created_at >= start_date
        ).scalar() or 0

        environmental_count = db.query(func.count(EnvironmentalData.id)).filter(
            EnvironmentalData.created_at >= start_date
        ).scalar() or 0

        alert_count = db.query(func.count(AlertEvent.id)).filter(
            AlertEvent.created_at >= start_date
        ).scalar() or 0

        critical_alerts = db.query(func.count(AlertEvent.id)).filter(
            and_(
                AlertEvent.created_at >= start_date,
                AlertEvent.risk_level == "critical"
            )
        ).scalar() or 0

        return {
            "summary_period_days": days,
            "total_human_cases": human_count,
            "total_animal_events": animal_count,
            "total_environmental_samples": environmental_count,
            "total_alerts": alert_count,
            "critical_alerts": critical_alerts,
            "data_coverage": {
                "human_data": "Complete" if human_count > 0 else "No data",
                "animal_data": "Complete" if animal_count > 0 else "No data",
                "environmental_data": "Complete" if environmental_count > 0 else "No data",
                "alerts_active": "Yes" if alert_count > 0 else "No"
            },
            "last_updated": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise DatabaseError(f"Failed to fetch summary: {str(e)}", operation="get_comprehensive_summary")
