import {
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  lamportsToSol,
  resolveMode,
  solanaRpc,
  type SolanaCallResult,
} from "@/lib/solana";

const SYSTEM_PROGRAM = "11111111111111111111111111111111";

export function solToLamports(sol: string): number {
  const n = Number(sol);
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error("sol amount must be a positive number");
  }
  return Math.round(n * 1_000_000_000);
}

export function assertAddress(label: string, value: string): PublicKey {
  try {
    return new PublicKey(value.trim());
  } catch {
    throw new Error(`${label} is not a valid Solana address`);
  }
}

export type PrepareTransferResult = {
  summary: string;
  evidence: SolanaCallResult[];
  payload: Record<string, unknown>;
};

export async function prepareTransfer(args: {
  from: string;
  to: string;
  sol: string;
}): Promise<PrepareTransferResult> {
  const fromPk = assertAddress("from", args.from);
  const toPk = assertAddress("to", args.to);
  const lamports = solToLamports(args.sol);
  const evidence: SolanaCallResult[] = [];

  const balanceEv = await solanaRpc("getBalance", [
    fromPk.toBase58(),
    { commitment: "confirmed" },
  ]);
  evidence.push(balanceEv);
  const balanceLamports = Number(
    (balanceEv.data as { value?: number } | null)?.value ?? 0,
  );

  const bhEv = await solanaRpc("getLatestBlockhash", [
    { commitment: "finalized" },
  ]);
  evidence.push(bhEv);
  const bh = (bhEv.data as { value?: { blockhash?: string; lastValidBlockHeight?: number } } | null)
    ?.value;

  if (!bhEv.ok || !bh?.blockhash) {
    return {
      summary: `prepare_transfer failed: could not fetch blockhash. ${bhEv.error || ""}`.trim(),
      evidence,
      payload: {
        ready: false,
        from: fromPk.toBase58(),
        to: toPk.toBase58(),
        lamports,
        sol: lamportsToSol(lamports),
      },
    };
  }

  const mode = resolveMode();
  let serializedMessageBase64: string | null = null;
  let feeLamports: number | null = null;

  // Build a versioned transfer message when keys/blockhash are usable.
  // Mock fixtures still produce a readable prepare plan even if serialize fails.
  try {
    const ix = SystemProgram.transfer({
      fromPubkey: fromPk,
      toPubkey: toPk,
      lamports,
    });
    const message = new TransactionMessage({
      payerKey: fromPk,
      recentBlockhash: bh.blockhash,
      instructions: [ix],
    }).compileToV0Message();
    const vtx = new VersionedTransaction(message);
    serializedMessageBase64 = Buffer.from(vtx.message.serialize()).toString(
      "base64",
    );

    const feeEv = await solanaRpc("getFeeForMessage", [
      serializedMessageBase64,
      { commitment: "confirmed" },
    ]);
    evidence.push(feeEv);
    feeLamports = Number(
      (feeEv.data as { value?: number | null } | null)?.value ?? 0,
    );
  } catch (e) {
    evidence.push({
      ok: false,
      mode: mode === "mock" ? "mock" : "live",
      endpoint: "buildTransferMessage",
      url: "local://wallet-prepare",
      params: { from: fromPk.toBase58(), to: toPk.toBase58(), lamports },
      status: 0,
      data: null,
      error: e instanceof Error ? e.message : "message build failed",
      fetchedAt: new Date().toISOString(),
    });
  }

  const needs = lamports + (feeLamports || 5000);
  const sufficient = balanceLamports >= needs;

  return {
    summary: sufficient
      ? `Transfer prepared: ${lamportsToSol(lamports)} SOL from ${fromPk.toBase58().slice(0, 4)}… to ${toPk.toBase58().slice(0, 4)}…. Blockhash ready. ${feeLamports != null ? `Fee ~${feeLamports} lamports.` : "Fee pending wallet simulation."}`
      : `Transfer prepared but balance may be low. Have ${lamportsToSol(balanceLamports)} SOL, need about ${lamportsToSol(needs)} SOL including fee buffer.`,
    evidence,
    payload: {
      ready: true,
      program: SYSTEM_PROGRAM,
      instruction: "SystemProgram.transfer",
      from: fromPk.toBase58(),
      to: toPk.toBase58(),
      lamports,
      sol: lamportsToSol(lamports),
      balanceLamports,
      balanceSol: lamportsToSol(balanceLamports),
      blockhash: bh.blockhash,
      lastValidBlockHeight: bh.lastValidBlockHeight ?? null,
      feeLamports,
      serializedMessageBase64,
      sufficient,
      nextStep:
        "Sign and send with a Solana wallet, then call confirm_receipt with the signature.",
    },
  };
}

export async function confirmReceipt(args: {
  signature: string;
}): Promise<PrepareTransferResult> {
  const signature = args.signature.trim();
  if (!signature || signature.length < 32) {
    throw new Error("signature is required");
  }

  const statusEv = await solanaRpc("getSignatureStatuses", [
    [signature],
    { searchTransactionHistory: true },
  ]);
  const evidence: SolanaCallResult[] = [statusEv];
  const value = (
    statusEv.data as { value?: Array<Record<string, unknown> | null> } | null
  )?.value?.[0];

  const txEv = await solanaRpc("getTransaction", [
    signature,
    {
      encoding: "json",
      maxSupportedTransactionVersion: 0,
      commitment: "confirmed",
    },
  ]);
  evidence.push(txEv);

  const conf = value?.confirmationStatus
    ? String(value.confirmationStatus)
    : value?.err
      ? "failed"
      : statusEv.ok
        ? "unknown"
        : "rpc_error";

  return {
    summary: statusEv.ok
      ? `Receipt for ${signature.slice(0, 8)}… status=${conf}.${value?.err ? ` err=${JSON.stringify(value.err)}` : ""}`
      : `confirm_receipt failed: ${statusEv.error || "unknown error"}`,
    evidence,
    payload: {
      signature,
      confirmationStatus: conf,
      err: value?.err ?? null,
      slot: value?.slot ?? null,
      confirmations: value?.confirmations ?? null,
      transaction: txEv.data,
      explorer: `https://explorer.solana.com/tx/${signature}`,
    },
  };
}
