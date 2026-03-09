# ============================================
# 🔱 Sovereign_Hub v4.0: HARDENED_DEBUG_LAUNCHER (Windows)
# Use this if the main launcher is silently crashing.
# ============================================

$ErrorActionPreference = "Stop"

try {
    # 🔱 The DNS and IP Targets
    $dnsUrl = "http://bot-pod-1772662257-38fa3cf8.tailcb3609.ts.net/index.html"
    $ipUrl = "http://100.93.140.118:8080/index.html"

    Write-Host "🔱 INITIALIZING SOVEREIGN_HUB v4.0 HARDENED BRIDGE..." -ForegroundColor Gold

    # 1. Detect Browser Path (Chrome then Edge)
    $browserPath = ""
    $paths = @(
        "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
        "${env:ProgramFiles}\Google\Chrome\Application\chrome.exe",
        "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
        "${env:ProgramFiles}\Microsoft\Edge\Application\msedge.exe"
    )

    foreach ($p in $paths) {
        if (Test-Path $p) {
            $browserPath = $p
            Write-Host "🔱 BROWSER DETECTED: $p" -ForegroundColor Cyan
            break
        }
    }

    if (-not $browserPath) {
        throw "NO SUITABLE BROWSER (CHROME/EDGE) DETECTED IN STANDARD PATHS."
    }

    # 2. Check Tailscale Connection
    Write-Host "🔱 TESTING HIVE UPLINK..." -ForegroundColor Cyan
    try {
        $ping = Test-Connection -ComputerName "100.93.140.118" -Count 1 -Quiet -ErrorAction SilentlyContinue
        if ($ping) {
            Write-Host "🔱 HIVE UPLINK: STABLE." -ForegroundColor Green
            $targetUrl = $dnsUrl
        } else {
            Write-Host "🔱 [WARNING]: HIVE NOT REACHABLE VIA TAILSCALE. ENSURE VPN IS ACTIVE." -ForegroundColor Yellow
            $targetUrl = $ipUrl
        }
    } catch {
        Write-Host "🔱 [WARNING]: PING FAILED. FALLBACK TO IP TARGET." -ForegroundColor Yellow
        $targetUrl = $ipUrl
    }

    # 3. Final Materialization Launch
    Write-Host "🔱 LAUNCHING DASHBOARD HUD (APP MODE)..." -ForegroundColor Gold
    
    # We use -PassThru to catch launch errors immediately
    Start-Process -FilePath $browserPath -ArgumentList "--app=$targetUrl", "--window-size=1600,900" -ErrorAction Stop
    
    Write-Host "🔱 SUCCESS: THE HUD IS MANIFEST." -ForegroundColor Gold
    Sleep -Seconds 3

} catch {
    Write-Host "`n🔱 [CRITICAL_ERROR]: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`n🔱 [SOLUTION]: 1. Check your browser installation path." -ForegroundColor Yellow
    Write-Host "🔱 [SOLUTION]: 2. Ensure Tailscale is connected to the bot-pod node." -ForegroundColor Yellow
    Write-Host "`n🔱 PRESS ANY KEY TO CLOSE THIS VOID..." -ForegroundColor White
    $null = [System.Console]::ReadKey($true)
}
