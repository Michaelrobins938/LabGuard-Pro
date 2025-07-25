#!/bin/bash

# LabGuard Pro Database Backup Script
# This script creates automated backups of the PostgreSQL database

set -e

# Configuration
BACKUP_DIR="/backups"
DB_HOST="${POSTGRES_HOST:-postgres}"
DB_PORT="${POSTGRES_PORT:-5432}"
DB_NAME="${POSTGRES_DB:-labguard_prod}"
DB_USER="${POSTGRES_USER:-labguard_user}"
DB_PASSWORD="${POSTGRES_PASSWORD:-labguard_password}"
RETENTION_DAYS=30
COMPRESSION_LEVEL=9

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate timestamp for backup file
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="labguard_backup_${TIMESTAMP}.sql.gz"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_FILE"

# Log function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Error handling
cleanup() {
    log "Cleaning up temporary files..."
    rm -f "$BACKUP_DIR/temp_backup.sql"
}

trap cleanup EXIT

# Start backup
log "Starting database backup..."

# Set password for pg_dump
export PGPASSWORD="$DB_PASSWORD"

# Create backup with compression
pg_dump \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --verbose \
    --clean \
    --create \
    --if-exists \
    --no-password \
    --no-owner \
    --no-privileges \
    --format=plain \
    --file="$BACKUP_DIR/temp_backup.sql"

# Compress backup
log "Compressing backup..."
gzip -$COMPRESSION_LEVEL "$BACKUP_DIR/temp_backup.sql"
mv "$BACKUP_DIR/temp_backup.sql.gz" "$BACKUP_PATH"

# Verify backup integrity
log "Verifying backup integrity..."
gunzip -t "$BACKUP_PATH"
if [ $? -eq 0 ]; then
    log "Backup verification successful"
else
    log "ERROR: Backup verification failed"
    exit 1
fi

# Get backup size
BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
log "Backup completed: $BACKUP_FILE ($BACKUP_SIZE)"

# Upload to cloud storage (if configured)
if [ -n "$AWS_S3_BUCKET" ]; then
    log "Uploading backup to S3..."
    aws s3 cp "$BACKUP_PATH" "s3://$AWS_S3_BUCKET/database-backups/$BACKUP_FILE" \
        --storage-class STANDARD_IA \
        --metadata "backup-date=$TIMESTAMP,environment=production"
    log "Backup uploaded to S3 successfully"
fi

# Clean up old backups
log "Cleaning up old backups..."
find "$BACKUP_DIR" -name "labguard_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Remove old backups from S3 (if configured)
if [ -n "$AWS_S3_BUCKET" ]; then
    log "Cleaning up old S3 backups..."
    aws s3 ls "s3://$AWS_S3_BUCKET/database-backups/" | \
    awk '{print $4}' | \
    grep "labguard_backup_" | \
    while read file; do
        # Get file creation date
        FILE_DATE=$(echo "$file" | grep -o '[0-9]\{8\}' | head -1)
        if [ -n "$FILE_DATE" ]; then
            # Convert to days ago
            DAYS_AGO=$(( ( $(date +%s) - $(date -d "$FILE_DATE" +%s) ) / 86400 ))
            if [ "$DAYS_AGO" -gt "$RETENTION_DAYS" ]; then
                aws s3 rm "s3://$AWS_S3_BUCKET/database-backups/$file"
                log "Deleted old S3 backup: $file"
            fi
        fi
    done
fi

# Create backup report
BACKUP_COUNT=$(find "$BACKUP_DIR" -name "labguard_backup_*.sql.gz" | wc -l)
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)

cat > "$BACKUP_DIR/backup_report.txt" << EOF
LabGuard Pro Database Backup Report
Generated: $(date)

Backup Details:
- File: $BACKUP_FILE
- Size: $BACKUP_SIZE
- Status: SUCCESS
- Verification: PASSED

Backup Statistics:
- Total backups: $BACKUP_COUNT
- Total size: $TOTAL_SIZE
- Retention period: $RETENTION_DAYS days

Recent Backups:
$(find "$BACKUP_DIR" -name "labguard_backup_*.sql.gz" -printf "%T@ %p\n" | sort -nr | head -10 | while read timestamp file; do
    date=$(date -d "@$timestamp" '+%Y-%m-%d %H:%M:%S')
    size=$(du -h "$file" | cut -f1)
    echo "- $(basename "$file") ($size) - $date"
done)
EOF

log "Backup report generated: $BACKUP_DIR/backup_report.txt"
log "Database backup completed successfully"

# Send notification (if configured)
if [ -n "$SLACK_WEBHOOK_URL" ]; then
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"✅ LabGuard Pro database backup completed successfully\\n📁 File: $BACKUP_FILE\\n📏 Size: $BACKUP_SIZE\\n🕒 Time: $(date)\"}" \
        "$SLACK_WEBHOOK_URL"
fi

exit 0 