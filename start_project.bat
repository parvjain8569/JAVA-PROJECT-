@echo off
cd /d "%~dp0"
title Banking Simulator Launcher
color 0A

echo ========================================================
echo   Starting Banking Transaction Simulator (Full-Stack)
echo ========================================================
echo.

REM 1. Launch Backend (Java Server + CLI) in a new dedicated window
echo [1/2] Starting Java Backend on port 8080...
start "Apex Bank - Java Backend Server" cmd /k "cd /d "%~dp0backend" && compile_and_run.bat"

REM Brief 2-second wait so the backend server initializes
timeout /t 2 /nobreak >nul

REM 2. Launch Frontend (React + Vite) in another dedicated window
echo [2/2] Starting React Frontend on port 5173...
start "Apex Bank - React Frontend" cmd /k "cd /d "%~dp0frontend" && run_frontend.bat"

echo.
echo ========================================================
echo   Both services are launching in separate windows!
echo   - Backend API : http://localhost:8080/api
echo   - Frontend UI : http://localhost:5173/
echo ========================================================
echo.
echo You can keep this launcher window or close it.
pause
