@echo off
title PRO-INSECTA - Docker indító

echo ============================================
echo   PRO-INSECTA - Docker alapú indítás
echo ============================================
echo.

:: Ellenőrizzük, hogy a Docker fut-e
echo Docker ellenőrzése...
docker --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [HIBA] A Docker nincs telepítve vagy nincs a PATH-ban.
    echo Telepítés: https://www.docker.com/products/docker-desktop/
    pause
    exit /b
)

echo Docker fut. Indítás...
echo.

:: Docker Compose build + start
docker-compose up --build -d

IF %ERRORLEVEL% NEQ 0 (
    echo [HIBA] A Docker Compose indítása sikertelen.
    pause
    exit /b
)

echo.
echo Backend elérhető:  http://localhost:8000
echo Frontend elérhető: http://localhost:5173
echo.

:: Böngésző automatikus megnyitása
start http://localhost:5173

echo Rendszer sikeresen elindítva!
pause
