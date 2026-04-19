#!/bin/bash

# One Health Surveillance System - Setup Script (Linux/macOS)

echo "=========================================="
echo "One Health Surveillance System - Setup"
echo "=========================================="
echo ""

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check for Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✓ Docker and Docker Compose found"
echo ""

# Create environment files if they don't exist
if [ ! -f backend/.env ]; then
    echo "Creating backend/.env file..."
    cat > backend/.env << EOF
DATABASE_URL=postgresql://surveillance_user:surveillance_password@db:5432/one_health_surveillance
PYTHONUNBUFFERED=1
EOF
    echo "✓ backend/.env created"
fi

echo ""
echo "Building and starting services..."
echo ""

# Build and start services
docker-compose up -d --build

echo ""
echo "Waiting for services to be ready..."
sleep 10

# Check if backend is ready
echo "Checking backend health..."
for i in {1..30}; do
    if curl -s http://localhost:8000/health > /dev/null; then
        echo "✓ Backend is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Backend did not start in time"
        exit 1
    fi
    echo "  Waiting... ($i/30)"
    sleep 1
done

echo ""
echo "=========================================="
echo "Setup Complete! Services are running:"
echo "=========================================="
echo ""
echo "📱 Frontend:  http://localhost:3000"
echo "🔧 API:       http://localhost:8000"
echo "📚 API Docs:  http://localhost:8000/docs"
echo "📊 ReDoc:     http://localhost:8000/redoc"
echo "🗄️  Database:  localhost:5432"
echo ""
echo "Database credentials:"
echo "  User: surveillance_user"
echo "  Password: surveillance_password"
echo "  Database: one_health_surveillance"
echo ""
echo "Useful commands:"
echo "  View logs:     docker-compose logs -f"
echo "  Stop services: docker-compose down"
echo "  Restart:       docker-compose restart"
echo ""
