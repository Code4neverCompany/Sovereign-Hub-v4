@echo off
:: SOVEREIGN_HUB v4.0 SIMPLE LAUNCHER
:: No complex characters to avoid encoding issues.

set "URL=http://100.93.140.118:8080/index.html"

echo Initializing Sovereign Hub v4.0...

:: Try Chrome
start "" "chrome.exe" --app="%URL%" --window-size=1600,900 --start-fullscreen
if %ERRORLEVEL% EQU 0 goto :DONE

:: Try Edge
echo Chrome not found. Trying Edge...
start "" "msedge.exe" --app="%URL%" --window-size=1600,900 --start-fullscreen
if %ERRORLEVEL% EQU 0 goto :DONE

:: Try Default
echo Edge not found. Opening Default Browser...
start "" "%URL%"

:DONE
echo Materialization sequence initiated.
timeout 3
exit
