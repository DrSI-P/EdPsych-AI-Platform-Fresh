#!/bin/bash
# Script to make the initial commit of AI avatar assets to GitHub

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}EdPsych-AI-Education-Platform Initial AI Avatar Assets Commit${NC}"
echo "This script will make the initial commit of all AI avatar assets to GitHub"
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

# Make the commit-avatar-assets.sh script executable
echo -e "${YELLOW}Making commit script executable...${NC}"
chmod +x scripts/commit-avatar-assets.sh
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Script is now executable!${NC}"
else
    echo "Failed to make script executable. Please check permissions."
    exit 1
fi

# Add all AI avatar assets
echo -e "${YELLOW}Adding all AI avatar assets...${NC}"
git add docs/ai_avatar_assets/
git add scripts/commit-avatar-assets.sh
git add scripts/initial-avatar-commit.sh

# Commit the changes
echo -e "${YELLOW}Committing changes...${NC}"
git commit -m "Add AI avatar assets for EdPsych-AI-Education-Platform featuring Dr. Scott Ighavongbe-Patrick"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Commit successful!${NC}"
else
    echo "Commit failed. Please check for errors and try again."
    exit 1
fi

# Push to GitHub
echo -e "${YELLOW}Pushing to GitHub...${NC}"
git push origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Push successful!${NC}"
    echo ""
    echo -e "${GREEN}All AI avatar assets have been successfully committed and pushed to GitHub.${NC}"
    echo "The following files were included:"
    echo "- Scripts for teacher avatar (Dr. Scott Ighavongbe-Patrick)"
    echo "- Scripts for student peer avatar"
    echo "- Scripts for special needs support avatar"
    echo "- Scripts for subject specialist avatar"
    echo "- Avatar metadata JSON file"
    echo "- Implementation guide for HeyGen integration"
    echo "- README file for the AI avatar assets"
    echo "- Commit scripts for future updates"
    echo ""
    echo "Next steps:"
    echo "1. Follow the implementation guide to generate the videos using HeyGen"
    echo "2. Use Dr. Scott's provided images and voice samples for the teacher avatar"
    echo "3. Update the metadata file with video URLs once generated"
    echo "4. Use the commit-avatar-assets.sh script for future commits"
else
    echo "Push failed. Please check your connection and GitHub access."
    exit 1
fi