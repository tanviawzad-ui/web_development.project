@echo off
:: Self-elevating batch script to configure SQL Server Express
net session >nul 2>&1
if %errorLevel% == 0 (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0configure_sqlserver.ps1"
    echo.
    echo Press any key to exit...
    pause >nul
) else (
    echo Requesting Administrator privileges to configure SQL Server...
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~dp0setup_sqlserver.bat\"\"' -Verb RunAs"
)
