# 🐳 Docker Quick Start Guide

Get the Basement Inventory app running with Docker in under 2 minutes!

## Prerequisites

- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose (included with Docker Desktop)
- Git

## 🚀 Quick Start

### 1. Clone & Start

```bash
git clone https://github.com/tjdrabek/basement-inventory.git
cd basement-inventory
docker-compose up -d
```

### 2. Access Application

Open your browser to: **http://localhost:3000**

That's it! The application is now running with:

- ✅ Database automatically initialized
- ✅ Data persisted in Docker volumes
- ✅ QR code generation ready
- ✅ Production-optimized build

## 📋 Docker Commands

```bash
# Start the application
docker-compose up -d

# View live logs
docker-compose logs -f

# Stop the application
docker-compose down

# Update and restart
git pull
docker-compose up --build -d

# Complete reset (⚠️ deletes all data)
docker-compose down -v
docker-compose up --build -d
```

## ⚙️ Customization

### Change Port

Edit `docker-compose.yml`:

```yaml
ports:
  - "3001:3000" # Use port 3001 instead
```

### Custom Environment

```bash
# Create custom Docker environment
npm run docker:setup

# Edit settings (use your preferred editor)
# Windows: notepad .env.docker
# macOS/Linux: nano .env.docker or vim .env.docker
notepad .env.docker

# Restart with new settings
docker-compose down
docker-compose up -d
```

### Access Container

```bash
# Get a shell inside the container
docker-compose exec basement-inventory-app sh

# Run database commands
docker-compose exec basement-inventory-app npm run db:studio
```

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Check what's using port 3000
# Windows
netstat -ano | findstr :3000

# macOS/Linux
lsof -i :3000

# Change port in docker-compose.yml
```

### Container Won't Start

```bash
# Check container status
docker-compose ps

# View detailed logs
docker-compose logs basement-inventory-app

# Rebuild from scratch
docker-compose down
docker system prune -f
docker-compose up --build
```

### Database Issues

```bash
# Reset database (keeps container)
docker-compose exec basement-inventory-app npm run db:push

# Complete database reset
docker volume rm basement-inventory_basement_inventory_data
docker-compose up -d
```

### Performance Issues

```bash
# Check resource usage
docker stats

# Allocate more memory to Docker Desktop
# Settings > Resources > Advanced
```

## 📊 Data Management

### Backup Data

```bash
# Backup database volume
docker run --rm -v basement-inventory_basement_inventory_data:/data -v $(pwd):/backup alpine tar czf /backup/database-backup.tar.gz -C /data .

# Backup QR codes
docker run --rm -v basement-inventory_basement_inventory_qr:/data -v $(pwd):/backup alpine tar czf /backup/qr-backup.tar.gz -C /data .
```

### Restore Data

```bash
# Stop application
docker-compose down

# Restore database
docker run --rm -v basement-inventory_basement_inventory_data:/data -v $(pwd):/backup alpine tar xzf /backup/database-backup.tar.gz -C /data

# Start application
docker-compose up -d
```

### View Data Location

```bash
# Find volume location
docker volume inspect basement-inventory_basement_inventory_data

# List all volumes
docker volume ls | grep basement
```

## 🌐 Production Deployment

For production deployment:

1. Use environment variables for URLs
2. Set up reverse proxy (nginx)
3. Enable SSL/HTTPS
4. Regular database backups
5. Monitor logs and health checks

Example nginx config:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📞 Need Help?

1. Check the main [README.md](README.md) for detailed documentation
2. Review [SETUP.md](SETUP.md) for troubleshooting
3. Open an issue on GitHub
4. Try the local development setup instead of Docker
