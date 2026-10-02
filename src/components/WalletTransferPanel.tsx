"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { getActiveSigner, useWallet } from "@/components/WalletContext";
import { useI18n } from "@/components/I18nContext";

type PreparePayload = {
  ready?: boolean;
  from?: string;
  to?: string;
  sol?: string;
  lamports?: number;
  blockhash?: string;
  feeLamports?: number | null;
  sufficient?: boolean;
  balanceSol?: string;
};

type ReceiptPayload = {
  signature?: string;
  confirmationStatus?: string;
  explorer?: string;
  err?: unknown;
};

async function runTool(
  tool: string,
  args: Record<string, string>,
): Promise<{ ok: boolean; summary?: string; payload?: unknown; error?: string }> {
  const res = await fetch("/api/agent/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tool, args }),
  });
  return res.json();
}

export function WalletTransferPanel() {
  const { d } = useI18n();
  const { pubkey, setPubkey, prefillTo, activeProvider } = useWallet();
  const [to, setTo] = useState("");
  const [sol, setSol] = useState("0.001");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [prepare, setPrepare] = useState<PreparePayload | null>(null);
  const [receipt, setReceipt] = useState<ReceiptPayload | null>(null);
  const [signature, setSignature] = useState("");

  useEffect(() => {
    if (prefillTo) setTo(prefillTo);
  }, [prefillTo]);

  async function onPrepare(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setReceipt(null);
    setStatus("");
    try {
      if (!pubkey.trim() || !to.trim()) {
        throw new Error("Sender and recipient addresses are required");
      }
      const json = await runTool("prepare_transfer", {
        from: pubkey.trim(),
        to: to.trim(),
        sol: sol.trim(),
      });
      if (!json.ok) throw new Error(json.error || "Prepare failed");
      setPrepare((json.payload || {}) as PreparePayload);
      setStatus(json.summary || "Transfer plan ready");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Prepare failed");
    } finally {
      setBusy(false);
    }
  }

  async function onSignAndSend() {
    setBusy(true);
    setStatus("");
    try {
      const provider = getActiveSigner(activeProvider);
      if (!provider?.publicKey && !provider) {
        throw new Error("Connect a wallet from the header first");
      }
      if (!prepare?.blockhash || !prepare.to || !prepare.lamports) {
        throw new Error("Prepare a transfer before signing");
      }

      const fromPk = new PublicKey(pubkey);
      const toPk = new PublicKey(prepare.to);
      const tx = new Transaction({
        feePayer: fromPk,
        recentBlockhash: prepare.blockhash,
      }).add(
        SystemProgram.transfer({
          fromPubkey: fromPk,
          toPubkey: toPk,
          lamports: prepare.lamports,
        }),
      );

      void new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
          "https://api.mainnet-beta.solana.com",
        "confirmed",
      );

      if (!provider?.signAndSendTransaction) {
        throw new Error("Connected wallet cannot sign transactions");
      }
      const sent = await provider.signAndSendTransaction(tx);
      setSignature(sent.signature);
      setStatus(`Submitted ${sent.signature.slice(0, 8)}…`);

      const json = await runTool("confirm_receipt", {
        signature: sent.signature,
      });
      if (json.ok) {
        setReceipt((json.payload || {}) as ReceiptPayload);
        setStatus(json.summary || "Receipt confirmed");
      }
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Sign and send failed");
    } finally {
      setBusy(false);
    }
  }

  async function onConfirmPastSignature(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      const json = await runTool("confirm_receipt", {
        signature: signature.trim(),
      });
      if (!json.ok) throw new Error(json.error || "Confirm failed");
      setReceipt((json.payload || {}) as ReceiptPayload);
      setStatus(json.summary || "Receipt confirmed");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Confirm failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      id="wallet"
      className="scroll-mt-24 rounded-2xl border p-5 md:p-7 animate-[rise_1000ms_ease-out]"
      style={{ background: "var(--panel)", borderColor: "var(--line)" }}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p
            className="font-[family-name:var(--mono)] text-xs tracking-[0.18em] uppercase"
            style={{ color: "var(--accent)" }}
          >
            {d.walletEyebrow}
          </p>
          <h2
            className="mt-1 text-2xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--display)" }}
          >
            {d.walletTitle}
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          {d.walletLead}
        </p>
      </div>

      <form onSubmit={onPrepare} className="mt-6 grid gap-3 md:grid-cols-3">
        <label className="grid gap-1.5 text-xs font-medium" style={{ color: "var(--muted)" }}>
          {d.sender}
          <input
            value={pubkey}
            onChange={(e) => setPubkey(e.target.value)}
            className="rounded-xl border bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            style={{ borderColor: "var(--line)", color: "var(--ink)" }}
            placeholder="Filled when wallet connects"
          />
        </label>
        <label className="grid gap-1.5 text-xs font-medium" style={{ color: "var(--muted)" }}>
          {d.recipient}
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-xl border bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            style={{ borderColor: "var(--line)", color: "var(--ink)" }}
            placeholder="Destination wallet"
          />
        </label>
        <label className="grid gap-1.5 text-xs font-medium" style={{ color: "var(--muted)" }}>
          {d.amountSol}
          <input
            value={sol}
            onChange={(e) => setSol(e.target.value)}
            className="rounded-xl border bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            style={{ borderColor: "var(--line)", color: "var(--ink)" }}
            placeholder="0.001"
          />
        </label>
        <div className="md:col-span-3 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={busy}
            className="btn-primary rounded-xl px-5 py-2.5 text-sm font-semibold transition hover:brightness-110 disabled:opacity-60"
          >
            {busy ? d.running : d.prepare}
          </button>
          <button
            type="button"
            disabled={busy || !prepare?.ready}
            onClick={() => void onSignAndSend()}
            className="rounded-xl border px-5 py-2.5 text-sm font-medium transition hover:border-[var(--accent-2)] disabled:opacity-45"
            style={{ borderColor: "var(--line)", color: "var(--ink)" }}
          >
            {d.signSend}
          </button>
        </div>
      </form>

      {prepare ? (
        <dl className="mt-5 grid gap-2 sm:grid-cols-2 text-sm">
          <div className="rounded-xl border px-3 py-2.5" style={{ borderColor: "var(--line)" }}>
            <dt className="font-[family-name:var(--mono)] text-[10px] uppercase" style={{ color: "var(--muted)" }}>{d.amount}</dt>
            <dd className="mt-1">{prepare.sol} SOL</dd>
          </div>
          <div className="rounded-xl border px-3 py-2.5" style={{ borderColor: "var(--line)" }}>
            <dt className="font-[family-name:var(--mono)] text-[10px] uppercase" style={{ color: "var(--muted)" }}>{d.networkFee}</dt>
            <dd className="mt-1">{prepare.feeLamports != null ? `${prepare.feeLamports} lamports` : "n/a"}</dd>
          </div>
          <div className="rounded-xl border px-3 py-2.5 sm:col-span-2" style={{ borderColor: "var(--line)" }}>
            <dt className="font-[family-name:var(--mono)] text-[10px] uppercase" style={{ color: "var(--muted)" }}>{d.blockhash}</dt>
            <dd className="mt-1 font-[family-name:var(--mono)] text-xs break-all">{prepare.blockhash}</dd>
          </div>
        </dl>
      ) : null}

      <form onSubmit={onConfirmPastSignature} className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
        <label className="grid gap-1.5 text-xs font-medium" style={{ color: "var(--muted)" }}>
          {d.signatureLabel}
          <input
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            className="rounded-xl border bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            style={{ borderColor: "var(--line)", color: "var(--ink)" }}
            placeholder={d.signaturePlaceholder}
          />
        </label>
        <button
          type="submit"
          disabled={busy || !signature.trim()}
          className="self-end rounded-xl border px-5 py-2.5 text-sm font-medium transition hover:border-[var(--accent-2)] disabled:opacity-45"
          style={{ borderColor: "var(--line)", color: "var(--ink)" }}
        >
          {d.confirmReceipt}
        </button>
      </form>

      {receipt ? (
        <div className="mt-4 rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "var(--line)" }}>
          <p>
            {d.confirmation}: {receipt.confirmationStatus || "unknown"}
          </p>
          {receipt.explorer ? (
            <a href={receipt.explorer} target="_blank" rel="noreferrer" className="mt-1 inline-block underline-offset-4 hover:underline">
              {d.openExplorer}
            </a>
          ) : null}
        </div>
      ) : null}

      {status ? (
        <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
          {status}
        </p>
      ) : null}
    </section>
  );
}
