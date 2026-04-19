# 🏥 One Health Surveillance System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![React 18+](https://img.shields.io/badge/React-18+-61dafb.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009485.svg)](https://fastapi.tiangolo.com/)

A comprehensive, integrated surveillance platform designed for **early detection and monitoring** of disease outbreaks across human, animal, and environmental domains. Built with **FastAPI**, **React**, **SQLite** (local), and modern web technologies.

> Integrated One Health approach for zoonotic disease prevention and control

## 🎯 Overview

The One Health Surveillance System bridges human, animal, and environmental health data to identify and respond to potential disease outbreaks before they spread. By monitoring these three domains simultaneously, the system can detect patterns indicative of zoonotic disease emergence.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│          Frontend (React 18 + Vite + Tailwind)              │
│  ✨ Interactive Dashboard with real-time statistics         │
│  🗺️  Leaflet Map with spatial data visualization            │
│  📝 Data submission forms for field workers                 │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│        Backend (FastAPI + Python 3.11)                      │
│  ⚡ RESTful API for data ingestion & retrieval              │
│  🚨 Real-time alert generation engine                       │
│  📊 Spatial analysis & risk detection                       │
│  📈 Dashboard statistics & reporting                        │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│       Database (SQLite - Local Development)                 │
│  👥 HumanData: Disease cases with symptoms & severity       │
│  🐾 AnimalData: Animal mortality & morbidity events         │
│  🌍 EnvironmentalData: Water, air, soil samples             │
│  ⚠️  AlertEvents: Generated alerts & risk assessments       │
└─────────────────────────────────────────────────────────────┘
```

## ⚡ Quick Start

Get up and running in minutes:

```bash
# 1. Backend Setup
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload

# 2. Frontend Setup (new terminal)
cd frontend
npm install
npm run dev

# 3. Access Application
# Dashboard: http://localhost:5173
# API Docs: http://localhost:8000/docs
```

**Detailed setup guide**: See [SETUP_GUIDE.md](SETUP_GUIDE.md)

## ✨ Key Features

### 1. 🔗 One Health Integration
- **Human Health Data**: Respiratory, gastrointestinal, and other cases with severity tracking
- **Animal Health**: Livestock and wildlife disease monitoring with mortality metrics
- **Environmental Monitoring**: Water, air, soil, and feed sample analysis with pathogen detection

### 2. 🚨 Intelligent Alert Generation
- **Zoonotic Risk Detection**: Identifies human respiratory cases + poultry deaths within 10km (48-hour window)
- **Environmental Risk Linking**: Connects human cases with nearby environmental contamination (5km radius)
- **Disease Clustering**: Detects 2+ cases within 2km over 7 days
- **Risk Stratification**: 4-level alerts (Low → Moderate → High → **CRITICAL**)

### 3. 🗺️ Real-Time Geospatial Visualization
- Interactive Leaflet map with color-coded markers
- Multi-layer display (Human, Animal, Environmental, Alerts)
- Click-through popups with detailed event information
- Distance-based filtering and dynamic updates

### 4. 📊 Comprehensive Dashboard
- **Key Metrics**: Total cases, events, samples, and active alerts
- **Data Breakdowns**: By type, severity, species, and sample category
- **Risk Distribution**: Visual representation of alert levels
- **Trend Analysis**: Historical data visualization

## 📱 User Interfaces

### Dashboard
- Real-time surveillance metrics
- Alert status and distribution
- Case type breakdowns
- Species-specific statistics

### Data Submission
- **Human Cases**: Patient info, symptoms, severity, location
- **Animal Events**: Species, mortality/morbidity, farm details
- **Environmental Samples**: Sample type, environmental parameters

### Map View
- Geographic incident visualization
- Spatial risk analysis
- Filter by data type and severity

## 🔧 Technical Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts |
| **Backend** | FastAPI 0.104, Python 3.11, Pydantic |
| **Database** | SQLite (local), SQLAlchemy ORM |
| **Styling** | CSS3, Tailwind, Custom animations |
| **Charts** | Recharts, Lucide Icons |
| **Mapping** | Leaflet, Geospatial coordinates |

## 📋 Requirements

### System Requirements
- Python 3.11+
- Node.js 16+
- npm 8+
- 2GB RAM minimum
- Windows 10/11, macOS, or Linux

### Ports Required
- **8000**: Backend API
- **5173**: Frontend dev server
- **5432**: PostgreSQL (only for production)

## 🚀 Installation

### Option 1: Quick Start (Recommended)
```bash
# Follow the Quick Start section above
```

### Option 2: Detailed Setup
See [SETUP_GUIDE.md](SETUP_GUIDE.md) for step-by-step instructions.

### Option 3: Docker (If Docker installed)
```bash
docker-compose up -d --build
```

## 📖 Documentation

### Core Documentation
- [**SETUP_GUIDE.md**](SETUP_GUIDE.md) - Quick start and installation
- [**API_REFERENCE.md**](API_REFERENCE.md) - Complete API documentation
- [**ARCHITECTURE.md**](ARCHITECTURE.md) - System design details
- [**PROJECT_STRUCTURE.md**](PROJECT_STRUCTURE.md) - Directory organization

### Data Submission Portal 📊
- [**DATA_SUBMISSION_QUICK_GUIDE.md**](DATA_SUBMISSION_QUICK_GUIDE.md) ⭐ **START HERE** - Quick reference for portal usage
- [**DATA_SUBMISSION_GUIDE.md**](DATA_SUBMISSION_GUIDE.md) - Comprehensive guide with 11 example datasets
- [**DATA_SUBMISSION_RESOURCES.md**](DATA_SUBMISSION_RESOURCES.md) - Complete resource index
- [**EXAMPLE_DATASETS.json**](EXAMPLE_DATASETS.json) - Pre-built structured example data
- [**backend/test_submissions.py**](backend/test_submissions.py) - Automated testing script

### Project & Community
- [**CONTRIBUTING.md**](CONTRIBUTING.md) - Contribution guidelines
- [**TROUBLESHOOTING.md**](TROUBLESHOOTING.md) - Common issues & solutions
- [**UI_UX_IMPROVEMENTS.md**](UI_UX_IMPROVEMENTS.md) - Design system documentation
- [**CHANGELOG.md**](CHANGELOG.md) - Version history and roadmap

## 🎯 Usage

### Submitting Data

1. Navigate to **"Submit Data"** tab
2. Choose data type (Human/Animal/Environmental)
3. Fill in form fields
4. Click **Submit**

### Viewing Alerts

1. Check dashboard for active alerts count
2. Scroll to **"Active Alerts"** section
3. Review alert details and recommendations

### Map Analysis

1. Click **"Map"** tab
2. View incidents by location
3. Click markers for details
4. Use filters for specific data types

## 🔒 Security

- Environment-based configuration
- SQL injection prevention (ORM)
- CORS enabled for development
- Input validation via Pydantic
- Database connection pooling

**For production**, review [DEPLOYMENT.md](DEPLOYMENT.md) for security hardening.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Code style guidelines
- Commit message format
- Pull request process
- Development setup

## 📊 Data Models

### Human Data
```
- case_id, patient_name, age, gender
- symptoms, case_type, severity
- location, coordinates, hospitalized
- contact_count, outcome
```

### Animal Data
```
- event_id, species, population_count
- mortality_count, morbidity_count
- location, coordinates, clinical_signs
- farm_id, vaccination_status
```

### Environmental Data
```
- sample_id, sample_type, location
- coordinates, environmental_parameters
- pathogen_detected, pollutant_level
- notes, collected_at
```

## 📈 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/human/reports` | Submit human case |
| **POST** | `/api/animal/reports` | Submit animal event |
| **POST** | `/api/environmental/reports` | Submit environmental sample |
| **GET** | `/api/alerts/` | Get active alerts |
| **GET** | `/api/health` | System health check |
| **GET** | `/docs` | API documentation (Swagger) |

Full API docs available at `http://localhost:8000/docs`

## 🛠️ Configuration

Environment variables in `.env.example`:

```env
# Database (SQLite for development)
DATABASE_URL=sqlite:///./one_health_surveillance.db

# API Server
API_HOST=0.0.0.0
API_PORT=8000

# Frontend
VITE_API_URL=http://localhost:8000/api
```

## 📦 Database

**Local Development**: SQLite (auto-created)
- No setup needed
- Database file: `backend/one_health_surveillance.db`
- Tables auto-created on startup

**Production**: PostgreSQL 15+ recommended
- See [DEPLOYMENT.md](DEPLOYMENT.md)

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm run test
```

## 📝 License

MIT License - see [LICENSE](LICENSE) for details

## 👥 Authors

One Health Surveillance Team

## 🙏 Acknowledgments

- Developed for integrated disease surveillance
- Built with modern, scalable web technologies
- Community-driven open-source project

## 📞 Support

- 📖 Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- 🐛 Report issues on GitHub
- 📧 Contact: support@onehealth.example
- 💬 Join community discussions

## 🎓 Learning Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)

---

**Ready to get started?** → [SETUP_GUIDE.md](SETUP_GUIDE.md)

**Questions?** → [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

**Want to contribute?** → [CONTRIBUTING.md](CONTRIBUTING.md)

## Quick Start with Docker

### Prerequisites
- Docker & Docker Compose installed
- Minimum 2GB RAM
- Port 3000, 5432, and 8000 available

### Step 1: Clone and Navigate
```bash
cd one-health-surveillance
```

### Step 2: Build and Run
```bash
docker-compose up -d --build
```

### Step 3: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Database**: localhost:5432 (user: surveillance_user, password: surveillance_password)

### Step 4: Verify Services
```bash
# Check all services are running
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## Local Development Setup

### Backend Setup

#### 1. Create Python Virtual Environment
```bash
cd backend
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

#### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 3. Set Environment Variables
Create `.env` file in backend directory:
```
DATABASE_URL=postgresql://surveillance_user:surveillance_password@localhost:5432/one_health_surveillance
```

#### 4. Initialize Database
```bash
# Start PostgreSQL and create database
psql -U postgres -c "CREATE DATABASE one_health_surveillance;"
psql -U postgres -d one_health_surveillance -f ../database/schema.sql
psql -U postgres -d one_health_surveillance -f ../database/init.sql
```

#### 5. Run Backend
```bash
python main.py
# Backend runs at http://localhost:8000
```

### Frontend Setup

#### 1. Install Dependencies
```bash
cd frontend
npm install
```

#### 2. Run Development Server
```bash
npm run dev
# Frontend runs at http://localhost:3000
```

#### 3. Build for Production
```bash
npm run build
```

## API Endpoints

### Human Data
```
POST   /api/human/reports              - Submit human case report
GET    /api/human/cases                - Get human cases
GET    /api/human/case/{case_id}       - Get specific case
GET    /api/human/stats                - Get human case statistics
```

### Animal Data
```
POST   /api/animal/reports             - Submit animal event
GET    /api/animal/events              - Get animal events
GET    /api/animal/event/{event_id}    - Get specific event
GET    /api/animal/stats               - Get animal statistics
```

### Environmental Data
```
POST   /api/environmental/reports      - Submit environmental sample
GET    /api/environmental/samples      - Get environmental samples
GET    /api/environmental/sample/{id}  - Get specific sample
GET    /api/environmental/stats        - Get environmental statistics
```

### Alerts
```
GET    /api/alerts/check               - Run alert detection logic
GET    /api/alerts/active              - Get active alerts
GET    /api/alerts/alert/{alert_id}    - Get alert details
PUT    /api/alerts/alert/{id}/status   - Update alert status
GET    /api/alerts/statistics          - Get alert statistics
GET    /api/alerts/dashboard/stats     - Get dashboard statistics
GET    /api/alerts/map/data            - Get map visualization data
```

## Database Schema

### Tables

#### human_data
- case_id, patient demographics
- symptoms, case_type (respiratory/GI/other), severity
- location with latitude/longitude
- geom (PostGIS geometry point)
- hospitalization status and outcome

#### animal_data
- event_id, species, population metrics
- mortality_count, morbidity_count
- clinical signs, vaccination status
- location with spatial coordinates
- farm_id for tracking

#### environmental_data
- sample_id, sample_type (water/air/soil/feed)
- environmental parameters (temp, humidity, pH, AQI)
- pathogen_detected array
- pollutant levels
- location with spatial data

#### alert_events
- alert_id, risk_level, alert_type
- Foreign keys to human, animal, and environmental data
- distance_km, time_diff_hours
- recommendation and status (active/resolved/archived)

#### alert_history
- Tracks all status changes for audit trail

## Alert Generation Logic

### Zoonotic Risk Alert (HIGH)
**Condition:**
- Human case type = respiratory AND
- Animal species in [poultry, waterfowl, wild_bird] AND
- Animal mortality_count > 0 AND
- Distance ≤ 10km AND
- Time difference ≤ 48 hours

**Recommendation:**
Immediate investigation required. Coordinate with veterinary and environmental teams. Recommend specimen collection and pathogen screening.

### Environmental Risk Alert (MODERATE)
**Condition:**
- Human case AND
- Environmental sample with pathogen_detected AND
- Distance ≤ 5km

**Recommendation:**
Investigate potential exposure route. Recommend public health measures for contaminated sources.

### Disease Cluster Alert (HIGH/MODERATE)
**Condition:**
- ≥3 human cases within 2km AND
- All cases within 7 days AND
- MODERATE if 3-4 cases, HIGH if ≥5 cases

**Recommendation:**
Activate disease cluster investigation protocol. Increase surveillance and implement outbreak control measures.

## Data Submission Examples

### Submit Human Case
```bash
curl -X POST http://localhost:8000/api/human/reports \
  -H "Content-Type: application/json" \
  -d '{
    "patient_name": "John Doe",
    "age": 45,
    "gender": "M",
    "symptoms": ["fever", "dry_cough", "shortness_of_breath"],
    "case_type": "respiratory",
    "severity": "severe",
    "location_name": "City Hospital",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "hospitalized": true,
    "reported_by": "field_worker_01"
  }'
```

### Submit Animal Event
```bash
curl -X POST http://localhost:8000/api/animal/reports \
  -H "Content-Type: application/json" \
  -d '{
    "species": "poultry",
    "species_detail": "Layer hens",
    "population_count": 5000,
    "mortality_count": 120,
    "morbidity_count": 450,
    "location_name": "Farm Zone A",
    "latitude": 40.7140,
    "longitude": -74.0065,
    "clinical_signs": ["ruffled_feathers", "nasal_discharge"],
    "reported_by": "field_worker_01",
    "vaccination_status": "partial"
  }'
```

### Submit Environmental Sample
```bash
curl -X POST http://localhost:8000/api/environmental/reports \
  -H "Content-Type: application/json" \
  -d '{
    "sample_type": "water",
    "location_name": "Local Water Source",
    "latitude": 40.7140,
    "longitude": -74.0065,
    "temperature": 22.5,
    "humidity": 65.0,
    "water_quality_ph": 7.2,
    "pathogen_detected": ["E_coli", "influenza_virus"],
    "air_quality_index": 45.0,
    "reported_by": "field_worker_01"
  }'
```

## Project Structure

```
one-health-surveillance/
├── backend/
│   ├── app/
│   │   ├── models/          # SQLAlchemy ORM models
│   │   ├── schemas/         # Pydantic validation schemas
│   │   ├── routes/          # API endpoint routes
│   │   └── utils/           # Helper functions & alert generation
│   ├── main.py              # FastAPI application entry point
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Backend container
├── frontend/
│   ├── src/
│   │   ├── pages/           # React pages (Dashboard, DataSubmission)
│   │   ├── components/      # React components (MapView, AlertsList)
│   │   ├── styles/          # CSS files
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main App component
│   │   ├── main.jsx         # React entry point
│   │   └── index.css        # Global styles
│   ├── package.json         # npm dependencies
│   ├── vite.config.js       # Vite configuration
│   ├── tailwind.config.js   # Tailwind CSS config
│   └── Dockerfile           # Frontend container
├── database/
│   ├── schema.sql           # Database schema with PostGIS
│   └── init.sql             # Sample data initialization
├── docker-compose.yml       # Docker Compose configuration
└── README.md               # This file
```

## Technologies Used

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: ORM for database abstraction
- **Pydantic**: Data validation using Python type hints
- **GeoAlchemy2**: PostGIS integration with SQLAlchemy
- **Uvicorn**: ASGI server for running FastAPI

### Frontend
- **React 18**: UI library
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Leaflet**: Interactive mapping library
- **Recharts**: React charting library
- **Lucide React**: Icon library

### Database
- **PostgreSQL 15**: Relational database
- **PostGIS**: Geospatial extension for PostgreSQL

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration

## Troubleshooting

### Database Connection Error
```bash
# Check if PostgreSQL is running
docker ps | grep one_health_db

# Check database logs
docker-compose logs db

# Verify credentials in .env file
```

### API Connection Error
```bash
# Verify backend is running
curl http://localhost:8000/health

# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Frontend Not Loading
```bash
# Clear npm cache and reinstall
npm cache clean --force
npm install

# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
npm run build
```

### PostGIS Extension Error
```bash
# Connect to database and create extension manually
docker-compose exec db psql -U surveillance_user -d one_health_surveillance -c "CREATE EXTENSION IF NOT EXISTS postgis;"
```

## Performance Optimization

### Database
- Spatial indexes on geom columns for fast geographic queries
- Partial indexes on frequently filtered fields (status, severity, risk_level)
- Query optimization for 10km radius searches using ST_Distance

### Backend
- Connection pooling with SQLAlchemy
- Caching of frequently accessed data
- Async request handling with FastAPI

### Frontend
- React component optimization with React.memo
- Lazy loading of map components
- Efficient state management

## Security Considerations

### Production Deployment
1. Change default database credentials
2. Use environment variables for sensitive data
3. Enable HTTPS/SSL
4. Implement authentication (JWT tokens)
5. Add rate limiting
6. Use CORS properly with specific allowed origins
7. Implement input validation and sanitization
8. Add request logging and monitoring

### Example for Production
```yaml
# docker-compose.prod.yml modifications
services:
  backend:
    environment:
      DATABASE_URL: ${DATABASE_URL}  # Use environment variable
      SECRET_KEY: ${SECRET_KEY}
    restart: always
```

## Scaling Considerations

1. **Database**: Use read replicas for scaling queries
2. **Backend**: Run multiple instances behind a load balancer
3. **Frontend**: Deploy to CDN for faster delivery
4. **Caching**: Implement Redis for caching alert data
5. **Message Queue**: Use Celery for async alert generation
6. **Monitoring**: Add Prometheus and Grafana for metrics

## Contributing

To add new features or improvements:

1. Create a feature branch
2. Make changes with proper documentation
3. Test thoroughly
4. Submit a pull request with description

## License

This project is open source for disease surveillance purposes.

## Support & Documentation

- **API Docs**: http://localhost:8000/docs (Swagger UI)
- **ReDoc**: http://localhost:8000/redoc
- **GitHub**: Link to repository

## Authors

- Developed as a One Health Surveillance System prototype
- Based on CDC One Health principles
- Designed for early outbreak detection

## References

- CDC One Health: https://www.cdc.gov/onehealth/
- WHO Disease Surveillance: https://www.who.int/groups/technical-advisory-group-on-surveillance
- PostGIS Documentation: https://postgis.net/documentation/
- FastAPI Documentation: https://fastapi.tiangolo.com/
- React Documentation: https://react.dev/
