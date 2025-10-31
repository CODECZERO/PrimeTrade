# Docker Deployment Guide

This guide covers how to run the Task Manager application using Docker, both locally and on Render.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start (Local)](#quick-start-local)
- [Manual Docker Setup](#manual-docker-setup)
- [Deploy to Render](#deploy-to-render)
- [Docker Files Overview](#docker-files-overview)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Docker Desktop installed ([Download](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)
- Git (for deployment to Render)

## Quick Start (Local)

### Option 1: Using the Start Script (Recommended)

```bash
# Make the script executable (if not already)
chmod +x docker-start.sh

# Run the script
./docker-start.sh
```

### Option 2: Using Docker Compose Directly

```bash
# Start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up --build -d
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: localhost:5432

## Manual Docker Setup

### 1. Build Individual Services

#### Backend
```bash
cd server
docker build -t taskmanager-backend .
docker run -p 5000:5000 \
  -e DATABASE_URL="postgresql://postgres:postgres123@host.docker.internal:5432/taskmanager_db" \
  -e JWT_ACCESS_SECRET="your_secret_here" \
  -e JWT_REFRESH_SECRET="your_refresh_secret_here" \
  taskmanager-backend
```

#### Frontend
```bash
cd frontend
docker build -t taskmanager-frontend .
docker run -p 3000:3000 \
  -e VITE_API_URL="http://localhost:5000/api/v1" \
  taskmanager-frontend
```

### 2. Using Docker Compose

The `docker-compose.yml` file orchestrates all services:

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes database data)
docker-compose down -v
```

## Deploy to Render

### Method 1: Using Blueprint (render.yaml) - Recommended

1. **Prepare your repository**
   ```bash
   git add .
   git commit -m "Add Docker configuration for Render"
   git push origin main
   ```

2. **Deploy on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Blueprint"
   - Connect your Git repository
   - Render will detect `render.yaml` and create all services
   - Click "Apply" to deploy

3. **Wait for deployment** (5-10 minutes)
   - Database will be created first
   - Backend will build and deploy
   - Frontend will build and deploy

4. **Access your application**
   - Frontend URL: `https://taskmanager-frontend.onrender.com`
   - Backend URL: `https://taskmanager-backend.onrender.com`

### Method 2: Manual Deployment

See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for detailed step-by-step instructions.

## Docker Files Overview

### Project Structure

```
Project/
├── server/
│   ├── Dockerfile              # Backend Docker configuration
│   ├── .dockerignore          # Files to exclude from Docker build
│   └── ...
├── frontend/
│   ├── Dockerfile              # Frontend Docker configuration
│   ├── .dockerignore          # Files to exclude from Docker build
│   ├── nginx.conf             # Nginx web server configuration
│   └── ...
├── docker-compose.yml          # Multi-container orchestration
├── docker-compose.dev.yml      # Development configuration
├── render.yaml                 # Render deployment blueprint
├── docker-start.sh            # Quick start script
└── .env.example               # Environment variables template
```

### Backend Dockerfile

**Features:**
- Multi-stage build for smaller image size
- Automatic Prisma client generation
- Database migration on startup
- Health check endpoint
- Production-optimized dependencies

**Build stages:**
1. **Builder**: Compiles TypeScript and generates Prisma client
2. **Production**: Minimal runtime image with only production dependencies

### Frontend Dockerfile

**Features:**
- Multi-stage build with Vite
- Nginx for serving static files
- Dynamic port configuration for Render
- Gzip compression enabled
- SPA routing support

### docker-compose.yml

**Services:**
- `postgres`: PostgreSQL 15 database
- `backend`: Node.js API server
- `frontend`: React app with Nginx

**Features:**
- Health checks for all services
- Automatic service dependencies
- Volume persistence for database
- Network isolation

## Environment Variables

### Backend (.env)

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/taskmanager_db
JWT_ACCESS_SECRET=your_32_char_secret_here
JWT_REFRESH_SECRET=your_32_char_secret_here
JWT_ACCESS_EXPIRY=1d
JWT_REFRESH_EXPIRY=10d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api/v1
```

## Common Docker Commands

### Container Management

```bash
# List running containers
docker ps

# List all containers
docker ps -a

# Stop a container
docker stop <container_id>

# Remove a container
docker rm <container_id>

# View container logs
docker logs <container_id>

# Follow logs in real-time
docker logs -f <container_id>

# Execute command in running container
docker exec -it <container_id> sh
```

### Image Management

```bash
# List images
docker images

# Remove an image
docker rmi <image_id>

# Remove unused images
docker image prune

# Remove all unused data
docker system prune -a
```

### Docker Compose Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs

# Follow logs
docker-compose logs -f

# Restart a service
docker-compose restart backend

# Rebuild and start
docker-compose up --build

# Scale a service
docker-compose up --scale backend=3
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change port in docker-compose.yml
ports:
  - "5001:5000"  # Use 5001 instead
```

### Database Connection Issues

```bash
# Check if database is running
docker-compose ps

# View database logs
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d postgres
```

### Build Failures

```bash
# Clear Docker cache and rebuild
docker-compose build --no-cache

# Remove all containers and rebuild
docker-compose down
docker-compose up --build
```

### Container Crashes

```bash
# View container logs
docker-compose logs backend

# Check container status
docker-compose ps

# Restart specific service
docker-compose restart backend
```

### Permission Issues

```bash
# Fix permissions on Linux
sudo chown -R $USER:$USER .

# Or run Docker commands with sudo
sudo docker-compose up
```

### Out of Disk Space

```bash
# Remove unused containers, images, and volumes
docker system prune -a --volumes

# Check disk usage
docker system df
```

## Performance Optimization

### Production Best Practices

1. **Use multi-stage builds** (already implemented)
2. **Minimize layer count** - combine RUN commands
3. **Use .dockerignore** - exclude unnecessary files
4. **Pin dependency versions** - ensure reproducible builds
5. **Use health checks** - enable automatic recovery
6. **Set resource limits** - prevent resource exhaustion

### Example Resource Limits

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

## Security Considerations

1. **Never commit .env files** - use .env.example instead
2. **Use secrets for sensitive data** - especially in production
3. **Keep base images updated** - regularly rebuild with latest patches
4. **Scan images for vulnerabilities**:
   ```bash
   docker scan taskmanager-backend
   ```
5. **Run as non-root user** - add to Dockerfile:
   ```dockerfile
   USER node
   ```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Render Docker Documentation](https://render.com/docs/docker)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Prisma Docker Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-docker)

## Support

For issues specific to:
- **Docker setup**: Check [Docker Troubleshooting](#troubleshooting)
- **Render deployment**: See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)
- **Application bugs**: Create an issue in the repository

## License

This project is licensed under the MIT License.
