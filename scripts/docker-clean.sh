#!/bin/bash

# Task Manager - Docker Cleanup Script

set -e

echo "🧹 Task Manager - Docker Cleanup"
echo "================================="

read -p "⚠️  This will remove all containers, volumes, and images. Continue? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🛑 Stopping all services..."
    docker-compose down -v
    docker-compose -f docker-compose.dev.yml down -v 2>/dev/null || true
    
    echo "🗑️  Removing images..."
    docker rmi taskmanager-backend taskmanager-frontend 2>/dev/null || true
    
    echo "🧹 Pruning Docker system..."
    docker system prune -f
    
    echo "✅ Cleanup complete!"
else
    echo "❌ Cleanup cancelled."
fi