#!/bin/bash

# Task Manager - Development Setup Script

set -e

echo "🔧 Task Manager - Development Mode"
echo "==================================="

# Build and start development containers
echo "🔨 Building development images..."
docker-compose -f docker-compose.dev.yml build

echo "🚀 Starting development services..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for database
echo "⏳ Waiting for database..."
sleep 5

# Run migrations
echo "🔄 Running migrations..."
docker-compose -f docker-compose.dev.yml exec backend npx prisma migrate dev

# Seed database (optional)
read -p "Do you want to seed the database? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    docker-compose -f docker-compose.dev.yml exec backend npm run seed
fi

echo ""
echo "✅ Development environment ready!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo ""
echo "📝 Useful commands:"
echo "   View logs:     docker-compose -f docker-compose.dev.yml logs -f"
echo "   Stop services: docker-compose -f docker-compose.dev.yml down"