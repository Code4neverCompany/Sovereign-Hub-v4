@echo off
:: 🔱 SOVEREIGN_HUB v4.0 FULLSCREEN LAUNCHER (FIXED)
:: Optimized for Maurice-Gaming-PC
:: Fixes: ERR_BLOCKED_BY_CLIENT / Extension Interference

set "URL=http://100.93.140.118:8080/index.html"

echo 🔱 Materializing Sovereign_Hub v4.0...
echo 🔱 Bypassing Extension Interference...

:: Logic: Use a clean profile and disable extensions to prevent AdBlock/Security blocks
set "FLAGS=--app="%URL%" --start-fullscreen --disable-extensions --user-data-dir="%TEMP%\SovereignHubHQ""

where chrome >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start "" chrome %FLAGS%
    goto :DONE
)

:: Check for Edge if Chrome is not in PATH
where msedge >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start "" msedge %FLAGS%
    goto :DONE
)

:: Fallback if both tools are not in PATH (Standard paths)
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" %FLAGS%
    goto :DONE
)

if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" %FLAGS%
    goto :DONE
)

:: Final Fallback
start "" "%URL%"

:DONE
exit
