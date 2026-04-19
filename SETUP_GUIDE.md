# Quick Start Setup Guide

Get the One Health Surveillance System running in minutes.

## Prerequisites

- **Python**: 3.11 or higher
- **Node.js**: 16 or higher  
- **npm**: 8 or higher
- **Git**: For version control

## Installation Steps

### 1. Clone & Navigate to Project
```bash
cd one-health-surveillance
```

### 2. Backend Setup (Windows PowerShell)

#### Option A: Using Virtual Environment
```powershell
# Create virtual environment
cd backend
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run backend server
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### Option B: Direct Python
```powershell
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Backend will run at:** `http://localhost:8000`

### 3. Frontend Setup (New Terminal)

```powershell
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will run at:** `http://localhost:5173`

### 4. Access the Application

- **Dashboard**: http://localhost:5173
- **API Docs**: http://localhost:8000/docs
- **API Interactive UI**: http://localhost:8000/redoc

## Database

The system uses **SQLite** for local development:
- **Location**: `backend/one_health_surveillance.db`
- **Auto-initialized**: Database tables created on first run
- **No setup needed**: SQLite is built into Python

## Verify Everything Works

### Test Backend
```powershell
# In a new terminal
curl http://localhost:8000/health
# Should return: {"status":"operational"}
```

### Test Frontend
Open browser to `http://localhost:5173` and verify the dashboard loads.

## Stopping Services

### Backend
- Press `CTRL+C` in the backend terminal

### Frontend
- Press `CTRL+C` in the frontend terminal

## Troubleshooting

### Port Already in Use
```powershell
# Find process using port 8000
Get-NetTCPConnection -LocalPort 8000

# Kill the process
Stop-Process -Id <PID> -Force
```

### Dependencies Not Installing
```powershell
# Clear pip cache and reinstall
pip install --no-cache-dir -r requirements.txt
```

### Node Modules Issues
```powershell
# Clear node modules and reinstall
cd frontend
Remove-Item -Recurse node_modules
Remove-Item package-lock.json
npm install
```

## Environment Variables

Default settings are in `.env.example`. For local development, these work out of the box.

To customize, create a `.env` file in the project root:
```env
DATABASE_URL=sqlite:///./one_health_surveillance.db
API_HOST=0.0.0.0
API_PORT=8000
VITE_API_URL=http://localhost:8000/api
```

## Next Steps

1. ✅ Run the system
2. 📊 Access the Dashboard at http://localhost:5173
3. 📝 Submit test data via "Submit Data" tab
4. 🗺️ View data on the Map
5. 📖 Read [API_REFERENCE.md](API_REFERENCE.md) for API details

## Need Help?

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues and solutions.
