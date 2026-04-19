"""
Seed database with sample data for One Health Surveillance System.
Demonstrates all use cases and system functionality.

Run: python seed_data.py
"""

from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.models import (
    Base, User, HumanData, AnimalData, EnvironmentalData, 
    AlertEvent, AlertHistory
)

# Database setup
DATABASE_URL = "sqlite:///./one_health_surveillance.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed_database():
    """Populate database with realistic sample data."""
    
    db = SessionLocal()
    
    try:
        # Clear existing data
        db.query(AlertHistory).delete()
        db.query(AlertEvent).delete()
        db.query(EnvironmentalData).delete()
        db.query(AnimalData).delete()
        db.query(HumanData).delete()
        db.query(User).delete()
        db.commit()
        print("✓ Cleared existing data")
        
        # Create users
        users = [
            User(username="doctor_ali", email="ali@health.gov", role="health_worker", full_name="Dr. Ali Hassan"),
            User(username="vet_fatima", email="fatima@livestock.gov", role="veterinarian", full_name="Dr. Fatima Omar"),
            User(username="env_ahmed", email="ahmed@environment.gov", role="environmental_monitor", full_name="Ahmed Ibrahim"),
            User(username="admin_sara", email="sara@surveillance.gov", role="admin", full_name="Sara Ahmed"),
        ]
        db.add_all(users)
        db.commit()
        print("✓ Created 4 users")
        
        # ============================================================
        # SCENARIO 1: Respiratory Outbreak in Poultry Farm Area
        # ============================================================
        print("\n📍 SCENARIO 1: Respiratory Outbreak Detection")
        print("   Location: Nairobi, Kenya (coordinates: -1.2921, 36.8219)")
        
        # Human cases with respiratory symptoms (within 48 hours)
        base_time = datetime.now() - timedelta(days=2)
        human_cases_respiratory = [
            HumanData(
                case_id="HUMAN_001",
                patient_name="John Kipchoge",
                age=45,
                gender="M",
                case_type="Respiratory",
                symptoms=["cough", "fever", "shortness_of_breath", "headache"],
                severity="High",
                hospitalized=True,
                contact_count=12,
                outcome="Recovering",
                location_name="Nairobi, Eastlands",
                latitude=-1.2921,
                longitude=36.8219,
                reported_by=users[0].username,
                created_at=base_time
            ),
            HumanData(
                case_id="HUMAN_002",
                patient_name="Mary Wanjiru",
                age=38,
                gender="F",
                case_type="Respiratory",
                symptoms=["cough", "fever", "chills"],
                severity="Moderate",
                hospitalized=False,
                contact_count=8,
                outcome="Stable",
                location_name="Nairobi, Eastlands",
                latitude=-1.2920,
                longitude=36.8220,
                reported_by=users[0].username,
                created_at=base_time + timedelta(hours=4)
            ),
            HumanData(
                case_id="HUMAN_003",
                patient_name="Peter Ochieng",
                age=52,
                gender="M",
                case_type="Respiratory",
                symptoms=["cough", "sore_throat", "fatigue"],
                severity="Moderate",
                hospitalized=False,
                contact_count=6,
                outcome="Stable",
                location_name="Nairobi, Eastlands",
                latitude=-1.2922,
                longitude=36.8218,
                reported_by=users[0].username,
                created_at=base_time + timedelta(hours=12)
            ),
        ]
        db.add_all(human_cases_respiratory)
        db.commit()
        print("   ✓ Added 3 human respiratory cases")
        
        # Poultry deaths within 10km and 48 hours
        animal_events_poultry = [
            AnimalData(
                event_id="ANIMAL_001",
                species="Chicken",
                population_count=500,
                mortality_count=45,
                morbidity_count=120,
                clinical_signs=["respiratory_distress", "dropped_egg_production", "lethargy"],
                location_name="Nairobi, Poultry Farm",
                latitude=-1.2915,
                longitude=36.8225,
                farm_id="FARM_001",
                vaccination_status="Partially Vaccinated",
                reported_by=users[1].username,
                created_at=base_time + timedelta(hours=6)
            ),
            AnimalData(
                event_id="ANIMAL_002",
                species="Turkey",
                population_count=200,
                mortality_count=18,
                morbidity_count=55,
                clinical_signs=["coughing", "nasal_discharge", "reduced_appetite"],
                location_name="Nairobi, Mixed Farm",
                latitude=-1.2918,
                longitude=36.8220,
                farm_id="FARM_002",
                vaccination_status="Not Vaccinated",
                reported_by=users[1].username,
                created_at=base_time + timedelta(hours=8)
            ),
        ]
        db.add_all(animal_events_poultry)
        db.commit()
        print("   ✓ Added 2 poultry mortality events")
        
        # Environmental samples from contaminated water
        env_samples_water = [
            EnvironmentalData(
                sample_id="ENV_001",
                sample_type="Water",
                location_name="Nairobi, Market Water Source",
                latitude=-1.2925,
                longitude=36.8215,
                water_quality_ph=6.8,
                water_turbidity=8.5,
                temperature=22,
                pathogen_detected=["H5N1", "Influenza A"],
                pollutant_level=8.5,
                pollutant_type="Biological",
                notes="Water source near poultry market showing high contamination",
                reported_by=users[2].username,
                created_at=base_time + timedelta(hours=10)
            ),
        ]
        db.add_all(env_samples_water)
        db.commit()
        print("   ✓ Added 1 environmental water sample with pathogens")
        
        # ============================================================
        # SCENARIO 2: Gastrointestinal Cluster
        # ============================================================
        print("\n📍 SCENARIO 2: Foodborne Disease Cluster")
        print("   Location: Kampala, Uganda (coordinates: 0.3476, 32.5825)")
        
        base_time2 = datetime.now() - timedelta(days=1)
        
        # GI cases clustered in small area
        gi_cases = [
            HumanData(
                case_id="HUMAN_004",
                patient_name="Grace Nakamatte",
                age=28,
                gender="F",
                case_type="Gastrointestinal",
                symptoms=["diarrhea", "vomiting", "abdominal_pain", "dehydration"],
                severity="High",
                hospitalized=True,
                contact_count=5,
                outcome="Recovering",
                location_name="Kampala, Downtown",
                latitude=0.3476,
                longitude=32.5825,
                reported_by=users[0].username,
                created_at=base_time2
            ),
            HumanData(
                case_id="HUMAN_005",
                patient_name="Robert Lubega",
                age=34,
                gender="M",
                case_type="Gastrointestinal",
                symptoms=["diarrhea", "abdominal_pain", "fever"],
                severity="Moderate",
                hospitalized=False,
                contact_count=3,
                outcome="Stable",
                location_name="Kampala, Downtown",
                latitude=0.3477,
                longitude=32.5824,
                reported_by=users[0].username,
                created_at=base_time2 + timedelta(hours=6)
            ),
            HumanData(
                case_id="HUMAN_006",
                patient_name="Amina Hassan",
                age=41,
                gender="F",
                case_type="Gastrointestinal",
                symptoms=["vomiting", "diarrhea", "muscle_aches"],
                severity="Moderate",
                hospitalized=False,
                contact_count=4,
                outcome="Stable",
                location_name="Kampala, Downtown",
                latitude=0.3475,
                longitude=32.5826,
                reported_by=users[0].username,
                created_at=base_time2 + timedelta(hours=12)
            ),
        ]
        db.add_all(gi_cases)
        db.commit()
        print("   ✓ Added 3 gastrointestinal cases (cluster)")
        
        # Animal events - livestock illness
        livestock_events = [
            AnimalData(
                event_id="ANIMAL_003",
                species="Cattle",
                population_count=150,
                mortality_count=5,
                morbidity_count=28,
                clinical_signs=["diarrhea", "reduced_milk_production"],
                location_name="Kampala, Dairy Farm",
                latitude=0.3480,
                longitude=32.5820,
                farm_id="FARM_003",
                vaccination_status="Fully Vaccinated",
                reported_by=users[1].username,
                created_at=base_time2 + timedelta(hours=8)
            ),
        ]
        db.add_all(livestock_events)
        db.commit()
        print("   ✓ Added 1 livestock GI event")
        
        # Environmental food contamination
        env_food = [
            EnvironmentalData(
                sample_id="ENV_002",
                sample_type="Food",
                location_name="Kampala, Market Produce",
                latitude=0.3478,
                longitude=32.5825,
                temperature=28,
                humidity=75,
                pathogen_detected=["Salmonella", "E.coli O157:H7"],
                pollutant_level=7.8,
                pollutant_type="Biological",
                notes="Vegetables from local market testing positive for pathogens",
                reported_by=users[2].username,
                created_at=base_time2 + timedelta(hours=10)
            ),
        ]
        db.add_all(env_food)
        db.commit()
        print("   ✓ Added 1 food sample with contamination")
        
        # ============================================================
        # SCENARIO 3: Environmental Pollution Impact
        # ============================================================
        print("\n📍 SCENARIO 3: Air Quality & Environmental Monitoring")
        print("   Location: Lagos, Nigeria (coordinates: 6.5244, 3.3792)")
        
        base_time3 = datetime.now() - timedelta(days=5)
        
        # Environmental air quality monitoring
        air_samples = [
            EnvironmentalData(
                sample_id="ENV_003",
                sample_type="Air",
                location_name="Lagos, Industrial Area",
                latitude=6.5244,
                longitude=3.3792,
                temperature=31,
                air_quality_index=156,
                pathogen_detected=[],
                pollutant_level=289,
                pollutant_type="PM10",
                notes="Severe air pollution from industrial emissions",
                reported_by=users[2].username,
                created_at=base_time3
            ),
            EnvironmentalData(
                sample_id="ENV_004",
                sample_type="Soil",
                location_name="Lagos, Nearby Agricultural Area",
                latitude=6.5240,
                longitude=3.3795,
                temperature=29,
                water_quality_ph=5.2,
                pathogen_detected=["Mycobacterium", "Coccidioides"],
                pollutant_level=8.9,
                pollutant_type="Heavy Metals",
                notes="Soil contamination affecting local crops",
                reported_by=users[2].username,
                created_at=base_time3 + timedelta(days=2)
            ),
        ]
        db.add_all(air_samples)
        db.commit()
        print("   ✓ Added 2 environmental samples (air & soil)")
        
        # ============================================================
        # SCENARIO 4: Normal/Low-Risk Cases
        # ============================================================
        print("\n📍 SCENARIO 4: Routine Surveillance (Low Risk)")
        print("   Location: Addis Ababa, Ethiopia (coordinates: 9.0320, 38.7469)")
        
        base_time4 = datetime.now() - timedelta(days=7)
        
        # Low-risk cases
        normal_cases = [
            HumanData(
                case_id="HUMAN_007",
                patient_name="Tadesse Bekele",
                age=25,
                gender="M",
                case_type="Respiratory",
                symptoms=["mild_cough"],
                severity="Low",
                hospitalized=False,
                contact_count=2,
                outcome="Recovered",
                location_name="Addis Ababa, Bole",
                latitude=9.0320,
                longitude=38.7469,
                reported_by=users[0].username,
                created_at=base_time4
            ),
            HumanData(
                case_id="HUMAN_008",
                patient_name="Almaz Tilahun",
                age=31,
                gender="F",
                case_type="Gastrointestinal",
                symptoms=["mild_nausea"],
                severity="Low",
                hospitalized=False,
                contact_count=1,
                outcome="Recovered",
                location_name="Addis Ababa, Bole",
                latitude=9.0321,
                longitude=38.7470,
                reported_by=users[0].username,
                created_at=base_time4 + timedelta(days=1)
            ),
        ]
        db.add_all(normal_cases)
        db.commit()
        print("   ✓ Added 2 low-risk routine cases")
        
        # Normal animal health
        normal_animal = [
            AnimalData(
                event_id="ANIMAL_004",
                species="Sheep",
                population_count=200,
                mortality_count=0,
                morbidity_count=2,
                clinical_signs=["minor_pasture_changes"],
                location_name="Addis Ababa, Rural Area",
                latitude=9.0315,
                longitude=38.7465,
                farm_id="FARM_004",
                vaccination_status="Fully Vaccinated",
                reported_by=users[1].username,
                created_at=base_time4
            ),
        ]
        db.add_all(normal_animal)
        db.commit()
        print("   ✓ Added 1 normal animal health record")
        
        # ============================================================
        # Generate Alerts Based on Data
        # ============================================================
        print("\n🚨 GENERATING ALERTS")
        
        # Critical Alert: Respiratory outbreak with zoonotic risk
        alert1 = AlertEvent(
            alert_id="ALERT_001",
            alert_type="Zoonotic Risk",
            risk_level="CRITICAL",
            human_case_id=1,
            animal_event_id=1,
            environmental_sample_id=1,
            description="Multiple human respiratory cases (3) detected within 10km of poultry farm with H5N1 detection. 45 chicken deaths reported.",
            distance_km=2.1,
            time_diff_hours=8,
            recommendation="Immediate isolation of affected individuals, Quarantine poultry farm, Conduct contact tracing for 12-20 contacts, Increase environmental surveillance",
            status="Active",
            created_at=base_time + timedelta(hours=15)
        )
        db.add(alert1)
        db.commit()
        print("   ✓ CRITICAL Alert: Respiratory + Zoonotic outbreak")
        
        # High Alert: Foodborne cluster
        alert2 = AlertEvent(
            alert_id="ALERT_002",
            alert_type="Disease Cluster",
            risk_level="HIGH",
            human_case_id=4,
            animal_event_id=3,
            environmental_sample_id=2,
            description="Gastrointestinal cluster detected: 3 cases within 0.5km radius. Environmental testing positive for Salmonella and E.coli O157:H7.",
            distance_km=0.4,
            time_diff_hours=12,
            recommendation="Activate foodborne disease investigation, Test local food vendors, Public notification of potential contamination",
            status="Active",
            created_at=base_time2 + timedelta(hours=18)
        )
        db.add(alert2)
        db.commit()
        print("   ✓ HIGH Alert: Foodborne disease cluster")
        
        # Moderate Alert: Environmental contamination
        alert3 = AlertEvent(
            alert_id="ALERT_003",
            alert_type="Environmental Hazard",
            risk_level="MODERATE",
            environmental_sample_id=3,
            description="Critical air pollution detected in industrial area with high PM10 (289 µg/m³) and soil contamination with pathogenic organisms.",
            distance_km=5.2,
            time_diff_hours=48,
            recommendation="Increase respiratory health monitoring, Implement air quality warning system, Inspect industrial emission sources",
            status="Active",
            created_at=base_time3 + timedelta(hours=6)
        )
        db.add(alert3)
        db.commit()
        print("   ✓ MODERATE Alert: Environmental hazard")
        
        # Low Alert: Routine surveillance
        alert4 = AlertEvent(
            alert_id="ALERT_004",
            alert_type="Routine Surveillance",
            risk_level="LOW",
            human_case_id=7,
            animal_event_id=4,
            description="Low-risk cases detected. No clustering observed. Routine monitoring recommended.",
            distance_km=8.5,
            time_diff_hours=72,
            recommendation="Continue routine surveillance, No immediate action required, Standard follow-up protocols",
            status="Monitoring",
            created_at=base_time4 + timedelta(days=1)
        )
        db.add(alert4)
        db.commit()
        print("   ✓ LOW Alert: Routine surveillance")
        
        # ============================================================
        # Alert History
        # ============================================================
        print("\n📜 CREATING ALERT HISTORY")
        
        history1 = AlertHistory(
            alert_id=alert1.id,
            previous_status=None,
            new_status="Active",
            changed_by=users[3].username,
            reason="Initial alert generated from data correlation",
            changed_at=base_time + timedelta(hours=15)
        )
        history2 = AlertHistory(
            alert_id=alert1.id,
            previous_status="Active",
            new_status="Escalated",
            changed_by=users[3].username,
            reason="Confirmed H5N1 detection in environmental samples",
            changed_at=base_time + timedelta(hours=18)
        )
        history3 = AlertHistory(
            alert_id=alert2.id,
            previous_status=None,
            new_status="Active",
            changed_by=users[3].username,
            reason="Cluster detection triggered investigation protocol",
            changed_at=base_time2 + timedelta(hours=18)
        )
        db.add_all([history1, history2, history3])
        db.commit()
        print("   ✓ Added 3 alert history records")
        
        # ============================================================
        # Summary Statistics
        # ============================================================
        print("\n" + "="*60)
        print("📊 DATABASE SEEDING COMPLETE")
        print("="*60)
        
        human_count = db.query(HumanData).count()
        animal_count = db.query(AnimalData).count()
        env_count = db.query(EnvironmentalData).count()
        alert_count = db.query(AlertEvent).count()
        
        print(f"\n✓ Human Cases: {human_count}")
        print(f"✓ Animal Events: {animal_count}")
        print(f"✓ Environmental Samples: {env_count}")
        print(f"✓ Alerts Generated: {alert_count}")
        print(f"✓ Alert History Records: {db.query(AlertHistory).count()}")
        print(f"\nTotal Records: {human_count + animal_count + env_count + alert_count}")
        
        print("\n" + "="*60)
        print("🎯 USE CASES DEMONSTRATED")
        print("="*60)
        print("1. ✓ Zoonotic Disease Detection (Respiratory + Poultry)")
        print("2. ✓ Foodborne Illness Cluster Recognition")
        print("3. ✓ Environmental Health Hazards")
        print("4. ✓ Routine Surveillance Baseline")
        print("\n" + "="*60)
        print("🚀 Access the System:")
        print("   Frontend: http://localhost:3000")
        print("   Backend:  http://localhost:8000")
        print("   API Docs: http://localhost:8000/docs")
        print("="*60)
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding database: {e}")
        import traceback
        traceback.print_exc()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
