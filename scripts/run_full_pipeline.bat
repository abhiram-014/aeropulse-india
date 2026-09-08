@echo off
REM ============================================================
REM  Air Quality Insight Platform — Full Pipeline Runner
REM  Run from the project root directory:
REM    scripts\run_full_pipeline.bat
REM ============================================================

setlocal EnableDelayedExpansion
set "ROOT=%~dp0.."
set "SEPARATOR==================================================="

echo.
echo %SEPARATOR%
echo   Air Quality Insight Platform — Full Pipeline
echo %SEPARATOR%
echo.

REM ── Step 0: Verify Node.js and Python ──────────────────────
echo [Step 0/7] Verifying prerequisites...
where node >nul 2>&1 || (echo   [ERROR] Node.js not found. Install from https://nodejs.org & exit /b 1)
where python >nul 2>&1 || (echo   [ERROR] Python not found. Install from https://python.org & exit /b 1)
echo   OK  Node.js found: & node --version
echo   OK  Python found:  & python --version
echo.

REM ── Step 1: Install root dependencies ──────────────────────
echo [Step 1/7] Installing root npm dependencies...
cd /d "%ROOT%"
call npm install --silent
if errorlevel 1 (echo   [ERROR] Root npm install failed. & exit /b 1)
echo   OK  Root dependencies installed.
echo.

REM ── Step 2: Install backend dependencies ───────────────────
echo [Step 2/7] Installing backend npm dependencies...
cd /d "%ROOT%\backend"
call npm install --silent
if errorlevel 1 (echo   [ERROR] Backend npm install failed. & exit /b 1)
echo   OK  Backend dependencies installed.
echo.

REM ── Step 3: Install frontend dependencies ──────────────────
echo [Step 3/7] Installing frontend npm dependencies...
cd /d "%ROOT%\frontend"
call npm install --silent
if errorlevel 1 (echo   [ERROR] Frontend npm install failed. & exit /b 1)
echo   OK  Frontend dependencies installed.
echo.

REM ── Step 4: Seed the SQLite database ───────────────────────
echo [Step 4/7] Seeding demo database (20 stations, 72h observations)...
cd /d "%ROOT%"
python scripts\seed_database.py --hours 72
if errorlevel 1 (echo   [WARN] seed_database.py failed — continuing without DB seed. Check Python deps.)
echo.

REM ── Step 5: Generate sample NetCDF satellite file ───────────
echo [Step 5/7] Generating sample INSAT-3D NetCDF satellite file...
cd /d "%ROOT%"
python scripts\generate_sample_satellite_nc.py
if errorlevel 1 (echo   [WARN] generate_sample_satellite_nc.py failed — requires netCDF4 or scipy.)
echo.

REM ── Step 6: Train the ML model ─────────────────────────────
echo [Step 6/7] Training PM2.5 forecast model (HistGradientBoosting)...
cd /d "%ROOT%\ml\training"
python train.py
if errorlevel 1 (echo   [WARN] train.py failed — requires scikit-learn/joblib. Run: pip install -r ml/requirements.txt)
echo.

REM ── Step 7: Build frontend and backend ─────────────────────
echo [Step 7/7] Building TypeScript (frontend + backend)...
cd /d "%ROOT%\frontend"
call npm run build
if errorlevel 1 (echo   [ERROR] Frontend build failed. & exit /b 1)

cd /d "%ROOT%\backend"
call npm run build
if errorlevel 1 (echo   [ERROR] Backend build failed. & exit /b 1)

echo.
echo %SEPARATOR%
echo   Pipeline Complete!
echo %SEPARATOR%
echo.
echo   To start the development servers:
echo.
echo     Backend  : cd backend  ^&^& npm run dev   (port 3001)
echo     Frontend : cd frontend ^&^& npm run dev   (port 5173)
echo     ML API   : cd ml       ^&^& uvicorn app.main:app --reload --port 8000
echo.
echo   Run tests:
echo     Backend  : cd backend  ^&^& npm test
echo     Frontend : cd frontend ^&^& npm test
echo.
echo %SEPARATOR%
echo.
endlocal
