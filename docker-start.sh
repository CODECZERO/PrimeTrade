#!/bin/bash

# Docker Start Script for Task Manager Application
# This script helps you quickly start the application using Docker

echo "🚀 Starting Task Manager Application with Docker..."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. Please update it with your configuration."
    echo ""
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "🐳 Building and starting Docker containers..."
docker-compose up --build -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "✅ Application started successfully!"
echo ""
echo "📍 Service URLs:"
echo "   Frontend:  http://localhost:3000"
echo "   Backend:   http://localhost:5000"
echo "   Database:  localhost:5432"
echo ""
echo "📝 Useful commands:"
echo "   View logs:        docker-compose logs -f"
echo "   Stop services:    docker-compose down"
echo "   Restart:          docker-compose restart"
echo "   View status:      docker-compose ps"
echo ""
echo "🔍 Check backend health: curl http://localhost:5000/health"
echo ""
