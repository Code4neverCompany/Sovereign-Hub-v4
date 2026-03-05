# ============================================
# 🔱 Sovereign_Hub v4.0: One-Click Desktop App (Windows)
# Materialization: Lux Aesthetic 3.0 Standard
# ============================================

# Target URL (Tailscale DNS Entry)
$targetUrl = "http://bot-pod-1772662257-38fa3cf8.tailcb3609.ts.net/index.html"

# Detect Chrome Path (Primary Browser)
$chromePath = "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chromePath)) { 
    $chromePath = "${env:ProgramFiles}\Google\Chrome\Application\chrome.exe" 
}

# Fallback to Edge (Technical Standard)
if (-not (Test-Path $chromePath)) {
    $chromePath = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
}

if (-not (Test-Path $chromePath)) {
    Write-Host "🔱 [ERROR]: NO SUITABLE BROWSER DETECTED FOR MATERIALIZATION." -ForegroundColor Red
    Pause
    Exit
}

Write-Host "🔱 INITIALIZING SOVEREIGN_HUB v4.0 HUD..." -ForegroundColor Gold
Write-Host "🔱 ESTABLISHING TAILSCALE TUNNEL BRIDGE..." -ForegroundColor Cyan

# Launch Link in APP MODE (Dedicated window without toolbars/address bar)
# --app: dedicated window mode
# --start-fullscreen: (Optional) Fullscreen experience
# --window-size: Balanced size for high-inertia viewing
Start-Process $chromePath -ArgumentList "--app=$targetUrl", "--window-size=1600,900"

Write-Host "🔱 MATERIALIZATION SUCCESSFUL: THE VOID AND THE GOLD ARE MANIFEST." -ForegroundColor Gold
Sleep -Seconds 2
