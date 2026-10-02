# Solana Agent Desk

Colosseum **Crypto World's Fair** project by **KutluhanETH**.

Open TypeScript agent tooling for Solana builders: safe network and account status reads, MCP-style tool discovery, visible RPC call evidence, and private RPC providers for Earn sidetracks.

## What it does

- Intent router → Solana JSON-RPC tools
- MCP-compatible tool manifest at `/api/tools`
- Agent runner at `POST /api/agent/run`
- Evidence panel with method, params, RPC URL, provider, and response sample
- **Panta pulse** + **RPC Fast pulse** + **Solami pulse** + **wallet activity** tools

## Private RPC data path

Priority when keys are present:

1. `RPCFAST_API_KEY` → `https://solana-rpc.rpcfast.com/?api_key=YOUR_KEY`
2. `SOLAMI_API_KEY` → `https://rpc.solami.fast/sol?api_key=YOUR_KEY`
3. else `SOLANA_RPC_URL` or public mainnet

Evidence URLs mask secrets. Optional force:

```bash
SOLANA_RPC_PROVIDER=rpcfast
```

RPC Fast signup Start plan free: https://rpcfast.com/  
Solami Earn referral Pro trial: https://solami.dev/signup?ref=st-earn-sep-26


## Panta API path

When `PANTA_API_KEY` is set (`pk_test_…` or `pk_live_…`), desk tools call:

`https://live-api.panta.market/api/v1`

Auth header: `X-Api-Key`. Docs: https://docs.panta.market/quickstart

Tools: `panta_pulse` · `panta_list_markets` · `panta_get_market`

## Tools

| Tool | RPC methods |
|---|---|
| `get_slot` | `getSlot` |
| `get_health` | `getHealth` |
| `get_version` | `getVersion` |
| `get_latest_blockhash` | `getLatestBlockhash` |
| `get_balance` | `getBalance` |
| `get_account_info` | `getAccountInfo` |
| `network_briefing` | health + slot + version + blockhash |
| `rpcfast_pulse` | health + slot + block height + version + blockhash |
| `solami_pulse` | health + slot + block height + version + blockhash |
| `wallet_activity` | getBalance + getSignaturesForAddress |
| `prepare_transfer` | getBalance + getLatestBlockhash + getFeeForMessage |
| `confirm_receipt` | getSignatureStatuses + getTransaction |

## Product UI

- Light / dark theme toggle (persisted)
- Language selector: English (default) plus Turkish, Russian, Chinese, Arabic, French, Spanish, Azerbaijani
- Tip modal with builder wallet `2bxYH2aQrjzAAe6A7Xakuy9uQoqLFYFqihsm3WRmCWpA`
- Multi-wallet connect modal: Phantom, Solflare, Backpack, Glow, Coinbase Wallet

## Wallet prepare & receipt

UI section on the home page:
1. Connect a Solana wallet from the header modal, or paste a from address
2. Prepare transfer tool builds a SOL transfer plan with evidence
3. Sign & send via the connected wallet when available
4. Confirm receipt by signature

## Run locally

```bash
cd solana-agent-desk
npm install
cp .env.example .env.local
# paste RPCFAST_API_KEY and/or SOLAMI_API_KEY from dashboards
npm run dev
```

Open [http://127.0.0.1:43165](http://127.0.0.1:43165).

## Public deploy (free Vercel)

```powershell
cd solana-agent-desk
.\DEPLOY_VERCEL.ps1
```

Or: connect `kutluhaneth46/solana-agent-desk` in the Vercel dashboard → Deploy.
Hobby plan is enough. Optional server env: `RPCFAST_API_KEY`, `SOLAMI_API_KEY`, `PANTA_API_KEY`.
Without keys, public mainnet RPC / mock fallback still demos the desk.

### Env

```bash
# Preferred for RPC Fast Infrastructure Sidetrack
RPCFAST_API_KEY=your_rpcfast_key
SOLANA_RPC_PROVIDER=rpcfast
SOLANA_FORCE_LIVE=1

# Preferred for Solami Earn track
# SOLAMI_API_KEY=your_solami_key
# SOLANA_RPC_PROVIDER=solami

# Optional full URL override
# SOLANA_RPC_URL=https://solana-rpc.rpcfast.com/?api_key=your_key
```

Default without key: Solana mainnet public endpoint.

If live RPC TLS is blocked in the environment, the desk auto-falls back to mock fixtures unless `SOLANA_FORCE_LIVE=1`. On a normal PC with a private RPC key, live mainnet calls succeed.

## Colosseum + Earn

Project name: **Solana Agent Desk**  
Tracks: Solana on Colosseum · Solami + RPC Fast + Panta sidetracks on Superteam Earn  
Deadline: October 12 to 13, 2026 window

Seed PoW: CMC Agent Desk pattern + Cookie Pulse wallet surface.
