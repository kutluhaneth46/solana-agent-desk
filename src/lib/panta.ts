export type PantaCallResult = {
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

const PANTA_API_BASE = "https://live-api.panta.market/api/v1";

export function resolvePantaApiKey(): string | null {
  const key = process.env.PANTA_API_KEY?.trim();
  return key || null;
}

export function maskPantaUrl(url: string): string {
  // Keys are header-only; still scrub accidental query secrets.
  try {
    const u = new URL(url);
    if (u.searchParams.has("api_key")) u.searchParams.set("api_key", "***");
    if (u.searchParams.has("key")) u.searchParams.set("key", "***");
    return u.toString();
  } catch {
    return url;
  }
}

export function isPantaActive(): boolean {
  return Boolean(resolvePantaApiKey());
}

type JsonError = { code?: string; message?: string };

async function mockPanta(
  endpoint: string,
  params: Record<string, unknown>,
): Promise<PantaCallResult> {
  const fixtures: Record<string, unknown> = {
    "GET /account/": {
      userId: "usr_mock",
      email: "mock@example.com",
      name: "Mock Partner",
      status: "active",
      canCreateMarkets: true,
      createdAt: "2026-09-04T12:00:00.000000Z",
      apiKeyId: "key_mock",
    },
    "GET /categories/": {
      categories: [
        "sports",
        "crypto",
        "politics",
        "entertainment",
        "finance",
        "science",
        "world",
        "other",
      ],
    },
    "GET /markets/": {
      items: [
        {
          marketId: "MockMarket1111111111111111111111111111111",
          category: "crypto",
          title: "SOL above 300 by year end?",
          description: "Mock catalog row",
          images: [],
          phase: "primary",
          marketType: "standard",
          region: "Global",
          resolved: false,
          status: "open",
          volumeUsdc: "1200.00",
          createdByPartner: false,
        },
      ],
      nextCursor: null,
    },
  };

  return {
    ok: true,
    mode: "mock",
    endpoint,
    url: "mock://panta",
    params,
    status: 200,
    data: fixtures[endpoint] ?? { mock: true },
    fetchedAt: new Date().toISOString(),
  };
}

export async function pantaRequest(
  method: "GET" | "POST",
  path: string,
  opts: {
    query?: Record<string, string | undefined>;
    body?: unknown;
    label?: string;
  } = {},
): Promise<PantaCallResult> {
  const fetchedAt = new Date().toISOString();
  const key = resolvePantaApiKey();
  const endpoint = opts.label || `${method} ${path}`;

  const qs = new URLSearchParams();
  if (opts.query) {
    for (const [k, v] of Object.entries(opts.query)) {
      if (v !== undefined && v !== "") qs.set(k, v);
    }
  }
  const url =
    `${PANTA_API_BASE}${path}` + (qs.toString() ? `?${qs.toString()}` : "");

  if (!key) {
    if (process.env.SOLANA_FORCE_LIVE === "1") {
      return {
        ok: false,
        mode: "live",
        endpoint,
        url: maskPantaUrl(url),
        params: { method, path, provider: "panta", ...opts.query },
        status: 0,
        data: null,
        error: "PANTA_API_KEY missing. Set pk_test_ or pk_live_ key from docs.panta.market quickstart.",
        fetchedAt,
      };
    }
    const mocked = await mockPanta(endpoint, {
      method,
      path,
      provider: "panta",
      ...opts.query,
    });
    return {
      ...mocked,
      error: "PANTA_API_KEY missing · mock fixture",
    };
  }

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": key,
      },
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      cache: "no-store",
    });

    const text = await res.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    const err = data as JsonError | null;
    if (!res.ok) {
      return {
        ok: false,
        mode: "live",
        endpoint,
        url: maskPantaUrl(url),
        params: { method, path, provider: "panta", ...opts.query },
        status: res.status,
        data,
        error: err?.message || err?.code || `HTTP ${res.status}`,
        fetchedAt,
      };
    }

    return {
      ok: true,
      mode: "live",
      endpoint,
      url: maskPantaUrl(url),
      params: { method, path, provider: "panta", ...opts.query },
      status: res.status,
      data,
      fetchedAt,
    };
  } catch (e) {
    if (process.env.SOLANA_FORCE_LIVE !== "1") {
      const mocked = await mockPanta(endpoint, {
        method,
        path,
        provider: "panta",
      });
      return {
        ...mocked,
        error: `live Panta unreachable, mock fallback: ${e instanceof Error ? e.message : "fetch failed"}`,
      };
    }
    return {
      ok: false,
      mode: "live",
      endpoint,
      url: maskPantaUrl(url),
      params: { method, path, provider: "panta", ...opts.query },
      status: 0,
      data: null,
      error: e instanceof Error ? e.message : "Panta request failed",
      fetchedAt,
    };
  }
}

export async function pantaWhoami(): Promise<PantaCallResult> {
  return pantaRequest("GET", "/account/", { label: "GET /account/" });
}

export async function pantaCategories(): Promise<PantaCallResult> {
  return pantaRequest("GET", "/categories/", { label: "GET /categories/" });
}

export async function pantaListMarkets(opts: {
  category?: string;
  status?: string;
  limit?: string;
} = {}): Promise<PantaCallResult> {
  return pantaRequest("GET", "/markets/", {
    label: "GET /markets/",
    query: {
      category: opts.category,
      status: opts.status,
      limit: opts.limit || "10",
    },
  });
}

export async function pantaGetMarket(marketId: string): Promise<PantaCallResult> {
  const id = encodeURIComponent(marketId);
  return pantaRequest("GET", `/markets/${id}/`, {
    label: "GET /markets/:id/",
    query: {},
  });
}
