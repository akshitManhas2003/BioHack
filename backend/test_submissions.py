#!/usr/bin/env python3
"""
Data Submission Test Script
Generates and submits example data to the One Health Surveillance System
for testing the data submission forms and API endpoints
"""

import requests
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any
import random

# Configuration
API_BASE_URL = "http://localhost:8000/api"
ENDPOINTS = {
    "human": f"{API_BASE_URL}/human/reports",
    "animal": f"{API_BASE_URL}/animal/reports",
    "environmental": f"{API_BASE_URL}/environmental/reports"
}

# Example Datasets
HUMAN_CASE_EXAMPLES = [
    {
        "patient_name": "John Kipchoge",
        "age": 45,
        "gender": "M",
        "case_type": "Respiratory",
        "symptoms": ["cough", "fever", "shortness_of_breath", "headache"],
        "severity": "High",
        "hospitalized": True,
        "contact_count": 12,
        "outcome": "Recovering",
        "location_name": "Nairobi, Eastlands",
        "latitude": -1.2921,
        "longitude": 36.8219,
        "reported_by": "doctor_ali"
    },
    {
        "patient_name": "Grace Nakamatte",
        "age": 28,
        "gender": "F",
        "case_type": "Gastrointestinal",
        "symptoms": ["diarrhea", "vomiting", "abdominal_pain"],
        "severity": "High",
        "hospitalized": True,
        "contact_count": 5,
        "outcome": "Recovering",
        "location_name": "Kampala, Downtown",
        "latitude": 0.3476,
        "longitude": 32.5825,
        "reported_by": "nurse_amara"
    },
    {
        "patient_name": "Tadesse Bekele",
        "age": 25,
        "gender": "M",
        "case_type": "Respiratory",
        "symptoms": ["mild_cough"],
        "severity": "Low",
        "hospitalized": False,
        "contact_count": 2,
        "outcome": "Recovering",
        "location_name": "Addis Ababa, Bole",
        "latitude": 9.0320,
        "longitude": 38.7469,
        "reported_by": "health_ext_dereje"
    },
    {
        "patient_name": "Mary Wanjiru",
        "age": 32,
        "gender": "F",
        "case_type": "Respiratory",
        "symptoms": ["cough", "fever"],
        "severity": "Moderate",
        "hospitalized": False,
        "contact_count": 4,
        "outcome": "Stable",
        "location_name": "Nairobi, Eastlands",
        "latitude": -1.2920,
        "longitude": 36.8220,
        "reported_by": "doctor_ali"
    }
]

ANIMAL_EVENT_EXAMPLES = [
    {
        "species": "Chicken",
        "population_count": 500,
        "mortality_count": 45,
        "morbidity_count": 120,
        "clinical_signs": ["respiratory_distress", "dropped_egg_production", "lethargy"],
        "location_name": "Nairobi, Poultry Farm",
        "latitude": -1.2915,
        "longitude": 36.8225,
        "farm_id": "FARM_001",
        "vaccination_status": "Partially Vaccinated",
        "reported_by": "vet_fatima"
    },
    {
        "species": "Turkey",
        "population_count": 200,
        "mortality_count": 18,
        "morbidity_count": 55,
        "clinical_signs": ["coughing", "nasal_discharge", "reduced_appetite"],
        "location_name": "Nairobi, Mixed Farm",
        "latitude": -1.2918,
        "longitude": 36.8220,
        "farm_id": "FARM_002",
        "vaccination_status": "Not Vaccinated",
        "reported_by": "vet_fatima"
    },
    {
        "species": "Cattle",
        "population_count": 150,
        "mortality_count": 5,
        "morbidity_count": 28,
        "clinical_signs": ["diarrhea", "reduced_milk_production"],
        "location_name": "Kampala, Dairy Farm",
        "latitude": 0.3480,
        "longitude": 32.5820,
        "farm_id": "FARM_003",
        "vaccination_status": "Fully Vaccinated",
        "reported_by": "vet_gopal"
    }
]

ENVIRONMENTAL_SAMPLE_EXAMPLES = [
    {
        "sample_type": "Water",
        "location_name": "Nairobi, Market Water Source",
        "latitude": -1.2925,
        "longitude": 36.8215,
        "water_quality_ph": 6.8,
        "water_turbidity": 8.5,
        "temperature": 22,
        "pathogen_detected": ["H5N1", "Influenza A"],
        "pollutant_level": 8.5,
        "pollutant_type": "Biological",
        "notes": "Water source near poultry market showing high contamination",
        "reported_by": "env_ahmed"
    },
    {
        "sample_type": "Food",
        "location_name": "Kampala, Market Produce",
        "latitude": 0.3478,
        "longitude": 32.5825,
        "temperature": 28,
        "humidity": 75,
        "pathogen_detected": ["Salmonella", "E.coli_O157:H7"],
        "pollutant_level": 7.8,
        "pollutant_type": "Biological",
        "notes": "Vegetables from local market testing positive for pathogens",
        "reported_by": "env_kosiwe"
    },
    {
        "sample_type": "Air",
        "location_name": "Lagos, Industrial Area",
        "latitude": 6.5244,
        "longitude": 3.3792,
        "air_quality_index": 156,
        "pollutant_level": 289,
        "pollutant_type": "PM10",
        "temperature": 31,
        "pathogen_detected": [],
        "notes": "Severe air pollution from industrial emissions",
        "reported_by": "env_okonkwo"
    }
]


class DataSubmissionTester:
    """Test harness for submitting example data to the surveillance system"""
    
    def __init__(self, api_base_url: str = API_BASE_URL):
        self.api_base_url = api_base_url
        self.session = requests.Session()
        self.results = {
            "human_cases": [],
            "animal_events": [],
            "environmental_samples": []
        }
        self.summary = {
            "total_submitted": 0,
            "successful": 0,
            "failed": 0,
            "errors": []
        }
    
    def test_connection(self) -> bool:
        """Test if API is running"""
        try:
            response = requests.get(f"{self.api_base_url.split('/api')[0]}/docs", timeout=5)
            print("✓ API server is running (Swagger UI accessible)")
            return True
        except Exception as e:
            print(f"✗ API server not running: {e}")
            print(f"  Make sure backend is running: uvicorn main:app --reload")
            return False
    
    def submit_human_case(self, case_data: Dict[str, Any]) -> Dict[str, Any]:
        """Submit a human case"""
        try:
            response = self.session.post(
                ENDPOINTS["human"],
                json=case_data,
                timeout=10
            )
            result = {
                "status": "success" if response.status_code in [200, 201] else "failed",
                "status_code": response.status_code,
                "data": case_data.get("patient_name", "Unknown"),
                "response": response.json() if response.text else None
            }
            
            if result["status"] == "success":
                print(f"  ✓ {case_data['patient_name']} - {case_data['case_type']}")
                self.summary["successful"] += 1
            else:
                print(f"  ✗ {case_data['patient_name']} - Error: {response.status_code}")
                self.summary["failed"] += 1
                self.summary["errors"].append(f"Human case {case_data['patient_name']}: {response.text}")
            
            self.results["human_cases"].append(result)
            return result
        
        except Exception as e:
            error_msg = f"Failed to submit human case: {str(e)}"
            print(f"  ✗ Error: {error_msg}")
            self.summary["failed"] += 1
            self.summary["errors"].append(error_msg)
            return {"status": "error", "error": str(e)}
    
    def submit_animal_event(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """Submit an animal event"""
        try:
            response = self.session.post(
                ENDPOINTS["animal"],
                json=event_data,
                timeout=10
            )
            result = {
                "status": "success" if response.status_code in [200, 201] else "failed",
                "status_code": response.status_code,
                "data": f"{event_data.get('species')} - {event_data.get('farm_id', 'Unknown')}",
                "response": response.json() if response.text else None
            }
            
            if result["status"] == "success":
                print(f"  ✓ {event_data['species']} - {event_data['farm_id']}")
                self.summary["successful"] += 1
            else:
                print(f"  ✗ {event_data['species']} - Error: {response.status_code}")
                self.summary["failed"] += 1
                self.summary["errors"].append(f"Animal event {event_data['species']}: {response.text}")
            
            self.results["animal_events"].append(result)
            return result
        
        except Exception as e:
            error_msg = f"Failed to submit animal event: {str(e)}"
            print(f"  ✗ Error: {error_msg}")
            self.summary["failed"] += 1
            self.summary["errors"].append(error_msg)
            return {"status": "error", "error": str(e)}
    
    def submit_environmental_sample(self, sample_data: Dict[str, Any]) -> Dict[str, Any]:
        """Submit an environmental sample"""
        try:
            response = self.session.post(
                ENDPOINTS["environmental"],
                json=sample_data,
                timeout=10
            )
            result = {
                "status": "success" if response.status_code in [200, 201] else "failed",
                "status_code": response.status_code,
                "data": f"{sample_data.get('sample_type')} - {sample_data.get('location_name', 'Unknown')}",
                "response": response.json() if response.text else None
            }
            
            if result["status"] == "success":
                print(f"  ✓ {sample_data['sample_type']} - {sample_data['location_name']}")
                self.summary["successful"] += 1
            else:
                print(f"  ✗ {sample_data['sample_type']} - Error: {response.status_code}")
                self.summary["failed"] += 1
                self.summary["errors"].append(f"Environmental sample {sample_data['sample_type']}: {response.text}")
            
            self.results["environmental_samples"].append(result)
            return result
        
        except Exception as e:
            error_msg = f"Failed to submit environmental sample: {str(e)}"
            print(f"  ✗ Error: {error_msg}")
            self.summary["failed"] += 1
            self.summary["errors"].append(error_msg)
            return {"status": "error", "error": str(e)}
    
    def run_all_submissions(self, verbose: bool = True) -> Dict[str, Any]:
        """Submit all example data"""
        print("\n" + "="*60)
        print("🧪 ONE HEALTH SURVEILLANCE - DATA SUBMISSION TEST")
        print("="*60)
        
        # Check connection
        if not self.test_connection():
            return {"status": "error", "message": "API server not accessible"}
        
        print("\n📋 SUBMITTING EXAMPLE DATA")
        print("-" * 60)
        
        # Submit human cases
        print("\n👥 Human Cases:")
        for case in HUMAN_CASE_EXAMPLES:
            self.submit_human_case(case)
            self.summary["total_submitted"] += 1
        
        # Submit animal events
        print("\n🐾 Animal Events:")
        for event in ANIMAL_EVENT_EXAMPLES:
            self.submit_animal_event(event)
            self.summary["total_submitted"] += 1
        
        # Submit environmental samples
        print("\n🌍 Environmental Samples:")
        for sample in ENVIRONMENTAL_SAMPLE_EXAMPLES:
            self.submit_environmental_sample(sample)
            self.summary["total_submitted"] += 1
        
        # Print summary
        self.print_summary()
        
        return {
            "status": "complete",
            "summary": self.summary,
            "results": self.results
        }
    
    def print_summary(self):
        """Print submission summary"""
        print("\n" + "="*60)
        print("📊 SUBMISSION SUMMARY")
        print("="*60)
        print(f"\nTotal Submissions: {self.summary['total_submitted']}")
        print(f"✓ Successful: {self.summary['successful']}")
        print(f"✗ Failed: {self.summary['failed']}")
        
        if self.summary["errors"]:
            print(f"\n⚠️  Errors encountered:")
            for error in self.summary["errors"]:
                print(f"   - {error}")
        
        print("\n" + "="*60)
        print("✅ TEST COMPLETE")
        print("="*60)
        print("\n📍 Access the System:")
        print(f"   🌐 Frontend: http://localhost:3000")
        print(f"   🔧 Backend API: http://localhost:8000/api")
        print(f"   📚 Swagger Docs: http://localhost:8000/docs")
        print(f"\n📊 View Results:")
        print(f"   • Dashboard: See live statistics")
        print(f"   • Map: View all {self.summary['successful']} submitted cases")
        print(f"   • Data Submission: Forms ready for new entries")
        print("\n")


def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Test data submission to One Health Surveillance System"
    )
    parser.add_argument(
        "--api-url",
        default=API_BASE_URL,
        help="API base URL (default: http://localhost:8000/api)"
    )
    parser.add_argument(
        "--check-only",
        action="store_true",
        help="Only check API connectivity without submitting data"
    )
    
    args = parser.parse_args()
    
    tester = DataSubmissionTester(api_base_url=args.api_url)
    
    if args.check_only:
        if tester.test_connection():
            print("✓ System is ready for data submission")
        else:
            print("✗ System is not accessible. Please start the backend.")
    else:
        tester.run_all_submissions()


if __name__ == "__main__":
    main()
