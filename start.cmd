@echo off
cd /d "%~dp0"
docker compose up -d --build
if errorlevel 1 (
  pause
  exit /b 1
)
curl -s -o nul --retry 30 --retry-delay 2 --retry-all-errors http://localhost:8000/
start "" http://localhost:8000
