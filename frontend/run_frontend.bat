@echo off
cd /d "%~dp0"
echo ========================================================
echo   Launching Banking Transaction Simulator (React + Vite)
echo ========================================================

REM Check if node_modules exists, install if missing
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo Starting Vite React Dev Server...
call npm run dev
pause

