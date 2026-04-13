@echo off
set PORT=%1
if "%PORT%"=="" set PORT=8081
powershell -ExecutionPolicy Bypass -File "%~dp0start-dev.ps1" -Port %PORT%
