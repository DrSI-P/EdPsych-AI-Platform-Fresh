#!/bin/bash
# Script to commit and push AI avatar assets to GitHub
# This script helps with making regular commits as the avatar implementation progresses

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}EdPsych-AI-Education-Platform AI Avatar Assets Commit Script${NC}"
echo "This script helps commit and push AI avatar assets to GitHub"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Error: git is not installed or not in PATH"
    exit 1
fi

# Check if we're in the right directory
if [ ! -d ".git" ]; then
    echo "Error: This script must be run from the root of the repository"
    echo "Please navigate to the repository root and try again"
    exit 1
fi

# Function to commit changes
commit_changes() {
    local message="$1"
    local files="$2"
    
    echo -e "${YELLOW}Committing: ${message}${NC}"
    git add $files
    git commit -m "$message"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Commit successful!${NC}"
    else
        echo "Commit failed. Please check for errors and try again."
        exit 1
    fi
}

# Function to push changes
push_changes() {
    echo -e "${YELLOW}Pushing changes to GitHub...${NC}"
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Push successful!${NC}"
    else
        echo "Push failed. Please check your connection and GitHub access."
        exit 1
    fi
}

# Main menu
while true; do
    echo ""
    echo "Select an option:"
    echo "1) Commit script files"
    echo "2) Commit metadata files"
    echo "3) Commit implementation guide"
    echo "4) Commit generated videos"
    echo "5) Commit all avatar assets"
    echo "6) Push changes to GitHub"
    echo "7) Exit"
    echo ""
    read -p "Enter your choice (1-7): " choice
    
    case $choice in
        1)
            commit_changes "Add AI avatar script files for Dr. Scott and other avatars" "docs/ai_avatar_assets/*_clips.md"
            ;;
        2)
            commit_changes "Add AI avatar metadata with Dr. Scott's settings" "docs/ai_avatar_assets/avatar_metadata.json"
            ;;
        3)
            commit_changes "Add AI avatar implementation guide for HeyGen integration" "docs/ai_avatar_assets/implementation_guide.md"
            ;;
        4)
            read -p "Enter path to video files (e.g., public/videos/avatars/teacher): " video_path
            if [ -d "$video_path" ]; then
                commit_changes "Add generated AI avatar videos for $video_path" "$video_path"
            else
                echo "Error: Directory $video_path does not exist"
            fi
            ;;
        5)
            commit_changes "Add all AI avatar assets including scripts, metadata, and implementation guide" "docs/ai_avatar_assets/"
            ;;
        6)
            push_changes
            ;;
        7)
            echo "Exiting script"
            exit 0
            ;;
        *)
            echo "Invalid option. Please try again."
            ;;
    esac
done