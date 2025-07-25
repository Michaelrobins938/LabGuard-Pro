#!/bin/bash

# LabGuard Pro Production Deployment Script
# This script handles the complete deployment process for production

set -e

# Configuration
DEPLOYMENT_ENV="production"
DOCKER_COMPOSE_FILE="docker-compose.prod.yml"
BACKUP_BEFORE_DEPLOY=true
HEALTH_CHECK_TIMEOUT=300
ROLLBACK_ENABLED=true
SLACK_NOTIFICATIONS=true

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Load environment variables
load_env() {
    log "Loading environment variables..."
    if [ -f "env.production" ]; then
        export $(cat env.production | grep -v '^#' | xargs)
        success "Environment variables loaded"
    else
        error "Environment file not found: env.production"
        exit 1
    fi
}

# Pre-deployment checks
pre_deployment_checks() {
    log "Running pre-deployment checks..."
    
    # Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        error "Docker is not running"
        exit 1
    fi
    
    # Check if Docker Compose is available
    if ! docker-compose --version >/dev/null 2>&1; then
        error "Docker Compose is not available"
        exit 1
    fi
    
    # Check if required files exist
    local required_files=("$DOCKER_COMPOSE_FILE" "env.production")
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            error "Required file not found: $file"
            exit 1
        fi
    done
    
    # Check disk space
    local available_space=$(df / | awk 'NR==2 {print $4}')
    if [ "$available_space" -lt 10485760 ]; then # 10GB
        warning "Low disk space: ${available_space}KB available"
    fi
    
    # Check memory
    local available_memory=$(free -m | awk 'NR==2 {print $7}')
    if [ "$available_memory" -lt 2048 ]; then # 2GB
        warning "Low memory: ${available_memory}MB available"
    fi
    
    success "Pre-deployment checks completed"
}

# Create backup before deployment
create_backup() {
    if [ "$BACKUP_BEFORE_DEPLOY" = true ]; then
        log "Creating backup before deployment..."
        
        # Create database backup
        local backup_file="backup_pre_deploy_$(date +%Y%m%d_%H%M%S).sql.gz"
        PGPASSWORD="$DB_PASSWORD" pg_dump -h localhost -U "$DB_USER" -d labguard_prod | gzip > "/backups/$backup_file"
        
        if [ $? -eq 0 ]; then
            success "Backup created: $backup_file"
        else
            error "Backup creation failed"
            exit 1
        fi
    fi
}

# Stop existing services
stop_services() {
    log "Stopping existing services..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" down --remove-orphans
    success "Services stopped"
}

# Build and start services
deploy_services() {
    log "Building and starting services..."
    
    # Pull latest images
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
    
    # Build images
    docker-compose -f "$DOCKER_COMPOSE_FILE" build --no-cache
    
    # Start services
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
    
    success "Services deployed"
}

# Health check function
health_check() {
    log "Performing health checks..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        log "Health check attempt $attempt/$max_attempts"
        
        # Check if containers are running
        local containers=("labguard-postgres-prod" "labguard-redis-prod" "labguard-api-prod" "labguard-web-prod" "labguard-nginx-prod")
        local all_healthy=true
        
        for container in "${containers[@]}"; do
            if docker ps | grep -q "$container"; then
                log "✓ Container $container is running"
            else
                error "✗ Container $container is not running"
                all_healthy=false
            fi
        done
        
        # Check database connectivity
        if PGPASSWORD="$DB_PASSWORD" pg_isready -h localhost -p 5432 -U "$DB_USER" >/dev/null 2>&1; then
            log "✓ Database is accessible"
        else
            error "✗ Database is not accessible"
            all_healthy=false
        fi
        
        # Check API health
        if curl -f "http://localhost:3001/api/health" >/dev/null 2>&1; then
            log "✓ API is responding"
        else
            error "✗ API is not responding"
            all_healthy=false
        fi
        
        # Check web application
        if curl -f "http://localhost:3000/api/health" >/dev/null 2>&1; then
            log "✓ Web application is responding"
        else
            error "✗ Web application is not responding"
            all_healthy=false
        fi
        
        if [ "$all_healthy" = true ]; then
            success "All health checks passed"
            return 0
        fi
        
        if [ $attempt -lt $max_attempts ]; then
            log "Waiting 10 seconds before next health check..."
            sleep 10
        fi
        
        attempt=$((attempt + 1))
    done
    
    error "Health checks failed after $max_attempts attempts"
    return 1
}

# Performance test
performance_test() {
    log "Running performance tests..."
    
    # Test API response time
    local api_response_time=$(curl -o /dev/null -s -w "%{time_total}" "http://localhost:3001/api/health")
    log "API response time: ${api_response_time}s"
    
    if (( $(echo "$api_response_time > 2.0" | bc -l) )); then
        warning "API response time is slow: ${api_response_time}s"
    fi
    
    # Test database query performance
    local db_query_time=$(PGPASSWORD="$DB_PASSWORD" psql -h localhost -U "$DB_USER" -d labguard_prod -c "SELECT COUNT(*) FROM users;" -t | xargs)
    log "Database query test completed"
    
    success "Performance tests completed"
}

# Rollback function
rollback() {
    log "Starting rollback procedure..."
    
    # Stop current services
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
    
    # Restore from backup if available
    local latest_backup=$(find /backups -name "backup_pre_deploy_*.sql.gz" -type f -printf '%T@ %p\n' | sort -nr | head -1 | cut -d' ' -f2-)
    
    if [ -n "$latest_backup" ]; then
        log "Restoring from backup: $latest_backup"
        
        # Drop and recreate database
        PGPASSWORD="$DB_PASSWORD" psql -h localhost -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS labguard_prod;"
        PGPASSWORD="$DB_PASSWORD" psql -h localhost -U "$DB_USER" -d postgres -c "CREATE DATABASE labguard_prod;"
        
        # Restore database
        gunzip -c "$latest_backup" | PGPASSWORD="$DB_PASSWORD" psql -h localhost -U "$DB_USER" -d labguard_prod
        
        success "Database restored from backup"
    fi
    
    # Start previous version (this would require version management)
    log "Starting previous version..."
    # Implementation depends on your version management strategy
    
    success "Rollback completed"
}

# Send notification
send_notification() {
    local status="$1"
    local message="$2"
    
    if [ "$SLACK_NOTIFICATIONS" = true ] && [ -n "$SLACK_WEBHOOK_URL" ]; then
        local emoji=""
        case "$status" in
            "success") emoji="✅" ;;
            "error") emoji="❌" ;;
            "warning") emoji="⚠️" ;;
            *) emoji="ℹ️" ;;
        esac
        
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$emoji LabGuard Pro Deployment: $message\"}" \
            "$SLACK_WEBHOOK_URL"
    fi
}

# Main deployment function
main() {
    local start_time=$(date +%s)
    
    log "Starting LabGuard Pro deployment..."
    
    # Load environment variables
    load_env
    
    # Pre-deployment checks
    pre_deployment_checks
    
    # Create backup
    create_backup
    
    # Stop existing services
    stop_services
    
    # Deploy services
    deploy_services
    
    # Health checks
    if health_check; then
        success "Deployment health checks passed"
        
        # Performance tests
        performance_test
        
        # Send success notification
        send_notification "success" "Deployment completed successfully"
        
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        success "Deployment completed in ${duration} seconds"
        
    else
        error "Deployment health checks failed"
        
        # Rollback if enabled
        if [ "$ROLLBACK_ENABLED" = true ]; then
            warning "Initiating rollback..."
            rollback
            
            # Health check after rollback
            if health_check; then
                success "Rollback completed successfully"
                send_notification "warning" "Deployment failed, rollback completed"
            else
                error "Rollback failed"
                send_notification "error" "Deployment and rollback failed"
                exit 1
            fi
        else
            send_notification "error" "Deployment failed, rollback disabled"
            exit 1
        fi
    fi
}

# Cleanup function
cleanup() {
    log "Cleaning up deployment artifacts..."
    
    # Remove old images
    docker image prune -f
    
    # Remove old containers
    docker container prune -f
    
    # Remove old volumes (be careful with this)
    # docker volume prune -f
    
    success "Cleanup completed"
}

# Usage function
usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --no-backup      Skip backup creation"
    echo "  --no-rollback    Disable rollback on failure"
    echo "  --no-notifications Disable Slack notifications"
    echo "  --cleanup        Run cleanup after deployment"
    echo "  --help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                    # Full deployment with all features"
    echo "  $0 --no-backup        # Deploy without backup"
    echo "  $0 --cleanup          # Deploy and cleanup"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --no-backup)
            BACKUP_BEFORE_DEPLOY=false
            shift
            ;;
        --no-rollback)
            ROLLBACK_ENABLED=false
            shift
            ;;
        --no-notifications)
            SLACK_NOTIFICATIONS=false
            shift
            ;;
        --cleanup)
            cleanup
            exit 0
            ;;
        --help)
            usage
            exit 0
            ;;
        *)
            error "Unknown option: $1"
            usage
            exit 1
            ;;
    esac
done

# Run main deployment
main 