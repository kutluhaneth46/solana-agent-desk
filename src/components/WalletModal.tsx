"use client";

import { useWallet, WALLET_OPTIONS } from "@/components/WalletContext";
import { useI18n } from "@/components/I18nContext";

export function WalletModal() {
  const { d } = useI18n();
  const {
    modalOpen,
    closeModal,
    connectWith,
    connecting,
    detected,
  } = useWallet();

  if (!modalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      role="dialog"
      aria-modal="true"
      aria-label={d.chooseWallet}
      onClick={closeModal}
    >
      <div
        className="w-full max-w-md rounded-2xl border p-5 shadow-2xl"
        style={{ background: "var(--panel)", borderColor: "var(--line)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2
              className="text-lg font-semibold"
              style={{ fontFamily: "var(--display)", color: "var(--ink)" }}
            >
              {d.chooseWallet}
            </h2>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              Phantom, Solflare, Backpack, Glow, Coinbase Wallet
            </p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="rounded-lg border px-3 py-1.5 text-sm"
            style={{ borderColor: "var(--line)", color: "var(--ink)" }}
          >
            {d.tipClose}
          </button>
        </div>

        <ul className="space-y-2">
          {WALLET_OPTIONS.map((wallet) => {
            const ready = detected[wallet.id];
            return (
              <li key={wallet.id}>
                <div
                  className="flex items-center justify-between gap-3 rounded-xl border px-3 py-3"
                  style={{ borderColor: "var(--line)" }}
                >
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
                      {wallet.name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      {ready ? d.walletInstalled : d.walletNotFound}
                    </p>
                  </div>
                  {ready ? (
                    <button
                      type="button"
                      disabled={connecting}
                      onClick={() => void connectWith(wallet.id)}
                      className="btn-primary rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-60"
                    >
                      {connecting ? d.connecting : d.connectWallet}
                    </button>
                  ) : (
                    <a
                      href={wallet.installUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border px-4 py-2 text-sm font-medium"
                      style={{ borderColor: "var(--line)", color: "var(--ink)" }}
                    >
                      {d.walletInstall}
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
