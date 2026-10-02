"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useI18n } from "@/components/I18nContext";

export type SolanaProvider = {
  isPhantom?: boolean;
  isSolflare?: boolean;
  isBackpack?: boolean;
  isGlow?: boolean;
  publicKey?: { toString(): string };
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{
    publicKey: { toString(): string };
  }>;
  signAndSendTransaction: (tx: unknown) => Promise<{ signature: string }>;
};

export type WalletOption = {
  id: string;
  name: string;
  installUrl: string;
  getProvider: () => SolanaProvider | null;
};

function asProvider(value: unknown): SolanaProvider | null {
  if (!value || typeof value !== "object") return null;
  const p = value as SolanaProvider;
  if (typeof p.connect !== "function") return null;
  return p;
}

export const WALLET_OPTIONS: WalletOption[] = [
  {
    id: "phantom",
    name: "Phantom",
    installUrl: "https://phantom.app/",
    getProvider: () => {
      if (typeof window === "undefined") return null;
      const w = window as unknown as {
        phantom?: { solana?: SolanaProvider };
        solana?: SolanaProvider;
      };
      return asProvider(w.phantom?.solana) || (w.solana?.isPhantom ? asProvider(w.solana) : null);
    },
  },
  {
    id: "solflare",
    name: "Solflare",
    installUrl: "https://solflare.com/",
    getProvider: () => {
      if (typeof window === "undefined") return null;
      const w = window as unknown as { solflare?: SolanaProvider };
      return asProvider(w.solflare);
    },
  },
  {
    id: "backpack",
    name: "Backpack",
    installUrl: "https://backpack.app/",
    getProvider: () => {
      if (typeof window === "undefined") return null;
      const w = window as unknown as { backpack?: SolanaProvider };
      return asProvider(w.backpack);
    },
  },
  {
    id: "glow",
    name: "Glow",
    installUrl: "https://glow.app/",
    getProvider: () => {
      if (typeof window === "undefined") return null;
      const w = window as unknown as {
        glow?: SolanaProvider;
        glowSolana?: SolanaProvider;
      };
      return asProvider(w.glowSolana) || asProvider(w.glow);
    },
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    installUrl: "https://www.coinbase.com/wallet",
    getProvider: () => {
      if (typeof window === "undefined") return null;
      const w = window as unknown as { coinbaseSolana?: SolanaProvider };
      return asProvider(w.coinbaseSolana);
    },
  },
];

type WalletContextValue = {
  pubkey: string;
  setPubkey: (value: string) => void;
  prefillTo: string;
  setPrefillTo: (value: string) => void;
  connecting: boolean;
  status: string;
  shortAddress: string | null;
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  connectWith: (walletId: string) => Promise<void>;
  activeProvider: SolanaProvider | null;
  detected: Record<string, boolean>;
};

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { d } = useI18n();
  const [pubkey, setPubkey] = useState("");
  const [prefillTo, setPrefillTo] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [status, setStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeProvider, setActiveProvider] = useState<SolanaProvider | null>(
    null,
  );
  const [detected, setDetected] = useState<Record<string, boolean>>({});

  const refreshDetected = useCallback(() => {
    const next: Record<string, boolean> = {};
    for (const wallet of WALLET_OPTIONS) {
      next[wallet.id] = Boolean(wallet.getProvider());
    }
    setDetected(next);
  }, []);

  useEffect(() => {
    refreshDetected();
    const t = window.setInterval(refreshDetected, 1500);
    return () => window.clearInterval(t);
  }, [refreshDetected]);

  const connectWith = useCallback(
    async (walletId: string) => {
      setConnecting(true);
      setStatus("");
      const option = WALLET_OPTIONS.find((w) => w.id === walletId);
      const provider = option?.getProvider() || null;
      if (!option || !provider) {
        setStatus(d.walletNotFound);
        setConnecting(false);
        return;
      }
      try {
        const connected = await provider.connect();
        setPubkey(connected.publicKey.toString());
        setActiveProvider(provider);
        setStatus(d.walletConnected);
        setModalOpen(false);
      } catch (e) {
        setStatus(e instanceof Error ? e.message : "Wallet connect failed");
      } finally {
        setConnecting(false);
      }
    },
    [d.walletConnected, d.walletNotFound],
  );

  const shortAddress = useMemo(() => {
    if (!pubkey || pubkey.length < 8) return null;
    return `${pubkey.slice(0, 4)}…${pubkey.slice(-4)}`;
  }, [pubkey]);

  const value = useMemo(
    () => ({
      pubkey,
      setPubkey,
      prefillTo,
      setPrefillTo,
      connecting,
      status,
      shortAddress,
      modalOpen,
      openModal: () => {
        refreshDetected();
        setModalOpen(true);
      },
      closeModal: () => setModalOpen(false),
      connectWith,
      activeProvider,
      detected,
    }),
    [
      pubkey,
      prefillTo,
      connecting,
      status,
      shortAddress,
      modalOpen,
      connectWith,
      activeProvider,
      detected,
      refreshDetected,
    ],
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}

/** Active signing provider, or first detected Phantom-compatible fallback. */
export function getActiveSigner(
  active: SolanaProvider | null,
): SolanaProvider | null {
  if (active) return active;
  for (const wallet of WALLET_OPTIONS) {
    const p = wallet.getProvider();
    if (p) return p;
  }
  return null;
}
