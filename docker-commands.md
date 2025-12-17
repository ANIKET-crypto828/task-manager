# Docker Commands Reference

## Production

### Build and Start
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Database Operations
```bash
# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Access database
docker-compose exec postgres psql -U taskmanager -d taskmanager

# Backup database
docker-compose exec postgres pg_dump -U taskmanager taskmanager > backup.sql

# Restore database
docker-compose exec -T postgres psql -U taskmanager taskmanager < backup.sql
```

### Container Management
```bash
# View running containers
docker-compose ps

# Restart a service
docker-compose restart backend

# View service logs
docker-compose logs -f backend

# Execute command in container
docker-compose exec backend sh

# Scale services (if needed)
docker-compose up -d --scale backend=3
```

## Development

### Build and Start Dev Environment
```bash
# Start development services
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down
```

### Development Commands
```bash
# Access backend shell
docker-compose -f docker-compose.dev.yml exec backend sh

# Run tests
docker-compose -f docker-compose.dev.yml exec backend npm test

# Seed database
docker-compose -f docker-compose.dev.yml exec backend npm run seed

# Generate Prisma Client
docker-compose -f docker-compose.dev.yml exec backend npx prisma generate
```

## Cleanup

### Remove Everything
```bash
# Stop and remove containers, volumes
docker-compose down -v

# Remove images
docker rmi taskmanager-backend taskmanager-frontend

# Full cleanup (use with caution)
docker system prune -a --volumes
```

### Partial Cleanup
```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune
```

## Troubleshooting

### View Container Status
```bash
# Check container status
docker-compose ps

# Check container health
docker inspect --format='{{.State.Health.Status}}' taskmanager-backend
```

### Debug Container Issues
```bash
# View container logs
docker-compose logs backend

# Access container shell
docker-compose exec backend sh

# Check environment variables
docker-compose exec backend env
```

### Network Issues
```bash
# List networks
docker network ls

# Inspect network
docker network inspect taskmanager-network

# Test connectivity
docker-compose exec backend ping postgres
```