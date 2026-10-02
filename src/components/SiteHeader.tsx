"use client";

import Image from "next/image";
import { useState } from "react";
import { useWallet } from "@/components/WalletContext";
import { useTheme } from "@/components/ThemeContext";
import { useI18n } from "@/components/I18nContext";
import { LANG_OPTIONS } from "@/lib/i18n";
import { TipModal } from "@/components/TipModal";
import { WalletModal } from "@/components/WalletModal";

export function SiteHeader() {
  const { openModal, connecting, shortAddress } = useWallet();
  const { theme, toggleTheme } = useTheme();
  const { d, lang, setLang } = useI18n();
  const [tipOpen, setTipOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-md"
        style={{ borderColor: "var(--line)", background: "var(--header-bg)" }}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3 md:px-8">
          <a href="#top" className="flex items-center gap-3 no-underline">
            <Image
              src="/logo.svg"
              alt="Solana Agent Desk logo"
              width={40}
              height={40}
              className="rounded-xl"
              priority
            />
            <div className="leading-tight">
              <p
                className="text-sm font-semibold tracking-tight md:text-base"
                style={{ color: "var(--ink)", fontFamily: "var(--display)" }}
              >
                Solana Agent Desk
              </p>
              <p
                className="hidden font-[family-name:var(--mono)] text-[10px] tracking-[0.16em] uppercase sm:block"
                style={{ color: "var(--muted)" }}
              >
                {d.brandSub}
              </p>
            </div>
          </a>

          <nav
            className="order-3 flex w-full items-center justify-center gap-5 text-xs font-semibold tracking-[0.14em] md:order-none md:w-auto md:text-[11px]"
            style={{ color: "var(--ink)" }}
          >
            <a href="#desk" className="opacity-80 transition hover:opacity-100">
              {d.navDesk}
            </a>
            <a href="#wallet" className="opacity-80 transition hover:opacity-100">
              {d.navWallet}
            </a>
            <a href="#about" className="opacity-80 transition hover:opacity-100">
              {d.navAbout}
            </a>
          </nav>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <div
              className="flex items-center gap-1.5 rounded-xl border px-2 py-1"
              style={{ borderColor: "var(--line)" }}
            >
              <label
                htmlFor="sad-lang"
                className="hidden text-[10px] font-semibold tracking-[0.12em] uppercase sm:inline"
                style={{ color: "var(--muted)" }}
              >
                {d.language}
              </label>
              <select
                id="sad-lang"
                value={lang}
                onChange={(e) => setLang(e.target.value as typeof lang)}
                className="max-w-[9.5rem] bg-transparent py-1.5 text-xs font-semibold outline-none"
                style={{ color: "var(--ink)" }}
                aria-label={d.language}
                title={d.language}
              >
                {LANG_OPTIONS.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-xl border px-3 py-2 text-xs font-semibold transition hover:border-[var(--accent)]"
              style={{ borderColor: "var(--line)", color: "var(--ink)" }}
              aria-label={theme === "dark" ? d.themeLight : d.themeDark}
            >
              {theme === "dark" ? d.themeLight : d.themeDark}
            </button>

            <button
              type="button"
              onClick={() => setTipOpen(true)}
              className="rounded-xl border px-3 py-2 text-xs font-semibold transition hover:border-[var(--accent)]"
              style={{ borderColor: "var(--line)", color: "var(--ink)" }}
            >
              {d.tip}
            </button>

            <button
              type="button"
              onClick={openModal}
              disabled={connecting}
              className="btn-primary shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:brightness-110 disabled:opacity-60"
            >
              {connecting
                ? d.connecting
                : shortAddress
                  ? shortAddress
                  : d.connectWallet}
            </button>
          </div>
        </div>
      </header>

      <WalletModal />
      <TipModal open={tipOpen} onClose={() => setTipOpen(false)} />
    </>
  );
}
