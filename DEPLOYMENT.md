# Deployment Guide - One Health Surveillance System

## Table of Contents
1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Cloud Deployment](#cloud-deployment)
4. [Production Hardening](#production-hardening)
5. [Monitoring & Maintenance](#monitoring--maintenance)

## Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15 with PostGIS
- Git

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd one-health-surveillance
```

### Step 2: Backend Setup

#### 1.1 Create Python Virtual Environment
```bash
cd backend
python -m venv venv

# Activate on Windows
venv\Scripts\activate

# Activate on macOS/Linux
source venv/bin/activate
```

#### 1.2 Install Dependencies
```bash
pip install -r requirements.txt
```

#### 1.3 Configure Database
```bash
# Set up PostgreSQL (assuming local installation)
createdb -U postgres one_health_surveillance
psql -U postgres -d one_health_surveillance < ../database/schema.sql
psql -U postgres -d one_health_surveillance < ../database/init.sql
```

#### 1.4 Set Environment Variables
Create `backend/.env`:
```
DATABASE_URL=postgresql://username:password@localhost:5432/one_health_surveillance
PYTHONUNBUFFERED=1
```

#### 1.5 Run Backend
```bash
python main.py
```
Backend will be available at `http://localhost:8000`

### Step 3: Frontend Setup

#### 3.1 Install Dependencies
```bash
cd frontend
npm install
```

#### 3.2 Run Development Server
```bash
npm run dev
```
Frontend will be available at `http://localhost:3000`

## Docker Deployment

### Prerequisites
- Docker Desktop installed
- At least 2GB RAM available
- Ports 3000, 8000, 5432 available

### Quick Start
```bash
# From project root
chmod +x setup.sh  # On macOS/Linux
./setup.sh         # or setup.bat on Windows

# Or manually:
docker-compose up -d --build
```

### Manual Build Steps

#### 1. Build Images
```bash
docker-compose build
```

#### 2. Start Services
```bash
docker-compose up -d
```

#### 3. Verify Services
```bash
docker-compose ps
```

Expected output:
```
NAME                    STATUS              PORTS
one_health_db          Up (healthy)        0.0.0.0:5432
one_health_backend     Up (running)        0.0.0.0:8000
one_health_frontend    Up (running)        0.0.0.0:3000
```

### Debugging Docker Issues

#### View Service Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Last 50 lines
docker-compose logs --tail=50 backend
```

#### Execute Commands in Container
```bash
# Database
docker-compose exec db psql -U surveillance_user -d one_health_surveillance

# Backend
docker-compose exec backend bash

# Frontend
docker-compose exec frontend sh
```

#### Restart Services
```bash
# Single service
docker-compose restart backend

# All services
docker-compose restart

# Complete restart (fresh)
docker-compose down
docker-compose up -d
```

### Clean Up Docker Resources
```bash
# Stop all services
docker-compose down

# Remove volumes
docker-compose down -v

# Remove images
docker-compose down --rmi all
```

## Cloud Deployment

### AWS ECS Deployment

#### Prerequisites
- AWS Account
- AWS CLI configured
- ECR repositories created

#### Step 1: Push Images to ECR
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Tag and push images
docker tag one-health-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/one-health-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/one-health-backend:latest

docker tag one-health-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/one-health-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/one-health-frontend:latest
```

#### Step 2: RDS Database
```bash
# Create RDS PostgreSQL instance with PostGIS
aws rds create-db-instance \
  --db-instance-identifier one-health-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.1 \
  --master-username admin \
  --master-user-password <password>

# After creation, enable PostGIS
psql -h <rds-endpoint> -U admin -d one_health_surveillance
CREATE EXTENSION postgis;
\i ../database/schema.sql
\i ../database/init.sql
```

#### Step 3: ECS Task Definition
Create `ecs-task-definition.json`:
```json
{
  "family": "one-health-surveillance",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/one-health-backend:latest",
      "portMappings": [{"containerPort": 8000}],
      "environment": [
        {
          "name": "DATABASE_URL",
          "value": "postgresql://admin:<password>@<rds-endpoint>:5432/one_health_surveillance"
        }
      ]
    },
    {
      "name": "frontend",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/one-health-frontend:latest",
      "portMappings": [{"containerPort": 3000}]
    }
  ]
}
```

#### Step 4: Create ECS Service
```bash
aws ecs create-cluster --cluster-name one-health
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json
aws ecs create-service \
  --cluster one-health \
  --service-name one-health-surveillance \
  --task-definition one-health-surveillance:1 \
  --desired-count 2 \
  --load-balancers targetGroupArn=<arn>,containerName=backend,containerPort=8000
```

### Azure Container Instances

```bash
# Create resource group
az group create --name one-health --location eastus

# Build and push to ACR
az acr login --name <registry-name>
docker tag one-health-backend:latest <registry-name>.azurecr.io/one-health-backend:latest
docker push <registry-name>.azurecr.io/one-health-backend:latest

# Deploy with Docker Compose
az container create \
  --resource-group one-health \
  --name one-health-app \
  --image-registry-username <username> \
  --image-registry-password <password> \
  --file docker-compose.yml
```

### Google Cloud Run

```bash
# Build with Cloud Build
gcloud builds submit --config cloudbuild.yaml

# Deploy services
gcloud run deploy one-health-backend \
  --image gcr.io/PROJECT_ID/one-health-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

gcloud run deploy one-health-frontend \
  --image gcr.io/PROJECT_ID/one-health-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## Production Hardening

### 1. Environment Configuration
```bash
# Create production .env
cat > .env.prod << EOF
# Database
DATABASE_URL=postgresql://<prod_user>:<prod_password>@<prod_host>:5432/one_health_surveillance

# API
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=false

# Security
SECRET_KEY=$(python -c 'import secrets; print(secrets.token_urlsafe(32))')
JWT_ALGORITHM=HS256

# CORS
CORS_ORIGINS=["https://yourdomain.com"]

# Logging
LOG_LEVEL=WARNING
EOF
```

### 2. Update docker-compose.prod.yml
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      DATABASE_URL: ${DATABASE_URL}
      SECRET_KEY: ${SECRET_KEY}
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1'
          memory: 1024M

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgis/postgis:15-3.3
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2048M
```

### 3. SSL/TLS Configuration
```nginx
# nginx.conf for reverse proxy
upstream backend {
    server backend:8000;
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 4. Database Backup Strategy
```bash
# Automated daily backup
0 2 * * * pg_dump -h <host> -U <user> <database> | gzip > /backups/one_health_$(date +\%Y\%m\%d).sql.gz

# Store in S3
aws s3 sync /backups/ s3://one-health-backups/
```

### 5. Rate Limiting
```python
# In main.py
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/api/human/reports")
@limiter.limit("10/minute")
def submit_human_report(request: Request, data: HumanDataCreate, db: Session = Depends(get_db)):
    ...
```

## Monitoring & Maintenance

### 1. Application Monitoring

#### Prometheus Metrics
```python
# Add to main.py
from prometheus_client import Counter, Histogram, generate_latest

alerts_generated = Counter('alerts_generated_total', 'Total alerts generated')
alert_duration = Histogram('alert_generation_duration_seconds', 'Alert generation duration')

@app.get("/metrics")
def metrics():
    return generate_latest()
```

#### Grafana Dashboards
```json
{
  "dashboard": {
    "title": "One Health Surveillance",
    "panels": [
      {
        "title": "Active Alerts",
        "targets": [{"expr": "alerts_generated_total{status='active'}"}]
      },
      {
        "title": "API Response Time",
        "targets": [{"expr": "histogram_quantile(0.95, http_request_duration_seconds)"}]
      }
    ]
  }
}
```

### 2. Log Aggregation

#### ELK Stack Setup
```bash
# docker-compose addition
logstash:
  image: docker.elastic.co/logstash/logstash:8.0.0
  environment:
    - "xpack.monitoring.enabled=false"
  volumes:
    - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf

kibana:
  image: docker.elastic.co/kibana/kibana:8.0.0
  ports:
    - "5601:5601"
```

### 3. Database Maintenance

#### Regular Tasks
```sql
-- Weekly vacuum
VACUUM ANALYZE human_data;
VACUUM ANALYZE animal_data;
VACUUM ANALYZE environmental_data;

-- Monthly index reindex
REINDEX INDEX idx_human_date;
REINDEX INDEX idx_animal_date;

-- Check table size
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 4. Security Updates

```bash
# Weekly container updates
docker pull postgis/postgis:15-3.3
docker pull python:3.11-slim
docker pull node:18-alpine

# Rebuild and redeploy
docker-compose build --pull
docker-compose up -d
```

### 5. Disaster Recovery

#### Database Backup & Restore
```bash
# Backup
pg_dump one_health_surveillance | gzip > backup-$(date +%Y%m%d).sql.gz

# Restore
gunzip -c backup-20240101.sql.gz | psql one_health_surveillance
```

#### Container Restart Policy
```yaml
services:
  backend:
    restart: always
  frontend:
    restart: always
  db:
    restart: always
```

## Troubleshooting Checklist

- [ ] All services running: `docker-compose ps`
- [ ] Backend health: `curl http://localhost:8000/health`
- [ ] Database connectivity: `docker-compose exec db psql -U surveillance_user -d one_health_surveillance -c "SELECT 1"`
- [ ] API documentation: `curl http://localhost:8000/docs`
- [ ] Frontend loading: Access `http://localhost:3000`
- [ ] No port conflicts: Check ports 3000, 8000, 5432
- [ ] Environment variables set: Check `.env` file
- [ ] Sufficient disk space: `docker system df`

## Support & Further Assistance

For issues or questions, refer to:
- `README.md` - Main documentation
- `ARCHITECTURE.md` - System design
- API Docs: `http://localhost:8000/docs`
- Backend logs: `docker-compose logs backend`
- Frontend console: Browser DevTools → Console tab
