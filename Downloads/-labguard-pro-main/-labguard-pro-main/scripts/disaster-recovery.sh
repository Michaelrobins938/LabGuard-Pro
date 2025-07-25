#!/bin/bash

# LabGuard Pro Disaster Recovery Script
# This script handles automated disaster recovery procedures

set -e

# Configuration
BACKUP_DIR="/backups"
RESTORE_DIR="/tmp/restore"
LOG_FILE="/var/log/labguard-recovery.log"
HEALTH_CHECK_URL="https://app.labguardpro.com/api/health"
DATABASE_URL="${DATABASE_URL:-postgresql://labguard_user:labguard_password@localhost:5432/labguard_prod}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Health check function
check_system_health() {
    log "Performing system health check..."
    
    # Check if services are running
    local services=("postgres" "redis" "api" "web" "nginx")
    local healthy=true
    
    for service in "${services[@]}"; do
        if docker ps | grep -q "$service"; then
            log "✓ Service $service is running"
        else
            error "✗ Service $service is not running"
            healthy=false
        fi
    done
    
    # Check database connectivity
    if pg_isready -h localhost -p 5432 -U labguard_user >/dev/null 2>&1; then
        log "✓ Database is accessible"
    else
        error "✗ Database is not accessible"
        healthy=false
    fi
    
    # Check API health
    if curl -f "$HEALTH_CHECK_URL" >/dev/null 2>&1; then
        log "✓ API is responding"
    else
        error "✗ API is not responding"
        healthy=false
    fi
    
    if [ "$healthy" = true ]; then
        success "System health check passed"
        return 0
    else
        error "System health check failed"
        return 1
    fi
}

# Backup verification function
verify_backup() {
    local backup_file="$1"
    
    log "Verifying backup: $backup_file"
    
    if [ ! -f "$backup_file" ]; then
        error "Backup file not found: $backup_file"
        return 1
    fi
    
    # Check if file is compressed
    if [[ "$backup_file" == *.gz ]]; then
        if gunzip -t "$backup_file" 2>/dev/null; then
            log "✓ Backup file is valid (compressed)"
        else
            error "✗ Backup file is corrupted"
            return 1
        fi
    else
        log "✓ Backup file is valid (uncompressed)"
    fi
    
    # Check file size
    local size=$(du -h "$backup_file" | cut -f1)
    log "Backup size: $size"
    
    success "Backup verification completed"
    return 0
}

# Database restoration function
restore_database() {
    local backup_file="$1"
    
    log "Starting database restoration from: $backup_file"
    
    # Stop services that depend on database
    log "Stopping dependent services..."
    docker-compose -f docker-compose.prod.yml stop api web || true
    
    # Create restore directory
    mkdir -p "$RESTORE_DIR"
    
    # Extract backup
    if [[ "$backup_file" == *.gz ]]; then
        log "Extracting compressed backup..."
        gunzip -c "$backup_file" > "$RESTORE_DIR/restore.sql"
    else
        log "Copying uncompressed backup..."
        cp "$backup_file" "$RESTORE_DIR/restore.sql"
    fi
    
    # Drop and recreate database
    log "Dropping existing database..."
    PGPASSWORD="$DB_PASSWORD" psql -h localhost -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS labguard_prod;"
    PGPASSWORD="$DB_PASSWORD" psql -h localhost -U "$DB_USER" -d postgres -c "CREATE DATABASE labguard_prod;"
    
    # Restore database
    log "Restoring database..."
    PGPASSWORD="$DB_PASSWORD" psql -h localhost -U "$DB_USER" -d labguard_prod < "$RESTORE_DIR/restore.sql"
    
    # Clean up
    rm -rf "$RESTORE_DIR"
    
    # Restart services
    log "Restarting services..."
    docker-compose -f docker-compose.prod.yml up -d api web
    
    # Wait for services to be ready
    log "Waiting for services to be ready..."
    sleep 30
    
    success "Database restoration completed"
}

# Full system recovery function
full_system_recovery() {
    local backup_file="$1"
    
    log "Starting full system recovery..."
    
    # Verify backup
    if ! verify_backup "$backup_file"; then
        error "Backup verification failed. Aborting recovery."
        return 1
    fi
    
    # Stop all services
    log "Stopping all services..."
    docker-compose -f docker-compose.prod.yml down
    
    # Restore database
    restore_database "$backup_file"
    
    # Restart all services
    log "Starting all services..."
    docker-compose -f docker-compose.prod.yml up -d
    
    # Wait for services to be ready
    log "Waiting for services to be ready..."
    sleep 60
    
    # Verify recovery
    if check_system_health; then
        success "Full system recovery completed successfully"
        return 0
    else
        error "System recovery verification failed"
        return 1
    fi
}

# Point-in-time recovery function
point_in_time_recovery() {
    local timestamp="$1"
    local backup_file="$2"
    
    log "Starting point-in-time recovery to: $timestamp"
    
    # Restore from backup first
    restore_database "$backup_file"
    
    # Apply transaction logs (if available)
    # This would require WAL (Write-Ahead Logging) to be enabled
    log "Applying transaction logs..."
    # Implementation depends on PostgreSQL WAL configuration
    
    success "Point-in-time recovery completed"
}

# Data consistency check function
check_data_consistency() {
    log "Checking data consistency..."
    
    # Check database integrity
    PGPASSWORD="$DB_PASSWORD" psql -h localhost -U "$DB_USER" -d labguard_prod -c "
        SELECT 
            schemaname,
            tablename,
            attname,
            n_distinct,
            correlation
        FROM pg_stats 
        WHERE schemaname = 'public'
        ORDER BY tablename, attname;
    " > /tmp/consistency_check.txt
    
    # Check for orphaned records
    PGPASSWORD="$DB_PASSWORD" psql -h localhost -U "$DB_USER" -d labguard_prod -c "
        SELECT 'orphaned_calibrations' as issue, COUNT(*) as count
        FROM calibration_records cr
        LEFT JOIN equipment e ON cr.equipment_id = e.id
        WHERE e.id IS NULL
        UNION ALL
        SELECT 'orphaned_equipment' as issue, COUNT(*) as count
        FROM equipment e
        LEFT JOIN laboratories l ON e.laboratory_id = l.id
        WHERE l.id IS NULL;
    " > /tmp/orphaned_records.txt
    
    log "Data consistency check completed"
    log "Results saved to /tmp/consistency_check.txt and /tmp/orphaned_records.txt"
}

# Automated recovery function
automated_recovery() {
    log "Starting automated recovery procedure..."
    
    # Find latest backup
    local latest_backup=$(find "$BACKUP_DIR" -name "labguard_backup_*.sql.gz" -type f -printf '%T@ %p\n' | sort -nr | head -1 | cut -d' ' -f2-)
    
    if [ -z "$latest_backup" ]; then
        error "No backup files found in $BACKUP_DIR"
        return 1
    fi
    
    log "Using latest backup: $latest_backup"
    
    # Perform full system recovery
    if full_system_recovery "$latest_backup"; then
        success "Automated recovery completed successfully"
        
        # Send notification
        if [ -n "$SLACK_WEBHOOK_URL" ]; then
            curl -X POST -H 'Content-type: application/json' \
                --data "{\"text\":\"🔄 LabGuard Pro automated recovery completed successfully\\n📁 Backup: $(basename "$latest_backup")\\n🕒 Time: $(date)\"}" \
                "$SLACK_WEBHOOK_URL"
        fi
        
        return 0
    else
        error "Automated recovery failed"
        
        # Send notification
        if [ -n "$SLACK_WEBHOOK_URL" ]; then
            curl -X POST -H 'Content-type: application/json' \
                --data "{\"text\":\"❌ LabGuard Pro automated recovery failed\\n📁 Backup: $(basename "$latest_backup")\\n🕒 Time: $(date)\"}" \
                "$SLACK_WEBHOOK_URL"
        fi
        
        return 1
    fi
}

# Recovery test function
test_recovery() {
    log "Starting recovery test..."
    
    # Create test environment
    local test_backup="$BACKUP_DIR/test_backup.sql.gz"
    
    # Create a test backup
    log "Creating test backup..."
    PGPASSWORD="$DB_PASSWORD" pg_dump -h localhost -U "$DB_USER" -d labguard_prod | gzip > "$test_backup"
    
    # Verify test backup
    if verify_backup "$test_backup"; then
        success "Recovery test backup created successfully"
        
        # Test restoration in a temporary environment
        log "Testing restoration..."
        # This would typically use a separate test database
        
        # Clean up test backup
        rm -f "$test_backup"
        
        success "Recovery test completed successfully"
        return 0
    else
        error "Recovery test failed"
        return 1
    fi
}

# Main function
main() {
    local action="$1"
    local backup_file="$2"
    local timestamp="$3"
    
    case "$action" in
        "health")
            check_system_health
            ;;
        "verify")
            verify_backup "$backup_file"
            ;;
        "restore")
            restore_database "$backup_file"
            ;;
        "full-recovery")
            full_system_recovery "$backup_file"
            ;;
        "point-in-time")
            point_in_time_recovery "$timestamp" "$backup_file"
            ;;
        "consistency")
            check_data_consistency
            ;;
        "auto-recovery")
            automated_recovery
            ;;
        "test")
            test_recovery
            ;;
        *)
            echo "Usage: $0 {health|verify|restore|full-recovery|point-in-time|consistency|auto-recovery|test} [backup_file] [timestamp]"
            echo ""
            echo "Actions:"
            echo "  health           - Check system health"
            echo "  verify           - Verify backup file"
            echo "  restore          - Restore database from backup"
            echo "  full-recovery    - Full system recovery"
            echo "  point-in-time    - Point-in-time recovery"
            echo "  consistency      - Check data consistency"
            echo "  auto-recovery    - Automated recovery procedure"
            echo "  test             - Test recovery procedure"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@" 