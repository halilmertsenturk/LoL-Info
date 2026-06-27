# Starts home Riot proxy + Cloudflare quick tunnel, then syncs Render env.
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

function Get-DotEnvValue([string]$key) {
  $line = Get-Content '.env' | Where-Object { $_ -match "^\s*$key=" } | Select-Object -First 1
  if (-not $line) { return $null }
  return ($line -split '=', 2)[1].Trim()
}

$proxyPort = Get-DotEnvValue 'RIOT_PROXY_PORT'
if (-not $proxyPort) { $proxyPort = '8787' }

Write-Host 'Starting home Riot proxy...'
$proxyJob = Start-Process -FilePath 'node' -ArgumentList 'scripts/home-riot-proxy.js' -WorkingDirectory $root -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 2

$health = Invoke-RestMethod -Uri "http://localhost:$proxyPort/health" -TimeoutSec 10
if (-not $health.ok) { throw 'Home proxy failed health check' }
Write-Host 'Home proxy is running on port' $proxyPort

$cloudflared = Get-Command cloudflared -ErrorAction SilentlyContinue
if (-not $cloudflared) {
  $candidates = @(
    "$env:ProgramFiles\cloudflared\cloudflared.exe",
    "${env:ProgramFiles(x86)}\cloudflared\cloudflared.exe"
  )
  foreach ($candidate in $candidates) {
    if (Test-Path $candidate) {
      $cloudflared = $candidate
      break
    }
  }
}

if (-not $cloudflared) {
  throw 'cloudflared not found. Install with: winget install Cloudflare.cloudflared'
}

$cloudflaredExe = if ($cloudflared -is [string]) { $cloudflared } else { $cloudflared.Source }

Write-Host 'Starting Cloudflare tunnel...'
$tunnelLog = Join-Path $root '.proxy-tunnel.log'
if (Test-Path $tunnelLog) { Remove-Item $tunnelLog -Force }

$tunnelProc = Start-Process -FilePath $cloudflaredExe -ArgumentList @(
  'tunnel',
  '--url',
  "http://localhost:$proxyPort",
  '--logfile',
  $tunnelLog,
  '--loglevel',
  'info'
) -PassThru -WindowStyle Hidden

$tunnelUrl = $null
for ($i = 0; $i -lt 30; $i++) {
  Start-Sleep -Seconds 2
  if (Test-Path $tunnelLog) {
    $match = Select-String -Path $tunnelLog -Pattern 'https://[a-z0-9-]+\.trycloudflare\.com' | Select-Object -Last 1
    if ($match) {
      $tunnelUrl = $match.Matches[0].Value
      break
    }
  }
}

if (-not $tunnelUrl) {
  Stop-Process -Id $tunnelProc.Id -Force -ErrorAction SilentlyContinue
  Stop-Process -Id $proxyJob.Id -Force -ErrorAction SilentlyContinue
  throw 'Could not read Cloudflare tunnel URL from log'
}

Set-Content -Path (Join-Path $root '.proxy-url') -Value $tunnelUrl -NoNewline
Write-Host 'Tunnel URL:' $tunnelUrl

$envFile = Join-Path $root '.env'
$content = Get-Content $envFile -Raw
if ($content -match '(?m)^RIOT_PROXY_URL=') {
  $content = [regex]::Replace($content, '(?m)^RIOT_PROXY_URL=.*$', "RIOT_PROXY_URL=$tunnelUrl")
} else {
  $content += "`nRIOT_PROXY_URL=$tunnelUrl"
}
Set-Content -Path $envFile -Value $content.TrimEnd() -NoNewline

$pids = @{
  proxyPid = $proxyJob.Id
  tunnelPid = $tunnelProc.Id
  tunnelUrl = $tunnelUrl
  startedAt = (Get-Date).ToString('o')
}
$pids | ConvertTo-Json | Set-Content -Path (Join-Path $root '.proxy-stack.pid')

$renderApiKey = Get-DotEnvValue 'RENDER_API_KEY'
if ($renderApiKey) {
  Write-Host 'Syncing Render environment...'
  node scripts/sync-render-proxy.js
} else {
  Write-Host 'RENDER_API_KEY not set — updating render.yaml for deploy instead.'
}

Write-Host 'Done. Keep this PC awake while the public site uses the home proxy.'
