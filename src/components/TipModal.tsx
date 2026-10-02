"use client";

import { useState } from "react";
import { TIP_WALLET } from "@/lib/tip";
import { useI18n } from "@/components/I18nContext";
import { useWallet } from "@/components/WalletContext";

type TipModalProps = {
  open: boolean;
  onClose: () => void;
};

export function TipModal({ open, onClose }: TipModalProps) {
  const { d } = useI18n();
  const { setPrefillTo } = useWallet();
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(TIP_WALLET);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  function useInWallet() {
    setPrefillTo(TIP_WALLET);
    onClose();
    window.location.hash = "wallet";
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      role="dialog"
      aria-modal="true"
      aria-label={d.tipTitle}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border p-5 shadow-2xl"
        style={{ background: "var(--panel)", borderColor: "var(--line)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          className="text-lg font-semibold"
          style={{ fontFamily: "var(--display)", color: "var(--ink)" }}
        >
          {d.tipTitle}
        </h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          {d.tipBody}
        </p>
        <p
          className="mt-4 break-all rounded-xl border px-3 py-3 font-[family-name:var(--mono)] text-xs"
          style={{ borderColor: "var(--line)", color: "var(--ink)", background: "var(--bg-2)" }}
        >
          {TIP_WALLET}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void copyAddress()}
            className="btn-primary rounded-xl px-4 py-2.5 text-sm font-semibold"
          >
            {copied ? d.tipCopied : d.tipCopy}
          </button>
          <button
            type="button"
            onClick={useInWallet}
            className="btn-secondary rounded-xl px-4 py-2.5 text-sm font-semibold"
          >
            {d.tipSend}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-4 py-2.5 text-sm font-medium"
            style={{ borderColor: "var(--line)", color: "var(--ink)" }}
          >
            {d.tipClose}
          </button>
        </div>
      </div>
    </div>
  );
}
