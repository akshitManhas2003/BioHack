# API Quick Reference

## Base URL
```
http://localhost:8000
```

## Health Check
```
GET /health
```

## Human Data Endpoints

### Submit Human Case Report
```
POST /api/human/reports

Body:
{
  "patient_name": "string (optional)",
  "age": "integer (optional)",
  "gender": "string (M/F/O, optional)",
  "symptoms": ["string array"],
  "case_type": "respiratory|gastrointestinal|other (required)",
  "severity": "mild|moderate|severe|critical (required)",
  "location_name": "string (required)",
  "latitude": "number (required)",
  "longitude": "number (required)",
  "contact_count": "integer (default: 0)",
  "hospitalized": "boolean (default: false)",
  "reported_by": "string (required)"
}

Response: 201 Created
{
  "id": 1,
  "case_id": "CASE_H_XXXXXX",
  "patient_name": "...",
  "created_at": "2024-01-01T12:00:00"
}
```

### Get Human Cases
```
GET /api/human/cases?case_type=respiratory&severity=severe&days=30
Query params: case_type, severity, days
Response: 200 OK - Array of HumanDataResponse objects
```

### Get Specific Case
```
GET /api/human/case/{case_id}
Response: 200 OK - HumanDataResponse object
```

### Get Human Statistics
```
GET /api/human/stats?days=30
Response: 200 OK
{
  "total_cases": 15,
  "hospitalized": 5,
  "severity_breakdown": [...],
  "case_type_breakdown": [...]
}
```

## Animal Data Endpoints

### Submit Animal Event
```
POST /api/animal/reports

Body:
{
  "species": "poultry|swine|cattle|wild_bird (required)",
  "species_detail": "string (optional)",
  "population_count": "integer (optional)",
  "mortality_count": "integer (required)",
  "morbidity_count": "integer (required)",
  "location_name": "string (required)",
  "latitude": "number (required)",
  "longitude": "number (required)",
  "clinical_signs": ["string array"],
  "reported_by": "string (required)",
  "farm_id": "string (optional)",
  "vaccination_status": "string (optional)"
}

Response: 201 Created
```

### Get Animal Events
```
GET /api/animal/events?species=poultry&days=30&min_mortality=10
Query params: species, days, min_mortality
Response: 200 OK - Array of AnimalDataResponse objects
```

### Get Specific Event
```
GET /api/animal/event/{event_id}
Response: 200 OK - AnimalDataResponse object
```

### Get Animal Statistics
```
GET /api/animal/stats?days=30
Response: 200 OK
{
  "total_events": 8,
  "total_mortality": 450,
  "total_morbidity": 1200,
  "species_breakdown": [...]
}
```

## Environmental Data Endpoints

### Submit Environmental Sample
```
POST /api/environmental/reports

Body:
{
  "sample_type": "water|air|soil|feed (required)",
  "location_name": "string (required)",
  "latitude": "number (required)",
  "longitude": "number (required)",
  "temperature": "number (optional)",
  "humidity": "number (optional)",
  "water_quality_ph": "number (optional)",
  "water_turbidity": "number (optional)",
  "pathogen_detected": ["string array (optional)"],
  "pollutant_level": "number (optional)",
  "pollutant_type": "string (optional)",
  "air_quality_index": "number (optional)",
  "notes": "string (optional)",
  "reported_by": "string (required)"
}

Response: 201 Created
```

### Get Environmental Samples
```
GET /api/environmental/samples?sample_type=water&days=30&pathogen=E_coli
Query params: sample_type, days, pathogen
Response: 200 OK - Array of EnvironmentalDataResponse objects
```

### Get Specific Sample
```
GET /api/environmental/sample/{sample_id}
Response: 200 OK - EnvironmentalDataResponse object
```

### Get Environmental Statistics
```
GET /api/environmental/stats?days=30
Response: 200 OK
{
  "total_samples": 20,
  "contaminated_samples": 5,
  "avg_air_quality_index": 85.5,
  "sample_type_breakdown": [...]
}
```

## Alert Endpoints

### Check for Alerts
```
GET /api/alerts/check

Response: 200 OK - Array of AlertEventResponse objects
(Runs alert detection logic and returns newly generated alerts)
```

### Get Active Alerts
```
GET /api/alerts/active?risk_level=high&alert_type=zoonotic_risk
Query params: risk_level, alert_type
Response: 200 OK - Array of AlertEventResponse objects
```

### Get Specific Alert
```
GET /api/alerts/alert/{alert_id}
Response: 200 OK - AlertEventResponse object
```

### Update Alert Status
```
PUT /api/alerts/alert/{alert_id}/status

Body:
{
  "new_status": "active|resolved|archived (required)",
  "reason": "string (optional)",
  "changed_by": "string (optional)"
}

Response: 200 OK
{
  "message": "Alert ... status updated to ...",
  "alert": {...}
}
```

### Get Alert Statistics
```
GET /api/alerts/statistics?days=30
Response: 200 OK
{
  "total_alerts": 12,
  "active_alerts": 5,
  "high_risk_active": 2,
  "risk_level_breakdown": [...],
  "alert_type_breakdown": [...]
}
```

### Get Dashboard Statistics
```
GET /api/alerts/dashboard/stats

Response: 200 OK
{
  "total_human_cases": 25,
  "total_animal_events": 10,
  "total_environmental_samples": 15,
  "active_alerts": 5,
  "high_risk_alerts": 2,
  "critical_alerts": 0
}
```

### Get Map Data
```
GET /api/alerts/map/data?include_alerts=true&days=30
Query params: include_alerts, days
Response: 200 OK - Array of MapDataPoint objects
```

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Validation error message"
}
```

### 404 Not Found
```json
{
  "detail": "Case not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error",
  "error": "error details"
}
```

## Authentication

Currently, the API does not have authentication enabled. In production:
- Add JWT token validation
- Check Authorization header
- Verify user roles

```
Authorization: Bearer <token>
```

## Rate Limiting

Future implementation will include rate limiting:
- 10 requests per minute for submissions
- 100 requests per minute for queries
- 1000 requests per minute for internal services

## Example Usage

### cURL Examples

**Submit Human Case:**
```bash
curl -X POST http://localhost:8000/api/human/reports \
  -H "Content-Type: application/json" \
  -d @- << 'EOF'
{
  "patient_name": "Jane Doe",
  "age": 38,
  "gender": "F",
  "symptoms": ["fever", "cough"],
  "case_type": "respiratory",
  "severity": "moderate",
  "location_name": "Downtown Clinic",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "hospitalized": false,
  "reported_by": "field_worker_01"
}
EOF
```

**Check for Alerts:**
```bash
curl http://localhost:8000/api/alerts/check
```

**Get Dashboard Stats:**
```bash
curl http://localhost:8000/api/alerts/dashboard/stats
```

**Update Alert Status:**
```bash
curl -X PUT http://localhost:8000/api/alerts/alert/ALERT_XXXXX/status \
  -H "Content-Type: application/json" \
  -d '{
    "new_status": "resolved",
    "reason": "Investigation completed"
  }'
```

### JavaScript/Fetch Examples

**Submit Data:**
```javascript
const response = await fetch('http://localhost:8000/api/human/reports', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    patient_name: 'John Doe',
    age: 45,
    symptoms: ['fever', 'dry_cough'],
    case_type: 'respiratory',
    severity: 'severe',
    location_name: 'Hospital',
    latitude: 40.7128,
    longitude: -74.0060,
    hospitalized: true,
    reported_by: 'field_worker_01'
  })
});
const data = await response.json();
console.log(data.case_id);
```

**Get Map Data:**
```javascript
const response = await fetch('http://localhost:8000/api/alerts/map/data?include_alerts=true&days=30');
const mapPoints = await response.json();
mapPoints.forEach(point => {
  console.log(`${point.type}: ${point.location_name}`);
});
```

## Swagger UI

Access interactive API documentation at:
```
http://localhost:8000/docs
```

Try out endpoints directly in the browser!

## ReDoc

Alternative API documentation at:
```
http://localhost:8000/redoc
```

## Contact

For API issues or questions, check the logs:
```bash
docker-compose logs backend
```
