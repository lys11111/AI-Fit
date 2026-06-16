param(
  [int]$Port = 8001
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Backend = Join-Path $Root "backend"
$Python = Join-Path $Backend ".venv\Scripts\python.exe"
$Key = Join-Path $Root ".certs\ai-fit-local.key"
$Cert = Join-Path $Root ".certs\ai-fit-local.crt"

Set-Location $Backend
& $Python -m uvicorn app.main:app --host 0.0.0.0 --port $Port --ssl-keyfile $Key --ssl-certfile $Cert
