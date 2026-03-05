@echo off
:: ============================================
:: 🔱 Sovereign_Hub v4.0: UNSTOPPABLE_LAUNCHER (.bat)
:: High-Velocity Materialization for Windows
:: ============================================
title 🔱 Sovereign Hub v4.0 Launcher 🔱
color 0E

echo 🔱 INITIALIZING SOVEREIGN_HUB v4.0 HUD...
echo 🔱 ESTABLISHING TAILSCALE TUNNEL BRIDGE...

:: Target URL (Tailscale DNS)
set "TARGET_URL=http://bot-pod-1772662257-38fa3cf8.tailcb3609.ts.net/index.html"

:: 1. Attempt Launch via Chrome (App Mode)
echo 🔱 ATTEMPTING CHROME MATERIALIZATION...
start "" "chrome.exe" --app="%TARGET_URL%" --window-size=1600,900
if %ERRORLEVEL% EQU 0 goto :SUCCESS

:: 2. Attempt Launch via Edge (App Mode)
echo 🔱 [CHROME NOT FOUND] ATTEMPTING EDGE MATERIALIZATION...
start "" "msedge.exe" --app="%TARGET_URL%" --window-size=1600,900
if %ERRORLEVEL% EQU 0 goto :SUCCESS

:: 3. Final Fallback (Default Browser)
echo 🔱 [APP MODE FAILED] LAUNCHING VIA DEFAULT BROWSER...
start "" "%TARGET_URL%"
if %ERRORLEVEL% EQU 0 goto :SUCCESS

:ERROR
color 0C
echo.
echo 🔱 [CRITICAL_ERROR]: NO SUITABLE ENGINE FOUND OR TAILSCALE BLOCKED.
echo 🔱 [SOLUTION]: 1. Ensure Tailscale is active and connected.
echo 🔱 [SOLUTION]: 2. Ensure you have Chrome or Edge installed.
echo.
pause
exit

:SUCCESS
echo.
echo 🔱 MATERIALIZATION SUCCESSFUL: THE VOID AND THE GOLD ARE MANIFEST.
timeout /t 5
exit
