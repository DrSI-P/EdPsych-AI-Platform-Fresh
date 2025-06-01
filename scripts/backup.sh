#!/bin/bash

# Database backup script for EdPsych-AI-Education-Platform
# This script creates a backup of the database and stores it in a specified location

# Configuration
BACKUP_DIR="/home/ubuntu/EdPsych-AI-Education-Platform/backups"
DB_NAME="edpsych_db"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql"
LOG_FILE="${BACKUP_DIR}/backup_log.txt"
ERROR_LOG="${BACKUP_DIR}/backup_error.txt"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Log start of backup
echo "$(date): Starting database backup..." >> $LOG_FILE

# Function to handle errors
handle_error() {
    local error_message="$1"
    echo "$(date): ERROR - $error_message" >> $ERROR_LOG
    echo "$(date): Backup failed: $error_message" >> $LOG_FILE
    
    # Send notification (uncomment and configure as needed)
    # mail -s "EdPsych-AI Database Backup Failed" admin@edpsychconnect.com < $ERROR_LOG
    
    exit 1
}

# Check if Prisma is installed
if ! command -v npx &> /dev/null; then
    handle_error "npx command not found. Please ensure Node.js and npm are installed."
fi

# Create a pre-backup snapshot for safety
echo "Creating pre-backup snapshot..."
PRE_BACKUP="${BACKUP_DIR}/${DB_NAME}_pre_backup_${TIMESTAMP}.sql"
npx prisma db pull --schema=./prisma/schema.prisma > "${PRE_BACKUP}" 2>> $LOG_FILE || handle_error "Failed to create pre-backup snapshot"
echo "$(date): Pre-backup snapshot created: $PRE_BACKUP" >> $LOG_FILE

# Export database schema and data
echo "Exporting database to $BACKUP_FILE"
npx prisma db pull --schema=./prisma/schema.prisma > "${BACKUP_FILE}" 2>> $LOG_FILE || handle_error "Database export failed"

# Verify backup file was created and has content
if [ ! -s "$BACKUP_FILE" ]; then
    handle_error "Backup file is empty or was not created"
fi

# Backup successful
echo "$(date): Backup completed successfully. File: $BACKUP_FILE" >> $LOG_FILE

# Compress the backup file
gzip $BACKUP_FILE || handle_error "Failed to compress backup file"
echo "$(date): Backup compressed: ${BACKUP_FILE}.gz" >> $LOG_FILE

# Implement backup rotation strategy
# Keep all backups from the last 7 days
# Keep weekly backups for the last 4 weeks
# Keep monthly backups for the last 12 months

# Remove daily backups older than 7 days (except weekly and monthly backups)
find $BACKUP_DIR -name "${DB_NAME}_*.sql.gz" -type f -mtime +7 -not -name "${DB_NAME}_*_weekly.sql.gz" -not -name "${DB_NAME}_*_monthly.sql.gz" -delete
echo "$(date): Removed daily backups older than 7 days" >> $LOG_FILE

# Remove weekly backups older than 28 days (except monthly backups)
find $BACKUP_DIR -name "${DB_NAME}_*_weekly.sql.gz" -type f -mtime +28 -not -name "${DB_NAME}_*_monthly.sql.gz" -delete
echo "$(date): Removed weekly backups older than 28 days" >> $LOG_FILE

# Remove monthly backups older than 365 days
find $BACKUP_DIR -name "${DB_NAME}_*_monthly.sql.gz" -type f -mtime +365 -delete
echo "$(date): Removed monthly backups older than 365 days" >> $LOG_FILE

# Create weekly backup (on Sundays)
if [ $(date +%u) -eq 7 ]; then
    cp "${BACKUP_FILE}.gz" "${BACKUP_DIR}/${DB_NAME}_$(date +"%Y%m%d")_weekly.sql.gz"
    echo "$(date): Created weekly backup" >> $LOG_FILE
fi

# Create monthly backup (on the 1st of each month)
if [ $(date +%d) -eq 01 ]; then
    cp "${BACKUP_FILE}.gz" "${BACKUP_DIR}/${DB_NAME}_$(date +"%Y%m")_monthly.sql.gz"
    echo "$(date): Created monthly backup" >> $LOG_FILE
fi

# Optional: Copy to remote storage (uncomment and configure as needed)
# if command -v rclone &> /dev/null; then
#     echo "Copying backup to remote storage..."
#     rclone copy "${BACKUP_FILE}.gz" remote:edpsych-backups/ || handle_error "Failed to copy backup to remote storage"
#     echo "$(date): Backup copied to remote storage" >> $LOG_FILE
# else
#     echo "$(date): Warning - rclone not installed, skipping remote backup" >> $LOG_FILE
# fi

# Calculate backup size and total backup storage used
BACKUP_SIZE=$(du -h "${BACKUP_FILE}.gz" | cut -f1)
TOTAL_BACKUP_SIZE=$(du -h $BACKUP_DIR | cut -f1)

echo "$(date): Backup size: $BACKUP_SIZE" >> $LOG_FILE
echo "$(date): Total backup storage used: $TOTAL_BACKUP_SIZE" >> $LOG_FILE

# Print summary
echo "Database backup completed successfully!"
echo "Backup file: ${BACKUP_FILE}.gz"
echo "Backup size: $BACKUP_SIZE"
echo "Total backup storage used: $TOTAL_BACKUP_SIZE"

# Setup automated scheduling instructions
echo ""
echo "To schedule automatic backups, add the following to your crontab:"
echo "# Daily backup at 2 AM"
echo "0 2 * * * /home/ubuntu/EdPsych-AI-Education-Platform/scripts/backup.sh"

exit 0
