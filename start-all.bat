@echo off
echo Starting ModeM Application...

:: Start Backend
start "ModeM Backend" cmd /k "cd backend && npm run start:dev"

:: Start Frontend
start "ModeM Frontend" cmd /k "cd frontend && npm run dev"

:: Start WhatsApp Service
start "ModeM WhatsApp Service" cmd /k "cd whatsapp-service && npm start"

echo All services started!
