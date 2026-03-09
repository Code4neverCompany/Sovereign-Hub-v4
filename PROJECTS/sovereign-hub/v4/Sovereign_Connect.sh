#!/bin/bash
# 🔱 SOVEREIGN_HUB v4.0 DASHBOARD CONNECTOR
# Platform: Linux / macOS
# Objective: Direct Link to C2 Center

TARGET="http://100.93.140.118:8080/"

echo "🔱 Materializing Sovereign_Hub HQ..."
echo "🔱 Establishing Bridge: $TARGET"

# Check for Chrome (macOS)
if [ -d "/Applications/Google Chrome.app" ]; then
    open -a "Google Chrome" --args --app="$TARGET" --start-fullscreen
    exit 0
fi

# Check for Chrome (Linux)
if command -v google-chrome &> /dev/null; then
    google-chrome --app="$TARGET" --start-fullscreen
    exit 0
fi

# Check for Brave
if command -v brave-browser &> /dev/null; then
    brave-browser --app="$TARGET" --start-fullscreen
    exit 0
fi

# Default Fallback
if [[ "$OSTYPE" == "darwin"* ]]; then
    open "$TARGET"
else
    xdg-open "$TARGET"
fi
