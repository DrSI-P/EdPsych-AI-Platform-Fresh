#!/bin/bash

# Database recovery script for EdPsych-AI-Education-Platform
# This script restores a database from a backup file

# Configuration
BACKUP_DIR="/home/ubuntu/EdPsych-AI-Education-Platform/backups"
DB_NAME="edpsych_db"
LOG_FILE="${BACKUP_DIR}/recovery_log.txt"
ERROR_LOG="${BACKUP_DIR}/recovery_error.txt"

# Function to handle errors
handle_error() {
    local error_message="$1"
    echo "$(date): ERROR - $error_message" >> $ERROR_LOG
    echo "$(date): Recovery failed: $error_message" >> $LOG_FILE
    
    # Send notification (uncomment and configure as needed)
    # mail -s "EdPsych-AI Database Recovery Failed" admin@edpsychconnect.com < $ERROR_LOG
    
    exit 1
}

# Check if backup file is provided
if [ -z "$1" ]; then
    echo "Error: No backup file specified."
    echo "Usage: $0 <backup_file>"
    echo "Available backups:"
    ls -lt $BACKUP_DIR/*.sql.gz | head -10
    exit 1
fi

BACKUP_FILE=$1

# Log start of recovery
echo "$(date): Starting database recovery from $BACKUP_FILE..." >> $LOG_FILE

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    handle_error "Backup file $BACKUP_FILE does not exist."
fi

# Create a safety backup before recovery
echo "Creating safety backup before recovery..."
SAFETY_BACKUP="${BACKUP_DIR}/${DB_NAME}_pre_recovery_$(date +"%Y%m%d_%H%M%S").sql"
npx prisma db pull --schema=./prisma/schema.prisma > "${SAFETY_BACKUP}" 2>> $LOG_FILE || handle_error "Failed to create safety backup"
echo "$(date): Safety backup created: $SAFETY_BACKUP" >> $LOG_FILE

# Create a temporary directory for extraction
TEMP_DIR=$(mktemp -d)
echo "$(date): Created temporary directory $TEMP_DIR" >> $LOG_FILE

# Extract the backup if it's compressed
if [[ "$BACKUP_FILE" == *.gz ]]; then
    echo "Extracting compressed backup..."
    gunzip -c "$BACKUP_FILE" > "$TEMP_DIR/backup.sql" || handle_error "Failed to extract backup file"
    BACKUP_SQL="$TEMP_DIR/backup.sql"
    echo "$(date): Extracted backup to $BACKUP_SQL" >> $LOG_FILE
else
    BACKUP_SQL="$BACKUP_FILE"
fi

# Verify backup file integrity
if [ ! -s "$BACKUP_SQL" ]; then
    handle_error "Extracted backup file is empty or corrupted"
fi

# Restore the database
echo "Restoring database from $BACKUP_SQL..."
echo "$(date): Applying database schema and data..." >> $LOG_FILE

# For Prisma, we need to apply the schema
echo "Resetting database and applying schema..."
npx prisma db push --schema=./prisma/schema.prisma --force-reset 2>> $LOG_FILE || handle_error "Failed to reset database and apply schema"

# Then import the data (this is a simplified approach - in a real scenario, 
# you might need to use a database-specific tool like psql or mysql)
echo "Importing data..."
cat "$BACKUP_SQL" | npx prisma db execute --schema=./prisma/schema.prisma 2>> $LOG_FILE || handle_error "Failed to import data"

# Verify recovery success
echo "Verifying recovery..."
npx prisma db pull --schema=./prisma/schema.prisma > "$TEMP_DIR/verification.sql" 2>> $LOG_FILE || handle_error "Failed to verify recovery"

# Basic verification check - compare file sizes
BACKUP_SIZE=$(stat -c%s "$BACKUP_SQL")
VERIFY_SIZE=$(stat -c%s "$TEMP_DIR/verification.sql")
SIZE_DIFF=$((BACKUP_SIZE - VERIFY_SIZE))
SIZE_DIFF_ABS=${SIZE_DIFF#-}  # Absolute value

# Allow for small differences due to formatting, timestamps, etc.
if [ $SIZE_DIFF_ABS -gt $((BACKUP_SIZE / 10)) ]; then  # If difference is more than 10%
    echo "$(date): Warning - Significant difference between backup and recovered database" >> $LOG_FILE
    echo "$(date): Backup size: $BACKUP_SIZE bytes, Recovered size: $VERIFY_SIZE bytes" >> $LOG_FILE
    echo "Warning: The recovered database may not match the backup exactly."
    echo "Please verify critical data manually."
else
    echo "$(date): Recovery verification passed" >> $LOG_FILE
fi

# Check if restore was successful
if [ $? -eq 0 ]; then
    echo "$(date): Recovery completed successfully." >> $LOG_FILE
else
    handle_error "Recovery verification failed"
fi

# Clean up
rm -rf "$TEMP_DIR"
echo "$(date): Removed temporary directory" >> $LOG_FILE

# Compress the safety backup
gzip $SAFETY_BACKUP
echo "$(date): Safety backup compressed: ${SAFETY_BACKUP}.gz" >> $LOG_FILE

echo "Database recovery completed successfully!"
echo "Safety backup created: ${SAFETY_BACKUP}.gz"
echo "If you need to revert to the pre-recovery state, use:"
echo "$0 ${SAFETY_BACKUP}.gz"
exit 0
