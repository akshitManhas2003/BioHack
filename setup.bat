@echo off
REM One Health Surveillance System - Setup Script (Windows)

echo.
echo ==========================================
echo One Health Surveillance System - Setup
echo ==========================================
echo.

REM Check for Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo X Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check for Docker Compose
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo X Docker Compose is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

echo Successfully found Docker and Docker Compose
echo.

REM Create backend environment file if it doesn't exist
if not exist "backend\.env" (
    echo Creating backend\.env file...
    (
        echo DATABASE_URL=postgresql://surveillance_user:surveillance_password@db:5432/one_health_surveillance
        echo PYTHONUNBUFFERED=1
    ) > backend\.env
    echo Successfully created backend\.env
)

echo.
echo Building and starting services...
echo.

REM Build and start services
docker-compose up -d --build

echo.
echo Waiting for services to be ready...
timeout /t 10 /nobreak

echo.
echo Checking backend health...
setlocal enabledelayedexpansion
for /l %%i in (1,1,30) do (
    curl -s http://localhost:8000/health >nul 2>&1
    if !errorlevel! equ 0 (
        echo Successfully verified Backend is ready
        goto :ready
    )
    if %%i lss 30 (
        echo Waiting... (%%i/30)
        timeout /t 1 /nobreak >nul
    )
)
echo X Backend did not start in time
pause
exit /b 1

:ready
echo.
echo ==========================================
echo Setup Complete! Services are running:
echo ==========================================
echo.
echo Frontend:  http://localhost:3000
echo API:       http://localhost:8000
echo API Docs:  http://localhost:8000/docs
echo ReDoc:     http://localhost:8000/redoc
echo Database:  localhost:5432
echo.
echo Database credentials:
echo   User: surveillance_user
echo   Password: surveillance_password
echo   Database: one_health_surveillance
echo.
echo Useful commands:
echo   View logs:     docker-compose logs -f
echo   Stop services: docker-compose down
echo   Restart:       docker-compose restart
echo.
pause
