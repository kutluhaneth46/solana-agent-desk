# Deploy Solana Agent Desk to Vercel (free hobby) · Windows
# Prereq: Node 20+, GitHub repo kutluhaneth46/solana-agent-desk already pushed

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "== npm install ==" -ForegroundColor Cyan
npm install

Write-Host "== vercel CLI ==" -ForegroundColor Cyan
npm install -g vercel

Write-Host "== login (browser) ==" -ForegroundColor Cyan
vercel login

Write-Host "== production deploy ==" -ForegroundColor Cyan
vercel --prod --yes

Write-Host ""
Write-Host "Optional env (Vercel Project → Settings → Environment Variables):" -ForegroundColor Yellow
Write-Host "  RPCFAST_API_KEY"
Write-Host "  SOLAMI_API_KEY"
Write-Host "  PANTA_API_KEY"
Write-Host "  SOLANA_RPC_PROVIDER=rpcfast"
Write-Host "Without keys the public demo still works on Solana public RPC / mock fallback."
Write-Host ""
Write-Host "Copy the *.vercel.app URL into Talent / Wantapply / CV links." -ForegroundColor Green
