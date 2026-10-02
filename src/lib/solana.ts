export type SolanaCallResult = {
  ok: boolean;
  mode: "live" | "mock";
  endpoint: string;
  url: string;
  params: Record<string, unknown>;
  status: number;
  data: unknown;
  error?: string;
  fetchedAt: string;
};

export type RpcProvider = "rpcfast" | "solami" | "custom" | "public";

const DEFAULT_RPC = "https://api.mainnet-beta.solana.com";
const SOLAMI_RPC_BASE = "https://rpc.solami.fast/sol";
// Start plan dashboard HTTPS: https://solana-rpc.rpcfast.com/?api_key=KEY
const RPCFAST_RPC_BASE = "https://solana-rpc.rpcfast.com/";

export function resolveSolamiApiKey(): string | null {
  const key = process.env.SOLAMI_API_KEY?.trim();
  return key || null;
}

export function resolveRpcFastApiKey(): string | null {
  const key = process.env.RPCFAST_API_KEY?.trim();
  return key || null;
}

/** Evidence safe URL: never leak the API key into the UI. */
export function maskRpcUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.searchParams.has("api_key")) {
      u.searchParams.set("api_key", "***");
    }
    // Legacy path style: https://sol.rpcfast.com/<api_key>
    if (
      u.hostname.includes("rpcfast.com") &&
      u.pathname.length > 1 &&
      !u.searchParams.has("api_key")
    ) {
      u.pathname = "/***";
    }
    return u.toString();
  } catch {
    return url
      .replace(/api_key=[^&]+/i, "api_key=***")
      .replace(/(rpcfast\.com\/)[^/?#]+/i, "$1***");
  }
}

export function resolveRpcProvider(): RpcProvider {
  const forced = process.env.SOLANA_RPC_PROVIDER?.trim().toLowerCase();
  if (forced === "rpcfast" || forced === "solami" || forced === "custom" || forced === "public") {
    if (forced === "rpcfast" && resolveRpcFastApiKey()) return "rpcfast";
    if (forced === "solami" && resolveSolamiApiKey()) return "solami";
    if (forced === "custom" && process.env.SOLANA_RPC_URL?.trim()) return "custom";
    if (forced === "public") return "public";
  }
  // RPC Fast wins when keyed so Earn sidetrack demos show rpcfast.com evidence.
  if (resolveRpcFastApiKey()) return "rpcfast";
  if (resolveSolamiApiKey()) return "solami";
  const custom = process.env.SOLANA_RPC_URL?.trim();
  if (!custom) return "public";
  if (custom.includes("rpcfast")) return "rpcfast";
  if (custom.includes("solami")) return "solami";
  return "custom";
}

export function resolveRpcUrl(): string {
  const provider = resolveRpcProvider();
  if (provider === "rpcfast") {
    const key = resolveRpcFastApiKey();
    if (key) {
      return `${RPCFAST_RPC_BASE}?api_key=${encodeURIComponent(key)}`;
    }
  }
  if (provider === "solami") {
    const solamiKey = resolveSolamiApiKey();
    if (solamiKey) {
      return `${SOLAMI_RPC_BASE}?api_key=${encodeURIComponent(solamiKey)}`;
    }
  }
  return process.env.SOLANA_RPC_URL?.trim() || DEFAULT_RPC;
}

export function resolveMode(): "live" | "mock" {
  return process.env.SOLANA_FORCE_MOCK === "1" ? "mock" : "live";
}

type RpcResponse = {
  jsonrpc: string;
  id: number;
  result?: unknown;
  error?: { code: number; message: string };
};

async function mockResult(
  method: string,
  params: unknown[],
): Promise<SolanaCallResult> {
  const fixtures: Record<string, unknown> = {
    getHealth: "ok",
    getSlot: 312_456_789,
    getBlockHeight: 312_456_700,
    getVersion: { "solana-core": "2.1.0", "feature-set": 1 },
    getLatestBlockhash: {
      value: {
        blockhash: "EkSnNWid2cvwEVnVx9aBqawnmiCNiDgp3gUdkDPTKN1N",
        lastValidBlockHeight: 312_456_900,
      },
    },
    getBalance: { value: 1_500_000_000 },
    getAccountInfo: {
      value: {
        lamports: 1_500_000_000,
        owner: "11111111111111111111111111111111",
        executable: false,
        rentEpoch: 0,
        data: ["", "base64"],
      },
    },
    getFeeForMessage: { value: 5000 },
    getSignatureStatuses: {
      value: [
        {
          slot: 312_456_800,
          confirmations: 32,
          err: null,
          confirmationStatus: "finalized",
        },
      ],
    },
    getTransaction: {
      slot: 312_456_800,
      meta: { err: null, fee: 5000 },
      transaction: { signatures: ["MockSignature111111111111111111111111111111111111111111111111111"] },
    },
    getSignaturesForAddress: [
      {
        signature: "MockSignature111111111111111111111111111111111111111111111111111",
        slot: 312_456_800,
        err: null,
        memo: null,
        blockTime: 1_700_000_000,
        confirmationStatus: "finalized",
      },
    ],
  };

  return {
    ok: true,
    mode: "mock",
    endpoint: method,
    url: "mock://solana",
    params: { method, params },
    status: 200,
    data: fixtures[method] ?? null,
    fetchedAt: new Date().toISOString(),
  };
}

function withMaskedUrl(result: SolanaCallResult): SolanaCallResult {
  return { ...result, url: maskRpcUrl(result.url) };
}

export async function solanaRpc(
  method: string,
  params: unknown[] = [],
): Promise<SolanaCallResult> {
  const fetchedAt = new Date().toISOString();
  const url = resolveRpcUrl();
  const mode = resolveMode();
  const provider = resolveRpcProvider();

  if (mode === "mock") {
    const mocked = await mockResult(method, params);
    return {
      ...mocked,
      params: { method, params, provider },
    };
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    // Some RPC Fast paths also accept X-TOKEN; path key is primary.
    const rpcfastKey = resolveRpcFastApiKey();
    if (provider === "rpcfast" && rpcfastKey) {
      headers["X-TOKEN"] = rpcfastKey;
    }

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method,
        params,
      }),
      cache: "no-store",
    });

    const json = (await res.json()) as RpcResponse;
    if (!res.ok || json.error) {
      return withMaskedUrl({
        ok: false,
        mode: "live",
        endpoint: method,
        url,
        params: { method, params, provider },
        status: res.status,
        data: json,
        error: json.error?.message || `HTTP ${res.status}`,
        fetchedAt,
      });
    }

    return withMaskedUrl({
      ok: true,
      mode: "live",
      endpoint: method,
      url,
      params: { method, params, provider },
      status: res.status,
      data: json.result,
      fetchedAt,
    });
  } catch (e) {
    // Cloud / restricted networks often block public Solana RPC TLS.
    // Fall back to mock unless SOLANA_FORCE_LIVE=1 so the desk stays demoable.
    if (process.env.SOLANA_FORCE_LIVE !== "1") {
      const mocked = await mockResult(method, params);
      return {
        ...mocked,
        params: { method, params, provider },
        error: `live RPC unreachable, mock fallback: ${e instanceof Error ? e.message : "fetch failed"}`,
      };
    }
    return withMaskedUrl({
      ok: false,
      mode: "live",
      endpoint: method,
      url,
      params: { method, params, provider },
      status: 0,
      data: null,
      error: e instanceof Error ? e.message : "RPC request failed",
      fetchedAt,
    });
  }
}

export function lamportsToSol(lamports: number): string {
  return (lamports / 1_000_000_000).toFixed(9).replace(/\.?0+$/, "") || "0";
}

export function getRpcProviderLabel(): string {
  const provider = resolveRpcProvider();
  if (provider === "rpcfast") return "RPC Fast private RPC";
  if (provider === "solami") return "Solami private RPC";
  if (provider === "custom") return "Custom SOLANA_RPC_URL";
  return "Solana public mainnet RPC";
}
