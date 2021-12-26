#!/bin/bash

LIBRARY="/home/pi/Audiobooks"

PORT=8888

APP_DIR=$(dirname "${BASH_SOURCE[0]}")

cd $APP_DIR

npm install

if [ -f process.pid ]; then
    kill $(cat process.pid) || true
    rm process.pid
fi

node server.js $LIBRARY $PORT 2 > server.log 2>&1 &
echo $! > process.pid

chromium-browser --start-fullscreen --app=http://localhost:$PORT

