@echo off
title IAMMUSIC - Setup e Avvio
color 0A

echo ========================================
echo    🎵 IAMMUSIC - Setup Wizard 🎵
echo ========================================
echo.

REM Verifica se Node.js è installato
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js non è installato!
    echo.
    echo 📥 Per favore, installa Node.js da:
    echo    https://nodejs.org/
    echo.
    echo Dopo l'installazione, riavvia questo file.
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js installato: 
node --version
echo.

REM Verifica se npm è installato
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm non trovato!
    echo Per favore, reinstalla Node.js.
    pause
    exit /b 1
)

echo ✅ npm installato:
npm --version
echo.

REM Verifica se il file .env esiste nel server
if not exist "server\.env" (
    echo ⚠️  ATTENZIONE: File .env non trovato!
    echo.
    echo Per favore, configura le credenziali Spotify:
    echo 1. Vai nella cartella 'server'
    echo 2. Copia '.env.example' in '.env'
    echo 3. Modifica '.env' con le tue credenziali Spotify
    echo.
    echo Ottieni le credenziali da: https://developer.spotify.com/dashboard
    echo.
    pause
)

echo ========================================
echo    📦 Installazione Dipendenze
echo ========================================
echo.

REM Verifica se node_modules esiste
if not exist "node_modules" (
    echo 🔄 Installazione dipendenze in corso...
    echo Questo potrebbe richiedere alcuni minuti...
    echo.
    call npm run install-all
    
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ❌ Errore durante l'installazione!
        echo.
        pause
        exit /b 1
    )
    
    echo.
    echo ✅ Dipendenze installate con successo!
    echo.
) else (
    echo ✅ Dipendenze già installate
    echo.
)

echo ========================================
echo    🚀 Avvio Applicazione
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🖥️  Backend:  http://localhost:3001
echo.
echo ⚠️  Per fermare l'applicazione, premi Ctrl+C
echo.
echo Avvio in corso...
echo.

REM Avvia l'applicazione
call npm run dev

pause
