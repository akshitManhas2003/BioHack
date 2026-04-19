# Project Structure

Overview of the One Health Surveillance System file organization.

## Directory Layout

```
one-health-surveillance/
├── backend/                           # FastAPI Backend
│   ├── main.py                       # Application entry point
│   ├── requirements.txt               # Python dependencies
│   ├── Dockerfile                     # Docker configuration
│   ├── one_health_surveillance.db     # SQLite database (auto-created)
│   ├── app/
│   │   ├── __init__.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── models.py             # Database models (SQLAlchemy)
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── human_routes.py       # Human health endpoints
│   │   │   ├── animal_routes.py      # Animal health endpoints
│   │   │   ├── environmental_routes.py # Environmental endpoints
│   │   │   └── alert_routes.py       # Alert generation endpoints
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py            # Pydantic validation schemas
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── database.py           # Database configuration
│   │       └── alert_generator.py    # Alert logic
│   └── venv/                          # Virtual environment (optional)
│
├── frontend/                          # React + Vite Frontend
│   ├── package.json                  # npm dependencies
│   ├── vite.config.js                # Vite configuration
│   ├── tailwind.config.js            # Tailwind CSS config
│   ├── postcss.config.js             # PostCSS configuration
│   ├── index.html                    # HTML entry point
│   ├── Dockerfile                    # Docker configuration
│   ├── src/
│   │   ├── main.jsx                  # React entry point
│   │   ├── App.jsx                   # Main app component
│   │   ├── App.css                   # Global styles
│   │   ├── index.css                 # Base styles
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx         # Dashboard page
│   │   │   ├── DataSubmission.jsx    # Data submission forms
│   │   │   └── MapView.jsx           # Interactive map page
│   │   ├── components/
│   │   │   ├── AlertsList.jsx        # Alerts display
│   │   │   └── MapView.jsx           # Map component
│   │   ├── styles/
│   │   │   ├── Dashboard.css         # Dashboard styles
│   │   │   └── MapView.css           # Map styles
│   │   └── utils/                    # Utility functions
│   └── node_modules/                 # npm packages (auto-generated)
│
├── database/                         # Database scripts
│   ├── schema.sql                   # Database schema (PostgreSQL - legacy)
│   └── init.sql                     # Initial data (PostgreSQL - legacy)
│
├── docs/                            # Documentation files
│   ├── README.md                    # Main documentation
│   ├── SETUP_GUIDE.md              # Quick start guide
│   ├── ARCHITECTURE.md             # System architecture
│   ├── API_REFERENCE.md            # API documentation
│   ├── DEPLOYMENT.md               # Deployment guide
│   ├── PROJECT_STRUCTURE.md        # This file
│   ├── CONTRIBUTING.md             # Contribution guidelines
│   ├── TROUBLESHOOTING.md          # Troubleshooting guide
│   ├── UI_UX_IMPROVEMENTS.md       # UI/UX documentation
│   └── LICENSE                     # MIT License
│
├── configuration files
│   ├── docker-compose.yml          # Docker Compose configuration
│   ├── .gitignore                 # Git ignore rules
│   ├── .env.example               # Environment variables template
│   ├── setup.sh                   # Linux/Mac setup script
│   └── setup.bat                  # Windows setup script
│
└── Other files
    └── .dockerignore              # Docker ignore rules
```

## Key Files Explained

### Backend

| File | Purpose |
|------|---------|
| `main.py` | FastAPI application entry point with startup/shutdown logic |
| `requirements.txt` | Python package dependencies (FastAPI, SQLAlchemy, Pydantic) |
| `app/models/models.py` | SQLAlchemy database models (HumanData, AnimalData, etc.) |
| `app/routes/*.py` | API route handlers for different endpoints |
| `app/schemas/schemas.py` | Pydantic models for request/response validation |
| `app/utils/database.py` | SQLite database initialization and configuration |
| `app/utils/alert_generator.py` | Business logic for alert generation |
| `.dockerignore` | Files to exclude from Docker builds |
| `Dockerfile` | Docker image configuration for backend |

### Frontend

| File | Purpose |
|------|---------|
| `index.html` | HTML entry point with meta tags |
| `main.jsx` | React application entry point |
| `App.jsx` | Main application component with routing |
| `App.css` | Global CSS with animations and theme |
| `src/pages/*.jsx` | Full page components (Dashboard, DataSubmission, etc.) |
| `src/components/*.jsx` | Reusable components (AlertsList, MapView) |
| `src/styles/*.css` | Component-specific stylesheets |
| `package.json` | npm dependencies and scripts |
| `vite.config.js` | Vite build tool configuration |
| `tailwind.config.js` | Tailwind CSS configuration |
| `Dockerfile` | Docker image configuration for frontend |

### Configuration & Docs

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Orchestrates backend, frontend, and database containers |
| `.env.example` | Template for environment variables |
| `.gitignore` | Files to exclude from version control |
| `README.md` | Project overview and features |
| `SETUP_GUIDE.md` | Quick start instructions |
| `API_REFERENCE.md` | Complete API endpoint documentation |
| `ARCHITECTURE.md` | System design and components |
| `DEPLOYMENT.md` | Production deployment instructions |
| `TROUBLESHOOTING.md` | Common issues and solutions |
| `CONTRIBUTING.md` | Guidelines for contributors |
| `LICENSE` | MIT License information |

## Data Flow

```
User Interface (React)
    ↓
[API Calls via HTTP]
    ↓
FastAPI Backend (Python)
    ↓
[Query/Insert Operations]
    ↓
SQLite Database
```

## Component Relationships

```
Backend Routes:
├── /api/human/reports           → HumanData routes
├── /api/animal/reports          → AnimalData routes
├── /api/environmental/reports   → EnvironmentalData routes
└── /api/alerts/                 → Alert generation & retrieval

Frontend Pages:
├── Dashboard                     → View statistics & alerts
├── Data Submission              → Submit reports (3 tabs)
└── Map View                     → Geospatial visualization
```

## Database Tables

| Table | Purpose |
|-------|---------|
| `users` | Field worker authentication |
| `human_data` | Human health cases |
| `animal_data` | Animal health events |
| `environmental_data` | Environmental samples |
| `alert_events` | Generated alerts |
| `alert_history` | Alert status changes |

## Development Workflow

1. **Backend Changes**
   - Modify files in `backend/app/`
   - Changes auto-reload with `--reload` flag
   - Test via API docs at `http://localhost:8000/docs`

2. **Frontend Changes**
   - Modify files in `frontend/src/`
   - Changes auto-reload in dev server
   - Test in browser at `http://localhost:5173`

3. **Database Changes**
   - Modify models in `app/models/models.py`
   - Database auto-migrates on startup

## Environment

- **Backend**: Python 3.11 with FastAPI
- **Frontend**: React 18 with Vite
- **Database**: SQLite (local development)
- **Styling**: Tailwind CSS + custom CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Validation**: Pydantic

## Build Artifacts

After build, generated directories (ignore these):
- `backend/__pycache__/` - Python bytecode
- `backend/venv/` - Virtual environment
- `frontend/node_modules/` - npm packages
- `frontend/dist/` - Production build output
- `*.db` - SQLite database file

## Configuration Hierarchy

1. `.env` file (if exists)
2. `.env.example` defaults
3. Hardcoded defaults in code

## Adding New Features

### New API Endpoint
1. Create route in `backend/app/routes/`
2. Add Pydantic schema in `backend/app/schemas/`
3. Update `main.py` to include router
4. Test via Swagger UI

### New Database Model
1. Add class to `backend/app/models/models.py`
2. Run backend (auto-migrates)
3. Create routes for CRUD operations

### New Frontend Page
1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/App.jsx`
3. Add navigation link in header

## Version Control

Files tracked in Git:
- ✅ Source code
- ✅ Configuration templates
- ✅ Documentation
- ❌ Database files (*.db)
- ❌ Node modules
- ❌ Python cache
- ❌ Environment files

See `.gitignore` for complete list.

---

For setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)
For API details, see [API_REFERENCE.md](../API_REFERENCE.md)
