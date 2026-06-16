param(
  [int]$FrontendPort = 5175,
  [int]$BackendPort = 8001
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Logs = Join-Path $Root ".logs"
$Cloudflared = Join-Path $Root "tools\cloudflared.exe"

New-Item -ItemType Directory -Force -Path $Logs | Out-Null

function Stop-PortListeners([int]$Port) {
  $lines = netstat -ano | findstr ":$Port"
  foreach ($line in $lines) {
    $parts = ($line -split "\s+") | Where-Object { $_ }
    if ($parts.Length -ge 5 -and $parts[1] -match ":$Port$") {
      Stop-Process -Id ([int]$parts[-1]) -Force -ErrorAction SilentlyContinue
    }
  }
}

function Start-HiddenProcess([string]$FileName, [string]$Arguments, [string]$WorkingDirectory) {
  $process = New-Object System.Diagnostics.Process
  $process.StartInfo.FileName = $FileName
  $process.StartInfo.Arguments = $Arguments
  $process.StartInfo.WorkingDirectory = $WorkingDirectory
  $process.StartInfo.UseShellExecute = $true
  $process.StartInfo.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Hidden
  [void]$process.Start()
  return $process
}

Stop-PortListeners $FrontendPort
Stop-PortListeners $BackendPort

Start-HiddenProcess "powershell.exe" "-NoProfile -ExecutionPolicy Bypass -File `"$Root\scripts\start-public-demo-backend.ps1`" -Port $BackendPort" $Root | Out-Null
Start-Sleep -Seconds 7
Start-HiddenProcess "powershell.exe" "-NoProfile -ExecutionPolicy Bypass -File `"$Root\scripts\start-public-demo-frontend.ps1`" -FrontendPort $FrontendPort -BackendPort $BackendPort" $Root | Out-Null
Start-Sleep -Seconds 5

$tunnelLog = Join-Path $Logs "cloudflared-demo.log"
if (Test-Path $tunnelLog) {
  Remove-Item -LiteralPath $tunnelLog -Force
}

Start-HiddenProcess "powershell.exe" "-NoProfile -ExecutionPolicy Bypass -Command `"& '$Cloudflared' tunnel --url http://127.0.0.1:$FrontendPort *>&1 | Tee-Object -FilePath '$tunnelLog'`"" $Root | Out-Null

$deadline = (Get-Date).AddSeconds(45)
$url = $null
while ((Get-Date) -lt $deadline) {
  if (Test-Path $tunnelLog) {
    $content = Get-Content -LiteralPath $tunnelLog -Raw -ErrorAction SilentlyContinue
    $match = [regex]::Match($content, "https://[a-zA-Z0-9-]+\.trycloudflare\.com")
    if ($match.Success) {
      $url = $match.Value
      break
    }
  }
  Start-Sleep -Seconds 1
}

if (-not $url) {
  Write-Error "Cloudflare tunnel URL was not created. Check $tunnelLog"
}

Write-Output $url
Write-Output "$url/app/equipment/result"
