"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import type { AgentToolName } from "@/lib/tools";
import {
  verifyReceiptHash,
  type EdgeFlag,
  type HashedEvidence,
  type RunReceipt,
} from "@/lib/evidence";
import { SiteHeader } from "@/components/SiteHeader";
import { WalletTransferPanel } from "@/components/WalletTransferPanel";
import { useI18n } from "@/components/I18nContext";

type RunResponse = {
  ok: boolean;
  prompt?: string | null;
  tool?: AgentToolName;
  summary?: string;
  evidence?: HashedEvidence[];
  receipt?: RunReceipt;
  payload?: unknown;
  error?: string;
};

export default function Home() {
  const { d } = useI18n();
  const [prompt, setPrompt] = useState("Network briefing");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RunResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [verifyState, setVerifyState] = useState<"idle" | "ok" | "fail">("idle");

  const suggestions = useMemo(
    () => [d.chipBriefing, d.chipHealth, d.chipSlot, d.chipBlockhash],
    [d],
  );

  const toolGroups = useMemo((): {
    title: string;
    hint: string;
    chips: { tool: AgentToolName; label: string; args?: Record<string, string> }[];
  }[] => [
    {
      title: d.groupNetwork,
      hint: d.groupNetworkHint,
      chips: [
        { tool: "network_briefing", label: d.chipBriefing },
        { tool: "get_health", label: d.chipHealth },
        { tool: "get_slot", label: d.chipSlot },
        { tool: "get_version", label: d.chipVersion },
        { tool: "get_latest_blockhash", label: d.chipBlockhash },
      ],
    },
    {
      title: d.groupProviders,
      hint: d.groupProvidersHint,
      chips: [
        { tool: "rpcfast_pulse", label: d.chipRpcFast },
        { tool: "solami_pulse", label: d.chipSolami },
        { tool: "panta_pulse", label: d.chipPanta },
        {
          tool: "panta_list_markets",
          label: d.chipPantaMarkets,
          args: { category: "crypto" },
        },
      ],
    },
    {
      title: d.groupAccounts,
      hint: d.groupAccountsHint,
      chips: [
        {
          tool: "get_balance",
          label: d.chipBalance,
          args: { address: "11111111111111111111111111111111" },
        },
        {
          tool: "wallet_activity",
          label: d.chipActivity,
          args: { address: "11111111111111111111111111111111" },
        },
      ],
    },
  ], [d]);

  const evidencePreview = useMemo(() => {
    const first = result?.evidence?.[0];
    if (!first) return null;
    return JSON.stringify(
      {
        endpoint: first.endpoint,
        mode: first.mode,
        status: first.status,
        url: first.url,
        params: first.params,
        evidenceHash: first.evidenceHash,
        flags: first.flags,
        sample: first.data,
      },
      null,
      2,
    ).slice(0, 3500);
  }, [result]);

  async function run(body: Record<string, unknown>) {
    setLoading(true);
    setError(null);
    setVerifyState("idle");
    setCopied(false);
    try {
      const res = await fetch("/api/agent/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as RunResponse;
      if (!res.ok || !json.ok) {
        setError(json.error || "Something went wrong while running the desk");
        setResult(json);
      } else {
        setResult(json);
        requestAnimationFrame(() => {
          document.getElementById("evidence")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void run({ prompt });
  }

  function runJuryDemo() {
    void run({ tool: "network_briefing" });
  }

  async function copyProof() {
    if (!result?.receipt) return;
    await navigator.clipboard.writeText(JSON.stringify(result.receipt, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  async function verifyProof() {
    if (!result?.receipt) return;
    const ok = await verifyReceiptHash(result.receipt);
    setVerifyState(ok ? "ok" : "fail");
  }

  const allFlags: EdgeFlag[] =
    result?.evidence?.flatMap((ev) => ev.flags || []) || [];

  return (
    <>
      <SiteHeader />
      <main
        id="top"
        className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-5 py-8 md:gap-12 md:px-8 md:py-12"
      >
        <section className="animate-[rise_700ms_ease-out]">
          <div className="mb-5 flex items-center gap-4">
            <Image
              src="/logo.svg"
              alt=""
              width={72}
              height={72}
              className="rounded-2xl shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent)_35%,transparent)]"
              priority
            />
            <div>
              <p
                className="font-[family-name:var(--mono)] text-xs tracking-[0.2em] uppercase"
                style={{ color: "var(--accent)" }}
              >
                {d.publicDemo}
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                Colosseum Crypto World&apos;s Fair · Superteam TR
              </p>
            </div>
          </div>

          <h1
            className="max-w-3xl text-4xl leading-[1.05] font-semibold tracking-tight md:text-6xl"
            style={{ fontFamily: "var(--display)", color: "var(--ink)" }}
          >
            {d.heroTitle}
          </h1>
          <p
            className="mt-4 max-w-2xl text-base leading-relaxed md:text-lg"
            style={{ color: "var(--muted)" }}
          >
            {d.heroLead}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={runJuryDemo}
              disabled={loading}
              className="btn-primary rounded-xl px-5 py-3 text-sm font-semibold transition hover:brightness-110 disabled:opacity-60"
            >
              {loading ? d.running : d.ctaJury}
            </button>
            <a
              href="https://github.com/kutluhaneth46/solana-agent-desk"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border px-5 py-3 text-sm font-semibold transition hover:border-[var(--accent-2)]"
              style={{ borderColor: "var(--line)", color: "var(--ink)" }}
            >
              {d.ctaSource}
            </a>
          </div>

          <ol
            className="mt-8 grid gap-3 border-t pt-6 sm:grid-cols-3"
            style={{ borderColor: "var(--line)" }}
            aria-label="Jury path"
          >
            {[
              { t: d.juryStripWhat, b: d.juryStripWhatBody },
              { t: d.juryStripProof, b: d.juryStripProofBody },
              { t: d.juryStripHash, b: d.juryStripHashBody },
            ].map((item) => (
              <li key={item.t} className="min-w-0">
                <p
                  className="font-[family-name:var(--mono)] text-[11px] tracking-[0.14em] uppercase"
                  style={{ color: "var(--accent)" }}
                >
                  {item.t}
                </p>
                <p className="mt-1 text-sm leading-snug" style={{ color: "var(--muted)" }}>
                  {item.b}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section
          id="evidence"
          className="scroll-mt-24 rounded-2xl border p-5 md:p-7 animate-[rise_900ms_ease-out]"
          style={{ background: "var(--bg-2)", borderColor: "var(--line)" }}
        >
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p
                className="font-[family-name:var(--mono)] text-xs tracking-[0.18em] uppercase"
                style={{ color: "var(--accent)" }}
              >
                {d.outputEyebrow}
              </p>
              <h2
                className="mt-1 text-2xl font-semibold tracking-tight"
                style={{ fontFamily: "var(--display)", color: "var(--ink)" }}
              >
                {d.outputTitle}
              </h2>
            </div>
            {result?.tool ? (
              <span
                className="rounded-full border px-3 py-1 font-[family-name:var(--mono)] text-xs tracking-wider uppercase"
                style={{ borderColor: "var(--line)", color: "var(--accent-2)" }}
              >
                {result.tool}
              </span>
            ) : null}
          </div>

          {error ? (
            <p className="mb-4 text-sm" style={{ color: "var(--danger)" }}>
              {error}
            </p>
          ) : null}

          {!result && !loading ? (
            <p style={{ color: "var(--muted)" }}>{d.nothingYet}</p>
          ) : null}

          {loading ? <p style={{ color: "var(--muted)" }}>{d.contacting}</p> : null}

          {result?.summary ? (
            <p
              className="mb-5 text-base leading-relaxed md:text-lg"
              style={{ color: "var(--ink)" }}
            >
              {result.summary}
            </p>
          ) : null}

          {result?.receipt ? (
            <div
              className="mb-5 rounded-xl border p-4"
              style={{ borderColor: "var(--line)", background: "var(--panel)" }}
            >
              <p
                className="font-[family-name:var(--mono)] text-[11px] tracking-[0.16em] uppercase"
                style={{ color: "var(--accent)" }}
              >
                {d.receiptTitle}
              </p>
              <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-[11px] uppercase" style={{ color: "var(--muted)" }}>
                    {d.receiptId}
                  </dt>
                  <dd
                    className="mt-1 break-all font-[family-name:var(--mono)] text-xs"
                    style={{ color: "var(--ink)" }}
                  >
                    {result.receipt.runId}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase" style={{ color: "var(--muted)" }}>
                    {d.receiptHash}
                  </dt>
                  <dd
                    className="mt-1 break-all font-[family-name:var(--mono)] text-xs"
                    style={{ color: "var(--ink)" }}
                  >
                    {result.receipt.receiptHash}
                  </dd>
                </div>
              </dl>
              <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
                <span className="font-semibold" style={{ color: "var(--ink)" }}>
                  {d.trustNoteLabel}:{" "}
                </span>
                {result.receipt.trustNote}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void copyProof()}
                  className="btn-secondary rounded-xl px-4 py-2 text-xs font-semibold"
                >
                  {copied ? d.proofCopied : d.copyProof}
                </button>
                <button
                  type="button"
                  onClick={() => void verifyProof()}
                  className="rounded-xl border px-4 py-2 text-xs font-semibold"
                  style={{ borderColor: "var(--line)", color: "var(--ink)" }}
                >
                  {d.verifyProof}
                </button>
              </div>
              {verifyState === "ok" ? (
                <p className="mt-2 text-xs font-semibold" style={{ color: "var(--accent-2)" }}>
                  {d.verifyOk}
                </p>
              ) : null}
              {verifyState === "fail" ? (
                <p className="mt-2 text-xs font-semibold" style={{ color: "var(--danger)" }}>
                  {d.verifyFail}
                </p>
              ) : null}
            </div>
          ) : null}

          {allFlags.length > 0 ? (
            <div className="mb-5">
              <h3
                className="mb-2 text-xs font-medium tracking-wide uppercase"
                style={{ color: "var(--muted)" }}
              >
                {d.flagsLabel}
              </h3>
              <ul className="flex flex-col gap-2">
                {allFlags.map((flag, i) => (
                  <li
                    key={`${flag.code}-${i}`}
                    className="rounded-lg border px-3 py-2 text-xs leading-relaxed"
                    style={{
                      borderColor:
                        flag.level === "error"
                          ? "color-mix(in srgb, var(--danger) 55%, var(--line))"
                          : "var(--line)",
                      color: "var(--ink)",
                      background: "var(--panel)",
                    }}
                  >
                    <span
                      className="font-[family-name:var(--mono)] uppercase tracking-wider"
                      style={{
                        color:
                          flag.level === "error"
                            ? "var(--danger)"
                            : flag.level === "warn"
                              ? "var(--accent)"
                              : "var(--muted)",
                      }}
                    >
                      {flag.level} · {flag.code}
                    </span>
                    <span className="mt-0.5 block" style={{ color: "var(--muted)" }}>
                      {flag.message}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {result?.payload ? (
            <div className="mb-5 overflow-x-auto">
              <PayloadView payload={result.payload} />
            </div>
          ) : null}

          {evidencePreview ? (
            <div>
              <h3
                className="mb-2 text-xs font-medium tracking-wide uppercase"
                style={{ color: "var(--muted)" }}
              >
                {d.evidence}
              </h3>
              <pre
                className="max-h-[360px] overflow-auto rounded-xl border p-4 font-[family-name:var(--mono)] text-[11px] leading-relaxed md:text-xs"
                style={{
                  background: "var(--bg)",
                  borderColor: "var(--line)",
                  color: "var(--ink)",
                }}
              >
                {evidencePreview}
              </pre>
              {result?.evidence?.map((ev, i) => (
                <p
                  key={`${ev.endpoint}-${i}`}
                  className="mt-2 font-[family-name:var(--mono)] text-[11px]"
                  style={{ color: "var(--muted)" }}
                >
                  {ev.ok ? "OK" : "ERR"} · {ev.mode} · HTTP {ev.status} · {ev.endpoint} ·{" "}
                  {d.callHash} {ev.evidenceHash.slice(0, 16)}… · {ev.fetchedAt}
                  {ev.error ? ` · ${ev.error}` : ""}
                </p>
              ))}
            </div>
          ) : null}
        </section>

        <section id="desk" className="scroll-mt-24 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <div
            className="rounded-2xl border p-5 md:p-7 animate-[rise_1000ms_ease-out]"
            style={{ background: "var(--panel)", borderColor: "var(--line)" }}
          >
            <p
              className="font-[family-name:var(--mono)] text-xs tracking-[0.18em] uppercase"
              style={{ color: "var(--accent)" }}
            >
              {d.deskEyebrow}
            </p>
            <h2
              className="mt-1 text-2xl font-semibold tracking-tight"
              style={{ fontFamily: "var(--display)", color: "var(--ink)" }}
            >
              {d.deskTitle}
            </h2>
            <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-4">
              <label
                className="text-xs font-medium tracking-wide"
                style={{ color: "var(--muted)" }}
              >
                {d.promptLabel}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={2}
                className="w-full resize-y rounded-xl border bg-transparent px-4 py-3 text-base outline-none focus:border-[var(--accent)]"
                style={{ borderColor: "var(--line)", color: "var(--ink)" }}
                placeholder={d.promptPlaceholder}
              />
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPrompt(s)}
                    className="rounded-full border px-3 py-1.5 text-xs font-semibold transition hover:border-[var(--accent)]"
                    style={{ borderColor: "var(--line)", color: "var(--ink)" }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary rounded-xl px-5 py-3 text-sm font-semibold transition hover:brightness-110 disabled:opacity-60"
                >
                  {loading ? d.running : d.runDesk}
                </button>
                <a
                  href="/api/tools"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold underline-offset-4 hover:underline"
                  style={{ color: "var(--accent-2)" }}
                >
                  {d.toolManifest}
                </a>
              </div>
            </form>

            <details className="mt-8">
              <summary
                className="cursor-pointer list-none text-sm font-semibold"
                style={{ color: "var(--ink)" }}
              >
                {d.moreTools}.{" "}
                <span className="text-xs font-normal" style={{ color: "var(--muted)" }}>
                  {d.moreToolsHint}
                </span>
              </summary>
              <div className="mt-5 space-y-5">
                {toolGroups.map((group) => (
                  <div key={group.title}>
                    <div className="mb-2 flex flex-wrap items-baseline gap-2">
                      <h3 className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
                        {group.title}
                      </h3>
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        {group.hint}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.chips.map((chip) => (
                        <button
                          key={chip.tool + chip.label}
                          type="button"
                          disabled={loading}
                          onClick={() =>
                            void run({ tool: chip.tool, args: chip.args || {} })
                          }
                          className="rounded-xl border px-3.5 py-2 text-xs font-semibold transition hover:border-[var(--accent-2)] disabled:opacity-50"
                          style={{ borderColor: "var(--line)", color: "var(--ink)" }}
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </div>

          <aside
            className="rounded-2xl border p-5 md:p-7 animate-[rise_1100ms_ease-out]"
            style={{ background: "var(--bg-2)", borderColor: "var(--line)" }}
          >
            <h2
              className="text-lg font-semibold"
              style={{ fontFamily: "var(--display)", color: "var(--ink)" }}
            >
              {d.productTitle}
            </h2>
            <ul
              className="mt-4 space-y-3 text-sm leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              <li>
                <span style={{ color: "var(--ink)" }} className="font-medium">
                  {d.productEvidence}
                </span>
                {d.productEvidenceBody}
              </li>
              <li>
                <span style={{ color: "var(--ink)" }} className="font-medium">
                  {d.productBuilder}
                </span>
                {d.productBuilderBody}
              </li>
            </ul>
            <p
              className="mt-6 rounded-xl border p-3 text-xs leading-relaxed"
              style={{ borderColor: "var(--line)", color: "var(--accent)" }}
            >
              {d.productNote}
            </p>
          </aside>
        </section>

        <WalletTransferPanel />

        <section
          id="about"
          className="scroll-mt-24 rounded-2xl border p-5 md:p-8 animate-[rise_1300ms_ease-out]"
          style={{ background: "var(--panel)", borderColor: "var(--line)" }}
        >
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p
                className="font-[family-name:var(--mono)] text-xs tracking-[0.18em] uppercase"
                style={{ color: "var(--accent)" }}
              >
                {d.aboutEyebrow}
              </p>
              <h2
                className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl"
                style={{ fontFamily: "var(--display)", color: "var(--ink)" }}
              >
                {d.aboutTitle}
              </h2>
              <div
                className="mt-4 space-y-3 text-sm leading-relaxed md:text-base"
                style={{ color: "var(--muted)" }}
              >
                <p>{d.aboutP1}</p>
                <p>{d.aboutP2}</p>
                <p>{d.aboutP3}</p>
              </div>
            </div>

            <div
              className="rounded-2xl border p-5"
              style={{ background: "var(--bg-2)", borderColor: "var(--line)" }}
            >
              <h3
                className="text-lg font-semibold"
                style={{ fontFamily: "var(--display)", color: "var(--ink)" }}
              >
                {d.contactTitle}
              </h3>
              <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                {d.contactLead}
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <a
                  href="https://x.com/kutluhaneth"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-solid-ink inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition hover:brightness-110"
                >
                  <span aria-hidden>𝕏</span>
                  {d.openX}
                </a>
                <a
                  href="https://t.me/kutluhaneth"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition hover:brightness-110"
                >
                  <span aria-hidden>TG</span>
                  {d.openTelegram}
                </a>
                <a
                  href="https://github.com/kutluhaneth46"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border-2 px-5 py-3 text-sm font-semibold transition hover:border-[var(--accent)]"
                  style={{
                    borderColor: "var(--accent-2)",
                    color: "var(--ink)",
                    background: "var(--panel)",
                  }}
                >
                  {d.openGitHub}
                </a>
              </div>
              <p
                className="mt-5 font-[family-name:var(--mono)] text-[11px]"
                style={{ color: "var(--muted)" }}
              >
                {d.contactHandle}
              </p>
            </div>
          </div>
        </section>

        <footer
          className="flex flex-wrap items-center justify-between gap-4 border-t pb-10 pt-2 text-sm"
          style={{ borderColor: "var(--line)", color: "var(--muted)" }}
        >
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="" width={28} height={28} className="rounded-lg" />
            <span>{d.footerBrand}</span>
          </div>
          <div className="flex flex-wrap gap-4">
            <a href="https://x.com/kutluhaneth" target="_blank" rel="noreferrer">
              X
            </a>
            <a href="https://t.me/kutluhaneth" target="_blank" rel="noreferrer">
              Telegram
            </a>
            <a
              href="https://github.com/kutluhaneth46/solana-agent-desk"
              target="_blank"
              rel="noreferrer"
            >
              Source
            </a>
          </div>
        </footer>

        <style jsx global>{`
          @keyframes rise {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </main>
    </>
  );
}

function PayloadView({ payload }: { payload: unknown }) {
  if (!payload || typeof payload !== "object") {
    return <pre className="font-[family-name:var(--mono)] text-xs">{String(payload)}</pre>;
  }

  const obj = payload as Record<string, unknown>;
  if (Array.isArray(obj.rows)) {
    const rows = obj.rows as Record<string, unknown>[];
    const keys = Object.keys(rows[0] || {});
    return (
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr style={{ color: "var(--muted)" }}>
            {keys.map((k) => (
              <th
                key={k}
                className="border-b px-3 py-2 font-medium"
                style={{ borderColor: "var(--line)" }}
              >
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {keys.map((k) => (
                <td
                  key={k}
                  className="border-b px-3 py-2 font-[family-name:var(--mono)] text-xs md:text-sm"
                  style={{ borderColor: "var(--line)", color: "var(--ink)" }}
                >
                  {String(row[k] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <dl className="grid gap-2 sm:grid-cols-2">
      {Object.entries(obj)
        .filter(
          ([k]) =>
            k !== "rawOk" &&
            k !== "version" &&
            k !== "serializedMessageBase64" &&
            k !== "transaction",
        )
        .map(([k, v]) => (
          <div
            key={k}
            className="rounded-xl border px-3 py-2"
            style={{ borderColor: "var(--line)" }}
          >
            <dt
              className="font-[family-name:var(--mono)] text-[10px] tracking-wider uppercase"
              style={{ color: "var(--muted)" }}
            >
              {k}
            </dt>
            <dd className="mt-1 text-sm break-all" style={{ color: "var(--ink)" }}>
              {Array.isArray(v)
                ? v.join(" · ")
                : v && typeof v === "object"
                  ? Object.entries(v as Record<string, unknown>)
                      .map(([ik, iv]) => `${ik}: ${String(iv)}`)
                      .join(" · ")
                  : String(v)}
            </dd>
          </div>
        ))}
    </dl>
  );
}
