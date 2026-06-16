param(
  [string]$HostIp = "192.168.31.223",
  [int]$FrontendPort = 5174,
  [int]$BackendPort = 8001
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

$env:VITE_API_BASE_URL = "https://${HostIp}:${BackendPort}"
$env:VITE_HTTPS_KEY = Join-Path $Root ".certs\ai-fit-local.key"
$env:VITE_HTTPS_CERT = Join-Path $Root ".certs\ai-fit-local.crt"

Set-Location $Root
npm.cmd run dev -- --host 0.0.0.0 --port $FrontendPort
