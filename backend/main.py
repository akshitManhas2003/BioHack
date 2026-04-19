"""
One Health Surveillance System - FastAPI Backend
Main application entry point
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.utils.database import init_db
from app.routes import human_routes, animal_routes, environmental_routes, alert_routes

# Lifespan context manager for startup and shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup event
    try:
        init_db()
        print("Database initialized successfully")
    except Exception as e:
        print(f"Error initializing database: {e}")
    yield
    # Shutdown event (cleanup if needed)

# Create FastAPI application with lifespan
app = FastAPI(
    title="One Health Surveillance System API",
    description="Integrated human, animal, and environmental disease surveillance platform",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(human_routes.router)
app.include_router(animal_routes.router)
app.include_router(environmental_routes.router)
app.include_router(alert_routes.router)


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "One Health Surveillance System API"
    }


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "name": "One Health Surveillance System API",
        "version": "1.0.0",
        "description": "Integrated surveillance platform for human, animal, and environmental health data",
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "redoc": "/redoc",
            "human_data": "/api/human",
            "animal_data": "/api/animal",
            "environmental_data": "/api/environmental",
            "alerts": "/api/alerts"
        }
    }


# Error handlers
@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions"""
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)},
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
