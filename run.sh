#!/bin/bash
# run.sh - Startup script for QBit

echo "=========================================="
echo "       Starting QBit             "
echo "=========================================="

# Start Backend
echo "Starting FastAPI Backend..."
cd backend || exit 1
python -m uvicorn main:app --reload &
BACKEND_PID=$!
cd ..

# Start Frontend
echo "Starting React Frontend..."
cd frontend || exit 1
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "Servers are starting up!"
echo "Backend API: http://localhost:8000"
echo "Frontend UI: http://localhost:5173"
echo "---------------------------------------------------"
echo "Press Ctrl+C to STOP both servers."
echo "---------------------------------------------------"

# Wait for user interrupt
trap "echo ''; echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM
wait
