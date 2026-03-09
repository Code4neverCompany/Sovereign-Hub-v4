@echo off
:: 🔱 SOVEREIGN_HUB v4.0 DIRECT LAUNCHER (VERIFIED)
:: Fixes: Opening Google Homepage instead of Dashboard

set "TARGET=http://100.93.140.118:8080/index.html"

echo 🔱 Materializing Sovereign_Hub HQ...
echo 🔱 Establishing IP Bridge: %TARGET%

:: Method: Direct execution without complex variable passing to avoid shell interpretation errors
:: We use --app as the primary flag. --start-fullscreen is added after the URL.

where chrome >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start "" chrome --app=%TARGET% --start-fullscreen --disable-extensions
    goto :DONE
)

:: Edge Fallback
where msedge >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start "" msedge --app=%TARGET% --start-fullscreen --disable-extensions
    goto :DONE
)

:: Manual Path Check
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app=%TARGET% --start-fullscreen --disable-extensions
    goto :DONE
)

:: Final Fallback (Default Browser)
start "" %TARGET%

:DONE
exit
