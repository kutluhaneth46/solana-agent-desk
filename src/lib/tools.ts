import {
  getRpcProviderLabel,
  lamportsToSol,
  resolveRpcProvider,
  solanaRpc,
  type SolanaCallResult,
} from "@/lib/solana";
import {
  isPantaActive,
  pantaCategories,
  pantaGetMarket,
  pantaListMarkets,
  pantaWhoami,
} from "@/lib/panta";
import { confirmReceipt, prepareTransfer } from "@/lib/transfer";

export type AgentToolName =
  | "get_slot"
  | "get_health"
  | "get_version"
  | "get_latest_blockhash"
  | "get_balance"
  | "get_account_info"
  | "network_briefing"
  | "solami_pulse"
  | "rpcfast_pulse"
  | "panta_pulse"
  | "panta_list_markets"
  | "panta_get_market"
  | "wallet_activity"
  | "prepare_transfer"
  | "confirm_receipt";

export type AgentTool = {
  name: AgentToolName;
  description: string;
  endpoints: string[];
  inputSchema: {
    type: "object";
    properties: Record<string, { type: string; description: string }>;
    required?: string[];
  };
};

export const AGENT_TOOLS: AgentTool[] = [
  {
    name: "get_slot",
    description: "Return the current Solana slot from the configured RPC.",
    endpoints: ["getSlot"],
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_health",
    description: "Check whether the Solana RPC node reports healthy status.",
    endpoints: ["getHealth"],
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_version",
    description: "Fetch solana-core version and feature set from the RPC node.",
    endpoints: ["getVersion"],
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_latest_blockhash",
    description:
      "Fetch the latest blockhash and last valid block height for transaction prep.",
    endpoints: ["getLatestBlockhash"],
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_balance",
    description: "Fetch lamports and SOL balance for a base58 public key.",
    endpoints: ["getBalance"],
    inputSchema: {
      type: "object",
      properties: {
        address: {
          type: "string",
          description: "Base58 Solana address",
        },
      },
      required: ["address"],
    },
  },
  {
    name: "get_account_info",
    description:
      "Fetch account metadata: lamports, owner, executable flag, and data length.",
    endpoints: ["getAccountInfo"],
    inputSchema: {
      type: "object",
      properties: {
        address: {
          type: "string",
          description: "Base58 Solana address",
        },
      },
      required: ["address"],
    },
  },
  {
    name: "network_briefing",
    description:
      "Combined network snapshot: health, slot, version, and latest blockhash.",
    endpoints: ["getHealth", "getSlot", "getVersion", "getLatestBlockhash"],
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "solami_pulse",
    description:
      "Live Solami provider pulse: confirms Solami RPC path, health, slot, version, blockhash, and stream readiness metrics for the evidence panel.",
    endpoints: ["getHealth", "getSlot", "getVersion", "getLatestBlockhash", "getBlockHeight"],
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "rpcfast_pulse",
    description:
      "Live RPC Fast provider pulse: confirms solana-rpc.rpcfast.com path, health, slot, version, blockhash, and height for infrastructure sidetrack evidence.",
    endpoints: ["getHealth", "getSlot", "getVersion", "getLatestBlockhash", "getBlockHeight"],
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "panta_pulse",
    description:
      "Live Panta API pulse: whoami plus categories plus market catalog sample via live-api.panta.market with X-Api-Key evidence.",
    endpoints: ["GET /account/", "GET /categories/", "GET /markets/"],
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "panta_list_markets",
    description:
      "List Panta USDC prediction markets from the public catalog. Optional category filter such as crypto sports politics.",
    endpoints: ["GET /markets/"],
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Optional category slug from GET /categories/",
        },
      },
    },
  },
  {
    name: "panta_get_market",
    description:
      "Fetch one Panta market by marketId including spot YES NO prices when available.",
    endpoints: ["GET /markets/:id/"],
    inputSchema: {
      type: "object",
      properties: {
        marketId: {
          type: "string",
          description: "Panta marketId / event PDA base58",
        },
      },
      required: ["marketId"],
    },
  },
  {
    name: "wallet_activity",
    description:
      "Recent confirmed signatures for a wallet via configured private RPC getSignaturesForAddress. Useful trader and builder activity pulse.",
    endpoints: ["getSignaturesForAddress", "getBalance"],
    inputSchema: {
      type: "object",
      properties: {
        address: {
          type: "string",
          description: "Base58 Solana address",
        },
      },
      required: ["address"],
    },
  },
  {
    name: "prepare_transfer",
    description:
      "Prepare a SOL SystemProgram.transfer: fetch balance and blockhash, estimate fee, return a signable plan with evidence.",
    endpoints: ["getBalance", "getLatestBlockhash", "getFeeForMessage"],
    inputSchema: {
      type: "object",
      properties: {
        from: { type: "string", description: "Sender base58 address" },
        to: { type: "string", description: "Recipient base58 address" },
        sol: { type: "string", description: "Amount in SOL, e.g. 0.01" },
      },
      required: ["from", "to", "sol"],
    },
  },
  {
    name: "confirm_receipt",
    description:
      "Confirm a submitted transfer by signature: status, errors, and explorer link.",
    endpoints: ["getSignatureStatuses", "getTransaction"],
    inputSchema: {
      type: "object",
      properties: {
        signature: {
          type: "string",
          description: "Base58 transaction signature",
        },
      },
      required: ["signature"],
    },
  },
];

export type ToolRunResult = {
  tool: AgentToolName;
  summary: string;
  evidence: SolanaCallResult[];
  payload: unknown;
};

function requireAddress(args: Record<string, string>): string {
  const address = args.address?.trim();
  if (!address) {
    throw new Error("address is required");
  }
  return address;
}

export async function runTool(
  tool: AgentToolName,
  args: Record<string, string> = {},
): Promise<ToolRunResult> {
  switch (tool) {
    case "get_slot": {
      const evidence = await solanaRpc("getSlot", [{ commitment: "processed" }]);
      const slot = evidence.data;
      return {
        tool,
        summary: evidence.ok
          ? `Current slot is ${String(slot)}.`
          : `getSlot failed: ${evidence.error || "unknown error"}`,
        evidence: [evidence],
        payload: { slot },
      };
    }
    case "get_health": {
      const evidence = await solanaRpc("getHealth", []);
      return {
        tool,
        summary: evidence.ok
          ? `RPC health: ${String(evidence.data)}.`
          : `getHealth failed: ${evidence.error || "unknown error"}`,
        evidence: [evidence],
        payload: { health: evidence.data },
      };
    }
    case "get_version": {
      const evidence = await solanaRpc("getVersion", []);
      const version = evidence.data as Record<string, unknown> | null;
      return {
        tool,
        summary: evidence.ok
          ? `solana-core ${String(version?.["solana-core"] ?? "unknown")}.`
          : `getVersion failed: ${evidence.error || "unknown error"}`,
        evidence: [evidence],
        payload: version,
      };
    }
    case "get_latest_blockhash": {
      const evidence = await solanaRpc("getLatestBlockhash", [
        { commitment: "finalized" },
      ]);
      const value = (evidence.data as { value?: Record<string, unknown> } | null)
        ?.value;
      return {
        tool,
        summary: evidence.ok
          ? `Latest blockhash ${String(value?.blockhash ?? "n/a")} valid through height ${String(value?.lastValidBlockHeight ?? "n/a")}.`
          : `getLatestBlockhash failed: ${evidence.error || "unknown error"}`,
        evidence: [evidence],
        payload: value ?? evidence.data,
      };
    }
    case "get_balance": {
      const address = requireAddress(args);
      const evidence = await solanaRpc("getBalance", [
        address,
        { commitment: "confirmed" },
      ]);
      const lamports = Number(
        (evidence.data as { value?: number } | null)?.value ?? 0,
      );
      return {
        tool,
        summary: evidence.ok
          ? `Balance for ${address.slice(0, 4)}…${address.slice(-4)}: ${lamportsToSol(lamports)} SOL (${lamports} lamports).`
          : `getBalance failed: ${evidence.error || "unknown error"}`,
        evidence: [evidence],
        payload: {
          address,
          lamports,
          sol: lamportsToSol(lamports),
        },
      };
    }
    case "get_account_info": {
      const address = requireAddress(args);
      const evidence = await solanaRpc("getAccountInfo", [
        address,
        { encoding: "base64", commitment: "confirmed" },
      ]);
      const value = (evidence.data as { value?: Record<string, unknown> | null })
        ?.value;
      if (!evidence.ok) {
        return {
          tool,
          summary: `getAccountInfo failed: ${evidence.error || "unknown error"}`,
          evidence: [evidence],
          payload: null,
        };
      }
      if (!value) {
        return {
          tool,
          summary: `No account found for ${address}.`,
          evidence: [evidence],
          payload: { address, exists: false },
        };
      }
      const lamports = Number(value.lamports ?? 0);
      return {
        tool,
        summary: `Account owner ${String(value.owner)}. ${lamportsToSol(lamports)} SOL. executable=${String(value.executable)}.`,
        evidence: [evidence],
        payload: {
          address,
          exists: true,
          lamports,
          sol: lamportsToSol(lamports),
          owner: value.owner,
          executable: value.executable,
          rentEpoch: value.rentEpoch,
        },
      };
    }
    case "network_briefing": {
      const evidence = await Promise.all([
        solanaRpc("getHealth", []),
        solanaRpc("getSlot", [{ commitment: "processed" }]),
        solanaRpc("getVersion", []),
        solanaRpc("getLatestBlockhash", [{ commitment: "finalized" }]),
      ]);
      const [health, slot, version, blockhash] = evidence;
      const versionData = version.data as Record<string, unknown> | null;
      const bh = (blockhash.data as { value?: Record<string, unknown> } | null)
        ?.value;
      const okCount = evidence.filter((e) => e.ok).length;
      return {
        tool,
        summary: `Network briefing ${okCount}/4 RPC calls ok via ${getRpcProviderLabel()}. Health=${String(health.data)}. Slot=${String(slot.data)}. Core=${String(versionData?.["solana-core"] ?? "n/a")}. Blockhash ready=${Boolean(bh?.blockhash)}.`,
        evidence,
        payload: {
          provider: resolveRpcProvider(),
          providerLabel: getRpcProviderLabel(),
          health: health.data,
          slot: slot.data,
          version: versionData,
          blockhash: bh ?? null,
          rows: [
            { metric: "provider", value: getRpcProviderLabel() },
            { metric: "health", value: String(health.data) },
            { metric: "slot", value: String(slot.data) },
            {
              metric: "solana-core",
              value: String(versionData?.["solana-core"] ?? "n/a"),
            },
            {
              metric: "blockhash",
              value: String(bh?.blockhash ?? "n/a").slice(0, 16) + "…",
            },
          ],
        },
      };
    }
    case "solami_pulse": {
      const provider = resolveRpcProvider();
      const evidence = await Promise.all([
        solanaRpc("getHealth", []),
        solanaRpc("getSlot", [{ commitment: "processed" }]),
        solanaRpc("getBlockHeight", [{ commitment: "finalized" }]),
        solanaRpc("getVersion", []),
        solanaRpc("getLatestBlockhash", [{ commitment: "finalized" }]),
      ]);
      const [health, slot, height, version, blockhash] = evidence;
      const versionData = version.data as Record<string, unknown> | null;
      const bh = (blockhash.data as { value?: Record<string, unknown> } | null)
        ?.value;
      const okCount = evidence.filter((e) => e.ok).length;
      const usingSolami = provider === "solami";
      return {
        tool,
        summary: usingSolami
          ? `Solami pulse ${okCount}/5 live calls ok. Health=${String(health.data)}. Slot=${String(slot.data)}. Height=${String(height.data)}. Core=${String(versionData?.["solana-core"] ?? "n/a")}.`
          : `Solami key missing. Pulse ran on ${getRpcProviderLabel()} ${okCount}/5 ok. Set SOLAMI_API_KEY for Solami private RPC.`,
        evidence,
        payload: {
          provider,
          providerLabel: getRpcProviderLabel(),
          solamiActive: usingSolami,
          metrics: {
            health: health.data,
            slot: slot.data,
            blockHeight: height.data,
            solanaCore: versionData?.["solana-core"] ?? null,
            blockhash: bh?.blockhash ?? null,
            lastValidBlockHeight: bh?.lastValidBlockHeight ?? null,
            okCount,
            totalCalls: evidence.length,
          },
          rows: [
            { metric: "solami_active", value: String(usingSolami) },
            { metric: "provider", value: getRpcProviderLabel() },
            { metric: "health", value: String(health.data) },
            { metric: "slot", value: String(slot.data) },
            { metric: "block_height", value: String(height.data) },
            {
              metric: "solana-core",
              value: String(versionData?.["solana-core"] ?? "n/a"),
            },
          ],
        },
      };
    }
    case "rpcfast_pulse": {
      const provider = resolveRpcProvider();
      const evidence = await Promise.all([
        solanaRpc("getHealth", []),
        solanaRpc("getSlot", [{ commitment: "processed" }]),
        solanaRpc("getBlockHeight", [{ commitment: "finalized" }]),
        solanaRpc("getVersion", []),
        solanaRpc("getLatestBlockhash", [{ commitment: "finalized" }]),
      ]);
      const [health, slot, height, version, blockhash] = evidence;
      const versionData = version.data as Record<string, unknown> | null;
      const bh = (blockhash.data as { value?: Record<string, unknown> } | null)
        ?.value;
      const okCount = evidence.filter((e) => e.ok).length;
      const usingRpcFast = provider === "rpcfast";
      return {
        tool,
        summary: usingRpcFast
          ? `RPC Fast pulse ${okCount}/5 live calls ok. Health=${String(health.data)}. Slot=${String(slot.data)}. Height=${String(height.data)}. Core=${String(versionData?.["solana-core"] ?? "n/a")}.`
          : `RPCFAST_API_KEY missing. Pulse ran on ${getRpcProviderLabel()} ${okCount}/5 ok. Set RPCFAST_API_KEY for solana-rpc.rpcfast.com.`,
        evidence,
        payload: {
          provider,
          providerLabel: getRpcProviderLabel(),
          rpcfastActive: usingRpcFast,
          metrics: {
            health: health.data,
            slot: slot.data,
            blockHeight: height.data,
            solanaCore: versionData?.["solana-core"] ?? null,
            blockhash: bh?.blockhash ?? null,
            lastValidBlockHeight: bh?.lastValidBlockHeight ?? null,
            okCount,
            totalCalls: evidence.length,
          },
          rows: [
            { metric: "rpcfast_active", value: String(usingRpcFast) },
            { metric: "provider", value: getRpcProviderLabel() },
            { metric: "health", value: String(health.data) },
            { metric: "slot", value: String(slot.data) },
            { metric: "block_height", value: String(height.data) },
            {
              metric: "solana-core",
              value: String(versionData?.["solana-core"] ?? "n/a"),
            },
          ],
        },
      };
    }
    case "panta_pulse": {
      const evidence = await Promise.all([
        pantaWhoami(),
        pantaCategories(),
        pantaListMarkets({ category: "crypto", limit: "5" }),
      ]);
      const [whoami, cats, markets] = evidence;
      const account = whoami.data as {
        email?: string;
        name?: string;
        status?: string;
        canCreateMarkets?: boolean;
      } | null;
      const categories =
        (cats.data as { categories?: string[] } | null)?.categories ?? [];
      const items =
        (markets.data as { items?: Array<{ title?: string; marketId?: string; phase?: string }> } | null)
          ?.items ?? [];
      const okCount = evidence.filter((e) => e.ok).length;
      const active = isPantaActive();
      return {
        tool,
        summary: active
          ? `Panta pulse ${okCount}/3 live calls ok. Account=${account?.email ?? "n/a"} status=${account?.status ?? "n/a"}. Categories=${categories.length}. Markets sample=${items.length}.`
          : `PANTA_API_KEY missing. Pulse used mock or failed ${okCount}/3. Set PANTA_API_KEY from docs.panta.market quickstart.`,
        evidence: evidence as SolanaCallResult[],
        payload: {
          pantaActive: active,
          provider: "panta",
          providerLabel: "Panta live-api.panta.market",
          account,
          categoryCount: categories.length,
          categories,
          marketSampleCount: items.length,
          marketSample: items.slice(0, 5).map((m) => ({
            marketId: m.marketId,
            title: m.title,
            phase: m.phase,
          })),
          rows: [
            { metric: "panta_active", value: String(active) },
            { metric: "account", value: String(account?.email ?? "n/a") },
            { metric: "status", value: String(account?.status ?? "n/a") },
            {
              metric: "can_create_markets",
              value: String(account?.canCreateMarkets ?? "n/a"),
            },
            { metric: "categories", value: String(categories.length) },
            { metric: "markets_sample", value: String(items.length) },
          ],
        },
      };
    }
    case "panta_list_markets": {
      const category = args.category?.trim() || undefined;
      const evidence = await pantaListMarkets({
        category,
        limit: "10",
      });
      const items =
        (evidence.data as { items?: Array<Record<string, unknown>> } | null)
          ?.items ?? [];
      return {
        tool,
        summary: evidence.ok
          ? `Panta markets ${items.length} rows${category ? ` category=${category}` : ""}.`
          : `panta_list_markets failed: ${evidence.error || "unknown"}`,
        evidence: [evidence as SolanaCallResult],
        payload: { category: category ?? null, count: items.length, items },
      };
    }
    case "panta_get_market": {
      const marketId = args.marketId?.trim();
      if (!marketId) throw new Error("marketId is required");
      const evidence = await pantaGetMarket(marketId);
      const row = evidence.data as {
        title?: string;
        phase?: string;
        yesPrice?: string | null;
        noPrice?: string | null;
        volumeUsdc?: string;
      } | null;
      return {
        tool,
        summary: evidence.ok
          ? `Panta market ${row?.title ?? marketId}. Phase=${row?.phase ?? "n/a"} YES=${row?.yesPrice ?? "n/a"} NO=${row?.noPrice ?? "n/a"} vol=${row?.volumeUsdc ?? "n/a"}.`
          : `panta_get_market failed: ${evidence.error || "unknown"}`,
        evidence: [evidence as SolanaCallResult],
        payload: row,
      };
    }
    case "wallet_activity": {
      const address = requireAddress(args);
      const evidence = await Promise.all([
        solanaRpc("getBalance", [address, { commitment: "confirmed" }]),
        solanaRpc("getSignaturesForAddress", [
          address,
          { limit: 8, commitment: "confirmed" },
        ]),
      ]);
      const [balanceEv, sigsEv] = evidence;
      const lamports = Number(
        (balanceEv.data as { value?: number } | null)?.value ?? 0,
      );
      const sigs = Array.isArray(sigsEv.data) ? sigsEv.data : [];
      const recent = sigs.slice(0, 5).map((row) => {
        const r = row as {
          signature?: string;
          slot?: number;
          err?: unknown;
          blockTime?: number | null;
          confirmationStatus?: string;
        };
        return {
          signature: r.signature ?? "",
          slot: r.slot ?? null,
          err: r.err ?? null,
          blockTime: r.blockTime ?? null,
          confirmationStatus: r.confirmationStatus ?? null,
        };
      });
      return {
        tool,
        summary: evidence.every((e) => e.ok)
          ? `Wallet activity via ${getRpcProviderLabel()}. Balance ${lamportsToSol(lamports)} SOL. ${recent.length} recent signatures.`
          : `wallet_activity partial fail on ${getRpcProviderLabel()}.`,
        evidence,
        payload: {
          provider: resolveRpcProvider(),
          address,
          lamports,
          sol: lamportsToSol(lamports),
          recentCount: recent.length,
          recent,
        },
      };
    }
    case "prepare_transfer": {
      if (!args.from?.trim() || !args.to?.trim() || !args.sol?.trim()) {
        throw new Error("from, to, and sol are required");
      }
      const result = await prepareTransfer({
        from: args.from,
        to: args.to,
        sol: args.sol,
      });
      return { tool, ...result };
    }
    case "confirm_receipt": {
      if (!args.signature?.trim()) {
        throw new Error("signature is required");
      }
      const result = await confirmReceipt({ signature: args.signature });
      return { tool, ...result };
    }
    default:
      throw new Error(`Unknown tool: ${tool as string}`);
  }
}

export function routeIntent(prompt: string): {
  tool: AgentToolName;
  args: Record<string, string>;
} {
  const p = prompt.toLowerCase();
  const addressMatch = prompt.match(/[1-9A-HJ-NP-Za-km-z]{32,44}/g) || [];
  const address = addressMatch[0];

  if (
    p.includes("receipt") ||
    p.includes("confirm signature") ||
    p.includes("tx status")
  ) {
    const sig = addressMatch.find((a) => a.length >= 64) || addressMatch[0];
    if (sig) return { tool: "confirm_receipt", args: { signature: sig } };
  }

  if (p.includes("transfer") || p.includes("prepare") || p.includes("send sol")) {
    const solMatch = prompt.match(/(\d+(?:\.\d+)?)\s*sol/i);
    if (addressMatch.length >= 2 && solMatch?.[1]) {
      const from = addressMatch[0]!;
      const to = addressMatch[1]!;
      return {
        tool: "prepare_transfer",
        args: {
          from,
          to,
          sol: solMatch[1],
        },
      };
    }
  }

  if (
    address &&
    (p.includes("account") || p.includes("owner") || p.includes("info"))
  ) {
    return { tool: "get_account_info", args: { address } };
  }
  if (
    address &&
    (p.includes("balance") || p.includes("sol") || p.includes("lamport"))
  ) {
    return { tool: "get_balance", args: { address } };
  }
  if (address) {
    return { tool: "get_balance", args: { address } };
  }
  if (p.includes("brief") || p.includes("status") || p.includes("network")) {
    return { tool: "network_briefing", args: {} };
  }
  if (p.includes("rpcfast") || p.includes("rpc fast") || p.includes("rpc-fast")) {
    return { tool: "rpcfast_pulse", args: {} };
  }
  if (p.includes("solami")) {
    return { tool: "solami_pulse", args: {} };
  }
  if (p.includes("panta") && (p.includes("market") || p.includes("list"))) {
    const catMatch = prompt.match(
      /\b(crypto|sports|politics|entertainment|finance|science|world|other)\b/i,
    );
    return {
      tool: "panta_list_markets",
      args: catMatch?.[1] ? { category: catMatch[1].toLowerCase() } : {},
    };
  }
  if (p.includes("panta")) {
    return { tool: "panta_pulse", args: {} };
  }
  if (p.includes("pulse") || p.includes("provider")) {
    return { tool: "rpcfast_pulse", args: {} };
  }
  if (
    address &&
    (p.includes("activity") || p.includes("history") || p.includes("signature"))
  ) {
    return { tool: "wallet_activity", args: { address } };
  }
  if (p.includes("health")) {
    return { tool: "get_health", args: {} };
  }
  if (p.includes("version") || p.includes("core")) {
    return { tool: "get_version", args: {} };
  }
  if (p.includes("blockhash") || p.includes("hash")) {
    return { tool: "get_latest_blockhash", args: {} };
  }
  if (p.includes("slot")) {
    return { tool: "get_slot", args: {} };
  }
  return { tool: "network_briefing", args: {} };
}
