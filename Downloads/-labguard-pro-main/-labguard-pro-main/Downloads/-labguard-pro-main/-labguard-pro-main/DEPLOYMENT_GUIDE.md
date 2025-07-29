# LabGuard Pro - Enterprise Deployment Guide

## 🚀 **DEPLOYMENT OVERVIEW**

This guide provides comprehensive instructions for deploying LabGuard Pro in enterprise environments, including production, staging, and development deployments.

## 📋 **PREREQUISITES**

### **System Requirements**
- Node.js 18+ 
- PostgreSQL 14+
- Redis 6+ (for rate limiting and caching)
- Docker 20+ (optional, for containerized deployment)
- Nginx 1.20+ (for reverse proxy)

### **Infrastructure Requirements**
- **CPU**: Minimum 4 cores, Recommended 8+ cores
- **RAM**: Minimum 8GB, Recommended 16GB+
- **Storage**: Minimum 100GB SSD, Recommended 500GB+
- **Network**: High-speed internet connection
- **SSL Certificate**: Valid SSL certificate for HTTPS

### **Security Requirements**
- Firewall configuration
- VPN access (if required)
- Database encryption at rest
- Network segmentation
- Regular security updates

## 🔧 **ENVIRONMENT SETUP**

### **1. Environment Variables**

Create `.env.production` file:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/labguard_pro"
DATABASE_POOL_SIZE=20
DATABASE_TIMEOUT=30000

# Authentication
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_JWT_SECRET="your-jwt-secret-here"

# API Configuration
API_BASE_URL="https://your-domain.com/api"
NEXT_PUBLIC_API_URL="https://your-domain.com"

# AI Services
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"

# Email Service
SMTP_HOST="smtp.your-provider.com"
SMTP_PORT=587
SMTP_USER="your-email@domain.com"
SMTP_PASS="your-email-password"
EMAIL_FROM="noreply@your-domain.com"

# File Storage
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-s3-bucket"

# Monitoring
SENTRY_DSN="your-sentry-dsn"
LOG_LEVEL="info"

# Rate Limiting
REDIS_URL="redis://localhost:6379"
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
CORS_ORIGIN="https://your-domain.com"
JWT_SECRET="your-jwt-secret"
ENCRYPTION_KEY="your-encryption-key"
```

### **2. Database Setup**

```sql
-- Create database
CREATE DATABASE labguard_pro;

-- Create user
CREATE USER labguard_user WITH PASSWORD 'secure_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE labguard_pro TO labguard_user;

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### **3. Redis Setup**

```bash
# Install Redis
sudo apt-get update
sudo apt-get install redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf

# Set password
requirepass your_redis_password

# Enable persistence
save 900 1
save 300 10
save 60 10000

# Restart Redis
sudo systemctl restart redis
```

## 🐳 **DOCKER DEPLOYMENT**

### **1. Docker Compose Configuration**

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.prod
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://labguard_user:secure_password@db:5432/labguard_pro
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    restart: unless-stopped
    networks:
      - labguard-network

  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=labguard_pro
      - POSTGRES_USER=labguard_user
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped
    networks:
      - labguard-network

  redis:
    image: redis:6-alpine
    command: redis-server --requirepass your_redis_password
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    restart: unless-stopped
    networks:
      - labguard-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - labguard-network

volumes:
  postgres_data:
  redis_data:

networks:
  labguard-network:
    driver: bridge
```

### **2. Nginx Configuration**

Create `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        # SSL configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Security headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

        # Rate limiting for login
        location /api/auth/ {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Rate limiting for API
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static files
        location /_next/static/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            proxy_pass http://app;
        }

        # Main application
        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_read_timeout 60s;
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
        }
    }
}
```

### **3. Production Dockerfile**

Create `Dockerfile.prod`:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY apps/backend/package*.json ./apps/backend/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/package*.json ./
COPY --from=builder /app/apps/web/next.config.js ./

# Set ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["npm", "start"]
```

## 🚀 **DEPLOYMENT STEPS**

### **1. Initial Setup**

```bash
# Clone repository
git clone https://github.com/your-org/labguard-pro.git
cd labguard-pro

# Create production environment file
cp .env.example .env.production
nano .env.production

# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed initial data (if needed)
npm run db:seed
```

### **2. Docker Deployment**

```bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d

# Check service status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f app
```

### **3. Manual Deployment**

```bash
# Build application
npm run build

# Start production server
npm start

# Or use PM2 for process management
npm install -g pm2
pm2 start npm --name "labguard-pro" -- start
pm2 save
pm2 startup
```

## 📊 **MONITORING & LOGGING**

### **1. Application Monitoring**

```bash
# Install monitoring tools
npm install -g pm2
npm install -g @sentry/cli

# Configure PM2 monitoring
pm2 install pm2-server-monit
pm2 install pm2-logrotate

# Set up log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

### **2. Database Monitoring**

```sql
-- Create monitoring user
CREATE USER monitoring_user WITH PASSWORD 'monitoring_password';
GRANT CONNECT ON DATABASE labguard_pro TO monitoring_user;
GRANT USAGE ON SCHEMA public TO monitoring_user;

-- Create monitoring queries
CREATE VIEW active_connections AS
SELECT count(*) as connection_count 
FROM pg_stat_activity 
WHERE datname = 'labguard_pro';

CREATE VIEW slow_queries AS
SELECT query, mean_time, calls 
FROM pg_stat_statements 
WHERE mean_time > 1000 
ORDER BY mean_time DESC;
```

### **3. Log Aggregation**

```bash
# Install ELK Stack (Elasticsearch, Logstash, Kibana)
# Or use cloud services like DataDog, New Relic, etc.

# Configure log shipping
# Example with rsyslog
sudo nano /etc/rsyslog.conf

# Add to rsyslog.conf
*.* @@log-server:514
```

## 🔒 **SECURITY HARDENING**

### **1. Firewall Configuration**

```bash
# UFW firewall setup
sudo ufw enable
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 5432/tcp  # PostgreSQL (if external access needed)
sudo ufw allow 6379/tcp  # Redis (if external access needed)
```

### **2. SSL Certificate Setup**

```bash
# Using Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### **3. Database Security**

```sql
-- Enable SSL for PostgreSQL
ALTER SYSTEM SET ssl = on;
ALTER SYSTEM SET ssl_cert_file = '/path/to/server.crt';
ALTER SYSTEM SET ssl_key_file = '/path/to/server.key';

-- Restrict connections
ALTER SYSTEM SET listen_addresses = 'localhost';
ALTER SYSTEM SET max_connections = 100;

-- Reload configuration
SELECT pg_reload_conf();
```

## 🔄 **BACKUP & RECOVERY**

### **1. Database Backup**

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="labguard_pro"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
pg_dump -h localhost -U labguard_user -d $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Keep only last 30 days of backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
EOF

chmod +x backup.sh

# Add to crontab
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

### **2. Application Backup**

```bash
# Backup application files
tar -czf /backups/app_$(date +%Y%m%d_%H%M%S).tar.gz /app

# Backup configuration
cp .env.production /backups/env_$(date +%Y%m%d_%H%M%S).backup
```

### **3. Recovery Procedures**

```bash
# Database recovery
psql -h localhost -U labguard_user -d labguard_pro < backup_20241201_120000.sql

# Application recovery
tar -xzf app_20241201_120000.tar.gz -C /
cp env_20241201_120000.backup .env.production
```

## 📈 **PERFORMANCE OPTIMIZATION**

### **1. Database Optimization**

```sql
-- Analyze and vacuum
ANALYZE;
VACUUM FULL;

-- Create indexes for common queries
CREATE INDEX idx_equipment_status ON equipment(status);
CREATE INDEX idx_calibrations_due_date ON calibrations(due_date);
CREATE INDEX idx_users_email ON users(email);

-- Configure PostgreSQL
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
```

### **2. Application Optimization**

```bash
# Enable compression
npm install compression

# Enable caching
npm install redis

# Optimize images
npm install sharp

# Enable CDN
# Configure your CDN provider (Cloudflare, AWS CloudFront, etc.)
```

## 🚨 **TROUBLESHOOTING**

### **Common Issues**

1. **Database Connection Issues**
   ```bash
   # Check database status
   sudo systemctl status postgresql
   
   # Check connection
   psql -h localhost -U labguard_user -d labguard_pro
   ```

2. **Memory Issues**
   ```bash
   # Check memory usage
   free -h
   
   # Check process memory
   ps aux --sort=-%mem | head -10
   ```

3. **Performance Issues**
   ```bash
   # Check CPU usage
   top
   
   # Check disk I/O
   iostat -x 1
   
   # Check network
   netstat -i
   ```

### **Log Analysis**

```bash
# Application logs
tail -f /var/log/labguard-pro/app.log

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Database logs
tail -f /var/log/postgresql/postgresql-14-main.log
```

## 📞 **SUPPORT & MAINTENANCE**

### **Contact Information**
- **Technical Support**: support@labguard-pro.com
- **Emergency Contact**: +1-800-LABGUARD
- **Documentation**: https://docs.labguard-pro.com

### **Maintenance Schedule**
- **Daily**: Database backups, log rotation
- **Weekly**: Security updates, performance monitoring
- **Monthly**: Full system backup, security audit
- **Quarterly**: Performance optimization, capacity planning

### **Update Procedures**

```bash
# Application updates
git pull origin main
npm install
npm run build
pm2 restart labguard-pro

# Database migrations
npm run db:migrate

# Security updates
sudo apt-get update && sudo apt-get upgrade
```

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Author**: LabGuard Pro Team 