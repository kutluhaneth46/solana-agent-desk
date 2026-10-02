# One-shot: clone Solana Agent Desk + deploy free Vercel
# Paste entire block into PowerShell from any folder (e.g. C:\Users\caspe)

$ErrorActionPreference = "Stop"
$Repo = "https://github.com/kutluhaneth46/solana-agent-desk.git"
$Root = Join-Path $HOME "Projects"
$Dir  = Join-Path $Root "solana-agent-desk"

Write-Host "== target: $Dir ==" -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path $Root | Out-Null

if (Test-Path (Join-Path $Dir ".git")) {
  Set-Location $Dir
  Write-Host "== git pull ==" -ForegroundColor Cyan
  git pull --ff-only
} else {
  if (Test-Path $Dir) {
    Write-Host "Folder exists but is not git. Remove or rename: $Dir" -ForegroundColor Red
    exit 1
  }
  Write-Host "== git clone ==" -ForegroundColor Cyan
  git clone $Repo $Dir
  Set-Location $Dir
}

Write-Host "== npm install ==" -ForegroundColor Cyan
npm install

Write-Host "== vercel CLI ==" -ForegroundColor Cyan
npm install -g vercel

Write-Host "== vercel login (browser opens) ==" -ForegroundColor Cyan
vercel login

Write-Host "== vercel --prod ==" -ForegroundColor Cyan
vercel --prod --yes

Write-Host ""
Write-Host "DONE. Copy the https://....vercel.app URL." -ForegroundColor Green
Write-Host "Optional later in Vercel dashboard env: RPCFAST_API_KEY SOLAMI_API_KEY PANTA_API_KEY" -ForegroundColor Yellow
