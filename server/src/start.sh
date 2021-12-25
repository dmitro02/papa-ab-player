#!/bin/bash

LIBRARY="/home/pi/Audiobooks"

PORT=8888

APP_DIR=$(dirname "${BASH_SOURCE[0]}")

cd $APP_DIR

npm install

node server.js $LIBRARY $PORT 2 > server.log 2>&1 &

chromium-browser --start-fullscreen --app=http://localhost:$PORT

