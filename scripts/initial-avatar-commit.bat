@echo off
REM Script to make the initial commit of AI avatar assets to GitHub

echo EdPsych-AI-Education-Platform Initial AI Avatar Assets Commit
echo This script will make the initial commit of all AI avatar assets to GitHub
echo.

REM Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: git is not installed or not in PATH
    exit /b 1
)

REM Check if we're in the right directory
if not exist ".git" (
    echo Error: This script must be run from the root of the repository
    echo Please navigate to the repository root and try again
    exit /b 1
)

REM Add all AI avatar assets
echo Adding all AI avatar assets...
git add docs/ai_avatar_assets/
git add scripts/commit-avatar-assets.bat
git add scripts/initial-avatar-commit.bat

REM Commit the changes
echo Committing changes...
git commit -m "Add AI avatar assets for EdPsych-AI-Education-Platform featuring Dr. Scott Ighavongbe-Patrick"

if %ERRORLEVEL% equ 0 (
    echo Commit successful!
) else (
    echo Commit failed. Please check for errors and try again.
    exit /b 1
)

REM Push to GitHub
echo Pushing to GitHub...
git push origin main

if %ERRORLEVEL% equ 0 (
    echo Push successful!
    echo.
    echo All AI avatar assets have been successfully committed and pushed to GitHub.
    echo The following files were included:
    echo - Scripts for teacher avatar (Dr. Scott Ighavongbe-Patrick)
    echo - Scripts for student peer avatar
    echo - Scripts for special needs support avatar
    echo - Scripts for subject specialist avatar
    echo - Avatar metadata JSON file
    echo - Implementation guide for HeyGen integration
    echo - README file for the AI avatar assets
    echo - Commit scripts for future updates
    echo.
    echo Next steps:
    echo 1. Follow the implementation guide to generate the videos using HeyGen
    echo 2. Use Dr. Scott's provided images and voice samples for the teacher avatar
    echo 3. Update the metadata file with video URLs once generated
    echo 4. Use the commit-avatar-assets.bat script for future commits
) else (
    echo Push failed. Please check your connection and GitHub access.
    exit /b 1
)