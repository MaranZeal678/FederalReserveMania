#!/bin/bash

# Kill any existing processes on ports 5001 and 5173
lsof -i :5001 | awk 'NR!=1 {print $2}' | xargs kill -9 2>/dev/null
lsof -i :5173 | awk 'NR!=1 {print $2}' | xargs kill -9 2>/dev/null

# Start Backend
echo "Starting Central Bank Mainframe (Backend)..."
source .venv/bin/activate
export DATABASE_URL=sqlite:////Users/maran/Desktop/Macromania/backend/macromania.db
python backend/app.py &
BACKEND_PID=$!

# Wait for backend to initialize
sleep 2

# Start Frontend
echo "Initializing Terminal Interface (Frontend)..."
npm run dev &
FRONTEND_PID=$!

echo "Simulation Systems Active."
echo "Access Terminal at: http://localhost:5173"
echo "Press CTRL+C to Shutdown."

# Handle shutdown
trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT

wait
