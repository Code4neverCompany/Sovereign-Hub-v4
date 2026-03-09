@echo off
:: 🔱 SOVEREIGN_HUB v4.0 CLEAN LAUNCHER
:: Designed to bypass "ERR_BLOCKED_BY_CLIENT" (Extension/Policy conflicts)

set "URL=http://100.93.140.118:8080/index.html"

echo 🔱 Materializing Sovereign_Hub v4.0...
echo 🔱 Neutralizing Extension Interference...

:: Launch Chrome with flags to bypass extension blocking and forced policies
:: --disable-extensions: Prevents AdBlock/Security extensions from killing the IP-based uplink
:: --user-data-dir: Uses a temporary profile to avoid cache/policy corruption
:: --app: Clean UI mode
:: --start-fullscreen: HQ Fullscreen mode
start "" "chrome.exe" --app="%URL%" --disable-extensions --user-data-dir="%TEMP%\SovereignHubProfile" --start-fullscreen
if %ERRORLEVEL% EQU 0 goto :DONE

:: Edge Fallback
echo 🔱 Chrome failed. Materializing via Edge (Clean Mode)...
start "" "msedge.exe" --app="%URL%" --disable-extensions --user-data-dir="%TEMP%\SovereignHubProfile" --start-fullscreen
if %ERRORLEVEL% EQU 0 goto :DONE

:: Direct Link Fallback
start "" "%URL%"

:DONE
exit
