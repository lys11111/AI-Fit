param(
  [int]$FrontendPort = 5175,
  [int]$BackendPort = 8000
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

$env:VITE_API_BASE_URL = "relative"
$env:VITE_PROXY_BACKEND = "http://127.0.0.1:${BackendPort}"

Set-Location $Root
npm.cmd run dev -- --host 127.0.0.1 --port $FrontendPort

