# Troubleshooting Guide

Common issues and solutions for the One Health Surveillance System.

## Backend Issues

### 1. Database Connection Error

**Error**: `Error initializing database: connection refused`

**Cause**: Database service not running or SQLite file permissions

**Solutions**:
```powershell
# Check if file exists
Test-Path .\backend\one_health_surveillance.db

# If missing, backend will create it on startup

# If permission denied, fix permissions:
icacls .\backend\one_health_surveillance.db /grant:r "%USERNAME%:F"

# Restart backend server
```

### 2. Port Already in Use

**Error**: `Address already in use: ('0.0.0.0', 8000)`

**Cause**: Another process using port 8000

**Solutions**:
```powershell
# Find process using port 8000
Get-NetTCPConnection -LocalPort 8000

# Kill the process
Stop-Process -Id <PID> -Force

# Or use different port
python -m uvicorn main:app --port 8001
```

### 3. Module Not Found

**Error**: `ModuleNotFoundError: No module named 'fastapi'`

**Cause**: Dependencies not installed

**Solutions**:
```powershell
# Verify virtual environment is activated
# You should see (venv) in command prompt

# Reinstall dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Check installation
pip list | findstr fastapi
```

### 4. Import Errors in app/models

**Error**: `No module named 'geoalchemy2'`

**Cause**: Old requirements from PostgreSQL setup

**Solution**:
```powershell
# Verify you're using updated requirements.txt
cat requirements.txt

# Should contain:
# fastapi==0.104.1
# sqlalchemy==2.0.23
# pydantic==2.5.0
# (NOT geoalchemy2 or psycopg2)

# Reinstall
pip install -r requirements.txt
```

### 5. API Endpoints Returning 404

**Error**: `GET /api/human/reports HTTP/1.1" 404`

**Cause**: Routes not properly included in main.py

**Solution**:
```python
# Check main.py includes all routers:
from app.routes import human_routes, animal_routes, environmental_routes, alert_routes

app.include_router(human_routes.router)
app.include_router(animal_routes.router)
app.include_router(environmental_routes.router)
app.include_router(alert_routes.router)
```

### 6. Slow API Response

**Cause**: Large database queries or heavy processing

**Solutions**:
```python
# Add query optimization
from sqlalchemy import select

# Use indexes (defined in models)
# Add pagination for list endpoints

# Check query performance
# Enable SQLAlchemy echo=True in database.py
```

## Frontend Issues

### 1. npm Install Fails

**Error**: `npm ERR! code ERESOLVE`

**Cause**: Dependency conflict or npm cache issue

**Solutions**:
```powershell
# Clear npm cache
npm cache clean --force

# Update npm
npm install -g npm@latest

# Use legacy peer deps
npm install --legacy-peer-deps

# Or remove node_modules and reinstall
Remove-Item -Recurse node_modules
Remove-Item package-lock.json
npm install
```

### 2. Vite Development Server Won't Start

**Error**: `error: listen EADDRINUSE: address already in use :::5173`

**Cause**: Port 5173 already in use

**Solutions**:
```powershell
# Find process using port 5173
Get-NetTCPConnection -LocalPort 5173

# Kill process
Stop-Process -Id <PID> -Force

# Or specify different port
npm run dev -- --port 5174
```

### 3. API Calls Returning 404

**Error**: `GET http://localhost:8000/api/... 404`

**Cause**: Backend not running or wrong API URL

**Solutions**:
```powershell
# Ensure backend is running (on port 8000)
# Check VITE_API_URL in .env or environment

# Verify backend
curl http://localhost:8000/health

# Check browser console for actual URL being called
```

### 4. Styling Not Applied

**Cause**: Tailwind CSS not processing styles

**Solutions**:
```powershell
# Rebuild CSS
npm run build

# Check tailwind.config.js includes all template paths

# Clear .next or dist directory
Remove-Item -Recurse dist
npm run build
```

### 5. Components Not Updating

**Cause**: React state not properly updated

**Solutions**:
```javascript
// Use functional updates
setForm(prev => ({ ...prev, field: value }))

// Check useEffect dependencies
useEffect(() => { ... }, [dependency])

// Verify key props in lists
items.map(item => <Component key={item.id} />)
```

### 6. CORS Errors in Console

**Error**: `Access to XMLHttpRequest from 'localhost:5173' has been blocked by CORS policy`

**Cause**: Backend CORS not configured for frontend URL

**Solution**:
```python
# In main.py, update CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Common Workflow Issues

### 1. Can't Activate Virtual Environment

**Error**: `File cannot be loaded because running scripts is disabled`

**Solution**:
```powershell
# Allow script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then activate venv
.\backend\venv\Scripts\Activate.ps1
```

### 2. Changes Not Reflecting

**Backend**:
- Ensure `--reload` flag is set
- Check for syntax errors in code
- Restart server if model changes

**Frontend**:
- Hard refresh: `Ctrl+Shift+R` or `Cmd+Shift+R`
- Clear browser cache
- Check if dev server auto-reload is enabled

### 3. Database File Too Large

**Cause**: Lots of test data accumulated

**Solution**:
```powershell
# Backup first
Copy-Item one_health_surveillance.db one_health_surveillance.db.backup

# Delete database
Remove-Item one_health_surveillance.db

# Backend will recreate empty database on restart
```

### 4. Git Merge Conflicts

**Cause**: Concurrent edits to same files

**Solution**:
```bash
# View conflicts
git diff

# Resolve conflicts in editor
# Mark as resolved
git add <file>

# Complete merge
git commit -m "Resolve merge conflicts"
```

## Performance Issues

### 1. Slow Dashboard Loading

**Cause**: Too much data or inefficient queries

**Solutions**:
- Add pagination to data lists
- Implement lazy loading for charts
- Add caching for dashboard stats
- Optimize database indexes

### 2. Frontend Bundle Too Large

**Cause**: Unnecessary dependencies

**Solutions**:
```powershell
# Analyze bundle
npm run build --analyze

# Remove unused dependencies
npm prune

# Use code splitting
```

### 3. Database Queries Slow

**Solutions**:
- Add database indexes
- Optimize SQL queries
- Implement query caching
- Archive old data

## Data Issues

### 1. Lost Database

**Cause**: Accidental deletion

**Solution**:
```powershell
# If backup exists
Copy-Item one_health_surveillance.db.backup one_health_surveillance.db

# Otherwise, backend creates new database
# Any previous data is lost
```

### 2. Duplicate Data

**Cause**: Form submission twice or data sync issues

**Solution**:
```python
# Add unique constraints in database model
case_id = Column(String(50), unique=True, nullable=False)

# Add form submission debounce
```

### 3. Data Not Showing on Map

**Cause**: Invalid coordinates or map library issues

**Solutions**:
- Verify latitude/longitude values (-90 to 90, -180 to 180)
- Check if map library is loaded
- Test with known coordinates

## Getting Help

If your issue isn't listed:

1. **Check Logs**
   ```powershell
   # Backend logs in terminal
   # Frontend console: F12 → Console tab
   ```

2. **Search Issues**
   - GitHub Issues
   - Stack Overflow (tag your technology)
   - Project documentation

3. **Create Issue**
   - Include error message
   - Provide steps to reproduce
   - Share environment info
   - Attach relevant logs

4. **Contact Support**
   - Email: support@onehealth.example
   - Discord: [Project community channel]

## Quick Reference

### Common Commands

```powershell
# Backend
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev

# Testing
pytest backend/
npm test  # frontend
```

### Port Reference

| Service | Port | URL |
|---------|------|-----|
| Backend | 8000 | http://localhost:8000 |
| Frontend | 5173 | http://localhost:5173 |
| API Docs | 8000 | http://localhost:8000/docs |
| Database | - | SQLite (local file) |

### File Locations

| Item | Location |
|------|----------|
| Backend Code | `backend/app/` |
| Frontend Code | `frontend/src/` |
| Database | `backend/one_health_surveillance.db` |
| Environment | `.env` (or `.env.example`) |
| Logs | Terminal output |

---

**Still stuck?** Check [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) or open an issue on GitHub.
