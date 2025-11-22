#!/bin/sh
# Start Vite Dev Server im Hintergrund, wenn er nicht bereits läuft

if ! pgrep -f "vite" > /dev/null; then
  echo "Starting Vite Dev Server..."
  npm run dev -- --host 0.0.0.0 > /tmp/vite.log 2>&1 &
  echo "Vite Dev Server started. Logs: tail -f /tmp/vite.log"
else
  echo "Vite Dev Server is already running"
fi


