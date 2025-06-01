@echo off
REM Script to commit and push AI avatar assets to GitHub
REM This script helps with making regular commits as the avatar implementation progresses

echo EdPsych-AI-Education-Platform AI Avatar Assets Commit Script
echo This script helps commit and push AI avatar assets to GitHub
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

:menu
echo.
echo Select an option:
echo 1) Commit script files
echo 2) Commit metadata files
echo 3) Commit implementation guide
echo 4) Commit generated videos
echo 5) Commit all avatar assets
echo 6) Push changes to GitHub
echo 7) Exit
echo.
set /p choice=Enter your choice (1-7): 

if "%choice%"=="1" (
    call :commit_scripts
    goto menu
)
if "%choice%"=="2" (
    call :commit_metadata
    goto menu
)
if "%choice%"=="3" (
    call :commit_guide
    goto menu
)
if "%choice%"=="4" (
    call :commit_videos
    goto menu
)
if "%choice%"=="5" (
    call :commit_all
    goto menu
)
if "%choice%"=="6" (
    call :push_changes
    goto menu
)
if "%choice%"=="7" (
    echo Exiting script
    exit /b 0
)

echo Invalid option. Please try again.
goto menu

:commit_scripts
echo Committing script files...
git add docs/ai_avatar_assets/*_clips.md
git commit -m "Add AI avatar script files for Dr. Scott and other avatars"
if %ERRORLEVEL% equ 0 (
    echo Commit successful!
) else (
    echo Commit failed. Please check for errors and try again.
)
exit /b 0

:commit_metadata
echo Committing metadata files...
git add docs/ai_avatar_assets/avatar_metadata.json
git commit -m "Add AI avatar metadata with Dr. Scott's settings"
if %ERRORLEVEL% equ 0 (
    echo Commit successful!
) else (
    echo Commit failed. Please check for errors and try again.
)
exit /b 0

:commit_guide
echo Committing implementation guide...
git add docs/ai_avatar_assets/implementation_guide.md
git commit -m "Add AI avatar implementation guide for HeyGen integration"
if %ERRORLEVEL% equ 0 (
    echo Commit successful!
) else (
    echo Commit failed. Please check for errors and try again.
)
exit /b 0

:commit_videos
set /p video_path=Enter path to video files (e.g., public/videos/avatars/teacher): 
if exist "%video_path%" (
    echo Committing generated videos...
    git add %video_path%
    git commit -m "Add generated AI avatar videos for %video_path%"
    if %ERRORLEVEL% equ 0 (
        echo Commit successful!
    ) else (
        echo Commit failed. Please check for errors and try again.
    )
) else (
    echo Error: Directory %video_path% does not exist
)
exit /b 0

:commit_all
echo Committing all AI avatar assets...
git add docs/ai_avatar_assets/
git commit -m "Add all AI avatar assets including scripts, metadata, and implementation guide"
if %ERRORLEVEL% equ 0 (
    echo Commit successful!
) else (
    echo Commit failed. Please check for errors and try again.
)
exit /b 0

:push_changes
echo Pushing changes to GitHub...
git push origin main
if %ERRORLEVEL% equ 0 (
    echo Push successful!
) else (
    echo Push failed. Please check your connection and GitHub access.
)
exit /b 0