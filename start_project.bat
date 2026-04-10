@echo off
title PRO-INSECTA STARTER
echo ==========================================
echo   PRO-INSECTA - Full Auto Start Script
echo ==========================================
echo.

REM --- Projekt gyökér mappa ---
set PROJECT_DIR=%~dp0

REM --- Python ellenőrzése ---
echo Python ellenorzese...
py --version >nul 2>&1
IF ERRORLEVEL 1 (
    echo HIBA: A Python nincs telepitve vagy nincs a PATH-ban.
    pause
    exit /b
)

REM --- VENV ellenőrzése ---
if not exist "%PROJECT_DIR%venv" (
    echo Nincs virtualis kornyezet, letrehozom...
    cd "%PROJECT_DIR%"
    py -3.12 -m venv venv
)

REM --- VENV aktiválása ---
echo Virtualis kornyezet aktivalasa...
call "%PROJECT_DIR%venv\Scripts\activate"

REM --- Python csomagok telepítése ---
echo Python csomagok telepitese (ha szukseges)...
pip install -r "%PROJECT_DIR%requirements.txt"

REM --- Playwright telepítés (ha nincs) ---
echo Playwright ellenorzese...
playwright --version >nul 2>&1
IF ERRORLEVEL 1 (
    echo Playwright telepitese...
    playwright install chromium
)

REM --- Backend migrációk ---
echo Migraciok futtatasa...
cd "%PROJECT_DIR%backend"
python manage.py makemigrations
python manage.py migrate

REM --- Backend indítása külön ablakban ---
echo Backend inditasa...
start cmd /k "title BACKEND && cd %PROJECT_DIR%backend && call ..\venv\Scripts\activate && python manage.py runserver"

REM --- Frontend csomagok ellenőrzése ---
echo Frontend csomagok ellenorzese...
cd "%PROJECT_DIR%frontend"
if not exist "node_modules" (
    echo node_modules nem talalhato, telepitem...
    npm install
)

REM --- Frontend indítása külön ablakban ---
echo Frontend inditasa...
start cmd /k "title FRONTEND && cd %PROJECT_DIR%frontend && npm run dev"

REM --- Böngésző automatikus megnyitása ---
echo Bongeszo megnyitasa: http://localhost:5173
start "" "http://localhost:5173"

echo.
echo ==========================================
echo   A projekt elindult!
echo   Backend: http://127.0.0.1:8000
echo   Frontend: http://127.0.0.1:5173
echo ==========================================
pause
