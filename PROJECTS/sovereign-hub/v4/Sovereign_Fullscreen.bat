@echo off
:: 🔱 SOVEREIGN_HUB v4.0 FULLSCREEN DESKTOP LAUNCHER
:: Designed for Maurice-Gaming-PC

set "URL=http://100.93.140.118:8080/"

echo 🔱 Materializing Sovereign_Hub v4.0 in Fullscreen Mode...

:: Try to launch Chrome in True Fullscreen App Mode
:: --app: Removes toolbars
:: --start-fullscreen: Forces F11/Fullscreen mode immediately
start "" "chrome.exe" --app="%URL%" --start-fullscreen
if %ERRORLEVEL% EQU 0 goto :DONE

:: Fallback to Edge if Chrome is not present
echo 🔱 Chrome not detected. Materializing via Edge...
start "" "msedge.exe" --app="%URL%" --start-fullscreen
if %ERRORLEVEL% EQU 0 goto :DONE

:: Final Fallback
start "" "%URL%"

:DONE
exit
