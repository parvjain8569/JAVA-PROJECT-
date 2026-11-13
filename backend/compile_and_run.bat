@echo off
cd /d "%~dp0"
echo ========================================================
echo   Compiling Banking Transaction Simulator (Core Java)
echo ========================================================

REM Create bin directory if it doesn't exist
if not exist "bin" mkdir bin

REM Compile all Java source files
javac -d bin src\com\bank\model\*.java src\com\bank\exception\*.java src\com\bank\repository\*.java src\com\bank\service\*.java src\com\bank\util\*.java src\com\bank\server\*.java src\com\bank\cli\*.java src\com\bank\*.java

if %ERRORLEVEL% EQU 0 (
    echo [OK] Compilation successful!
    echo ========================================================
    echo   Starting Banking Application (Server + CLI)
    echo ========================================================
    java -cp bin com.bank.BankingApplication
) else (
    echo [ERROR] Compilation failed. Please ensure JDK 17+ or JDK 21 is installed and available in PATH.
    pause
)

