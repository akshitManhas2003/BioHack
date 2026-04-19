# One Health Surveillance System - Architecture & Design

## System Overview

The One Health Surveillance System is a full-stack web application designed to integrate disease surveillance data from three interconnected domains: human health, animal health, and environmental monitoring. The system uses advanced geospatial analysis to detect disease patterns and generate automated alerts for potential zoonotic disease outbreaks.

## Architecture Layers

### 1. Presentation Layer (Frontend)

**Technology**: React 18, Vite, Tailwind CSS, Leaflet

**Components**:
- **Dashboard Page**: Real-time metrics and statistics
  - KPI cards for total cases, events, samples, and alerts
  - Breakdowns by case type, species, and severity
  - Trend charts using Recharts
  
- **Map View**: Interactive geospatial visualization
  - Leaflet.js for mapping
  - Color-coded markers (Red=Human, Yellow=Animal, Green=Environment)
  - Popup information on marker click
  - Filter toggles for data types
  
- **Data Submission**: Forms for field workers
  - Tabbed interface for different data types
  - Real-time form validation with Pydantic schemas
  - Immediate success/error feedback

**State Management**: React hooks with functional components

**Data Flow**:
```
User Action → Component State → API Call → Backend → Response → Update State → Re-render
```

### 2. API Layer (Backend)

**Technology**: FastAPI, Python 3.11, Uvicorn

**Architecture Pattern**: REST with strategic endpoints

**Route Organization**:
```
/api/human/              - Human disease case endpoints
/api/animal/             - Animal health event endpoints
/api/environmental/      - Environmental sample endpoints
/api/alerts/             - Alert generation and management
```

**Key Features**:
- **Type Safety**: Pydantic models for request/response validation
- **Automatic Documentation**: Swagger UI at /docs, ReDoc at /redoc
- **CORS Support**: Configured for frontend integration
- **Error Handling**: Comprehensive exception handling with meaningful error messages

**Request/Response Flow**:
```
HTTP Request → FastAPI Router → Handler Function → Database Query → 
Response Model Validation → JSON Response
```

### 3. Data Layer

**Technology**: PostgreSQL 15, PostGIS 3.3, SQLAlchemy ORM

**Database Design Pattern**: Star schema with facts (alerts) and dimensions (data sources)

**Tables**:
```
human_data
  ├── id (PK)
  ├── case_id (UNIQUE)
  ├── demographics (name, age, gender)
  ├── clinical (symptoms[], case_type, severity)
  ├── location (latitude, longitude, geom)
  └── audit (reported_by, created_at, updated_at)

animal_data
  ├── id (PK)
  ├── event_id (UNIQUE)
  ├── species, population metrics
  ├── health metrics (mortality, morbidity)
  ├── location (latitude, longitude, geom)
  └── audit (reported_by, created_at, updated_at)

environmental_data
  ├── id (PK)
  ├── sample_id (UNIQUE)
  ├── sample_type, quality metrics
  ├── pathogen_detected[], pollutants
  ├── location (latitude, longitude, geom)
  └── audit (reported_by, created_at, updated_at)

alert_events
  ├── id (PK)
  ├── alert_id (UNIQUE)
  ├── risk_level, alert_type
  ├── foreign keys to data sources
  ├── analysis (distance_km, time_diff_hours)
  └── audit (created_at, updated_at)

alert_history
  ├── Tracks all status transitions
  └── audit trail (changed_by, reason)

users
  ├── username, email, authentication
  └── role-based access control
```

**Indexing Strategy**:
- Spatial index on geom columns (GiST) for PostGIS
- Regular indexes on frequently filtered fields
- Composite indexes on common filter combinations

### 4. Business Logic Layer

**Alert Generation Engine** (`app/utils/alert_generator.py`):

1. **Zoonotic Risk Detection**
   ```python
   def check_zoonotic_risk_alert(db: Session, human_case: HumanData):
       # Find poultry/waterfowl deaths within 48 hours
       # Calculate distance using haversine formula
       # Generate HIGH risk alert if distance ≤ 10km
   ```

2. **Environmental Risk Detection**
   ```python
   def check_environmental_risk_alert(db: Session, human_case: HumanData):
       # Find contaminated environmental samples
       # Check distance and temporal proximity
       # Generate MODERATE risk alert
   ```

3. **Disease Cluster Detection**
   ```python
   def check_disease_cluster_alert(db: Session):
       # Find 3+ cases within 2km in 7-day window
       # Risk level based on cluster size
       # Generate HIGH/MODERATE alert
   ```

**Geospatial Calculations**:
- Haversine formula for distance calculation (km)
- PostGIS ST_Distance for database-level queries
- Bounding box queries for efficient spatial searches

## Data Flow Diagrams

### Submission to Alert Flow
```
Field Worker submits data via form
        ↓
Frontend validates with Pydantic schema
        ↓
POST to /api/{human|animal|environmental}/reports
        ↓
Backend creates database record
        ↓
Backend triggers alert generation logic
        ↓
Queries for matching patterns in other domains
        ↓
Calculates distance and time metrics
        ↓
Creates alert_events records if threshold met
        ↓
Response sent with case/event ID
        ↓
Frontend confirms with success message
        ↓
User sees updated map and dashboard
```

### Alert Detection Real-time Check
```
GET /api/alerts/check
        ↓
Query recent human cases (last 48 hours)
        ↓
For each case:
  - Check zoonotic risk patterns
  - Check environmental risks
  - Check cluster formation
        ↓
Combine with cluster detection
        ↓
Remove duplicates (check existing alerts)
        ↓
Create new alert_events
        ↓
Return all new alerts to frontend
```

## Security Architecture

### Authentication & Authorization
- Field workers can only submit data (not modify)
- Analysts can view all data and acknowledge alerts
- Admins can manage users and system configuration

### Data Validation
- All inputs validated with Pydantic schemas
- SQL injection prevention through ORM
- XSS prevention through React's JSX escaping

### Deployment Security
- Environment variables for sensitive data
- HTTPS/TLS in production
- Database credentials never in code
- Rate limiting on API endpoints

## Performance Optimization

### Database Layer
1. **Connection Pooling**
   ```python
   engine = create_engine(
       DATABASE_URL,
       pool_size=10,
       max_overflow=20,
       pool_pre_ping=True
   )
   ```

2. **Spatial Indexes**
   ```sql
   CREATE INDEX idx_human_geom ON human_data USING GIST(geom);
   CREATE INDEX idx_animal_geom ON animal_data USING GIST(geom);
   CREATE INDEX idx_env_geom ON environmental_data USING GIST(geom);
   ```

3. **Query Optimization**
   - Use limit clauses on dashboard queries
   - Batch operations where possible
   - Avoid n+1 query problems

### Frontend Layer
1. **Code Splitting**: Lazy load components
2. **Memoization**: Prevent unnecessary re-renders
3. **API Caching**: Cache dashboard stats (30s refresh)

### Backend Layer
1. **Async Processing**: Use FastAPI's async support
2. **Batch Processing**: Process multiple alerts at once

## Scalability Considerations

### Horizontal Scaling
1. **Load Balancer**: Distribute traffic across backend instances
2. **Read Replicas**: Scale database reads for analytics
3. **CDN**: Cache static frontend assets

### Vertical Scaling
1. Database: Increase RAM for query caching
2. Backend: Increase CPU for parallel processing
3. Frontend: Served from CDN near users

### Asynchronous Processing
Future enhancements:
- Celery for background alert generation
- Redis for caching and message queue
- Kafka for high-volume data streaming

## Integration Points

### External Systems (Future)
- SMS/Email notifications for alerts
- Integration with national surveillance systems
- Real-time data feeds from laboratories
- Weather API for environmental correlation
- Disease control agency APIs

## Monitoring & Observability

### Metrics to Track
1. **System Health**: CPU, memory, disk usage
2. **API Performance**: Response times, error rates
3. **Database**: Query times, connection pool usage
4. **Alerts**: Generation rate, false positive rate

### Logging
- Application logs: Info, warning, error levels
- Access logs: All API requests
- Audit logs: User actions and data changes
- Alert logs: Generation and status changes

### Alerts
- High error rate on API endpoints
- Database connection pool exhaustion
- Excessive false positive alerts
- System resource limits approaching

## Testing Strategy

### Unit Tests
- Test alert generation logic with mock data
- Test distance calculations
- Test data validation schemas

### Integration Tests
- Test API endpoints with test database
- Test alert generation end-to-end
- Test data submission and retrieval

### Performance Tests
- Load testing with k6 or Apache JMeter
- Database query performance testing
- Frontend rendering performance

## Deployment Architecture

### Docker Compose (Development/Testing)
```
docker-compose.yml
├── db service (PostgreSQL + PostGIS)
├── backend service (FastAPI)
└── frontend service (React)
```

### Production Deployment Options
1. **Kubernetes**: Service mesh for high availability
2. **AWS**: ECS/EKS with RDS and CloudFront
3. **Azure**: Container Instances with Cosmos DB
4. **On-Premises**: Docker Swarm or Kubernetes

## Data Privacy & Compliance

### HIPAA Compliance (for US deployments)
- Encrypt data at rest (TLS)
- Encrypt data in transit (HTTPS)
- Access controls and audit logs
- Data retention policies

### GDPR Compliance (for EU deployments)
- Right to access and deletion
- Data minimization
- Consent management
- Data breach notification

## Error Handling Strategy

### API Errors
```python
- 400: Bad Request (validation error)
- 404: Not Found (resource not found)
- 500: Internal Server Error (system failure)
- 503: Service Unavailable (maintenance)
```

### User-Facing Errors
- Clear, actionable error messages
- Suggested remediation steps
- Error reporting mechanism

## Future Enhancements

1. **Machine Learning**: Predictive modeling for outbreak risk
2. **Real-time Streaming**: WebSocket updates for live alerts
3. **Mobile App**: Native iOS/Android for field workers
4. **Advanced Analytics**: Time series analysis and forecasting
5. **Integration Hub**: Connect to external data sources
6. **Multi-language Support**: Localization for different regions

## References

- One Health Approach: CDC, WHO, FAO
- PostGIS Documentation: https://postgis.net/
- FastAPI Best Practices: https://fastapi.tiangolo.com/deployment/
- React Performance: https://react.dev/reference/react
