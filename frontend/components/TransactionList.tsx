"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWallet } from "@/lib/WalletContext";
import { useMultiSig, TxData } from "@/lib/useMultiSig";
import { ETHERSCAN_BASE } from "@/lib/contract";

const short = (addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;

function TransactionCard({
  tx,
  account,
  threshold,
  isOwner,
  actionLoading,
  onConfirm,
  onExecute,
  onRevoke,
  checkConfirmation,
}: {
  tx: TxData;
  account: string | null;
  threshold: number;
  isOwner: boolean;
  actionLoading: boolean;
  onConfirm: (i: number) => Promise<void>;
  onExecute: (i: number) => Promise<void>;
  onRevoke: (i: number) => Promise<void>;
  checkConfirmation: (i: number, addr: string) => Promise<boolean>;
}) {
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (account && !tx.executed) {
      checkConfirmation(tx.index, account).then(setHasConfirmed);
    }
  }, [tx.index, account, tx.executed, tx.numConfirmations, checkConfirmation]);

  const handle = async (fn: () => Promise<void>) => {
    setTxError(null);
    setLocalLoading(true);
    try {
      await fn();
    } catch (e: unknown) {
      setTxError(e instanceof Error ? e.message : "Transaction failed");
    } finally {
      setLocalLoading(false);
    }
  };

  const canExecute = !tx.executed && tx.numConfirmations >= threshold;
  const progress = Math.min((tx.numConfirmations / threshold) * 100, 100);
  const busy = actionLoading || localLoading;

  return (
    <div
      className={`bg-neutral-900 border rounded-xl p-4 space-y-3 transition-opacity ${
        tx.executed ? "border-neutral-800 opacity-60" : "border-neutral-700"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-neutral-600">#{tx.index}</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              tx.executed
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-amber-500/10 text-amber-400"
            }`}
          >
            {tx.executed ? "Executed" : "Pending"}
          </span>
        </div>
        <span className="text-xs text-neutral-500">
          {tx.numConfirmations}/{threshold} confirmations
        </span>
      </div>

      {/* Progress bar */}
      {!tx.executed && (
        <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Details */}
      <div className="space-y-1.5 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-neutral-500 text-xs w-9 shrink-0">To</span>
          <a
            href={`${ETHERSCAN_BASE}/address/${tx.to}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-neutral-300 hover:text-violet-400 transition-colors truncate"
          >
            {tx.to}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-neutral-500 text-xs w-9 shrink-0">Value</span>
          <span className="font-mono text-xs text-neutral-300">
            {ethers.formatEther(tx.value)} ETH
          </span>
        </div>
        {tx.data && tx.data !== "0x" && (
          <div className="flex items-start gap-2">
            <span className="text-neutral-500 text-xs w-9 shrink-0">Data</span>
            <span className="font-mono text-xs text-neutral-500 break-all">
              {tx.data.length > 66 ? tx.data.slice(0, 66) + "…" : tx.data}
            </span>
          </div>
        )}
      </div>

      {/* Actions — only for owners, only on pending txs */}
      {!tx.executed && isOwner && (
        <div className="flex gap-2 pt-1">
          {!hasConfirmed ? (
            <button
              onClick={() => handle(() => onConfirm(tx.index))}
              disabled={busy}
              className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-xs py-2 rounded-lg transition-colors"
            >
              {busy ? "…" : "Confirm"}
            </button>
          ) : (
            <button
              onClick={() => handle(() => onRevoke(tx.index))}
              disabled={busy}
              className="flex-1 bg-neutral-700 hover:bg-neutral-600 disabled:opacity-40 text-neutral-300 text-xs py-2 rounded-lg transition-colors"
            >
              {busy ? "…" : "Revoke"}
            </button>
          )}
          {canExecute && (
            <button
              onClick={() => handle(() => onExecute(tx.index))}
              disabled={busy}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs py-2 rounded-lg transition-colors"
            >
              {busy ? "…" : "Execute"}
            </button>
          )}
        </div>
      )}

      {txError && (
        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {txError}
        </p>
      )}
    </div>
  );
}

type Filter = "all" | "pending" | "executed";

export default function TransactionList() {
  const { account, isOwner } = useWallet();
  const {
    transactions,
    threshold,
    loading,
    actionLoading,
    confirmTransaction,
    executeTransaction,
    revokeConfirmation,
    checkConfirmation,
    refresh,
  } = useMultiSig();
  const [filter, setFilter] = useState<Filter>("all");

  const counts = {
    all: transactions.length,
    pending: transactions.filter((t) => !t.executed).length,
    executed: transactions.filter((t) => t.executed).length,
  };

  const filtered = transactions.filter((tx) => {
    if (filter === "pending") return !tx.executed;
    if (filter === "executed") return tx.executed;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-neutral-900 border border-neutral-800 rounded-xl p-1">
          {(["all", "pending", "executed"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs rounded-lg capitalize transition-colors ${
                filter === f
                  ? "bg-violet-600 text-white"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {f} ({counts[f]})
            </button>
          ))}
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="text-xs text-neutral-600 hover:text-violet-400 transition-colors"
        >
          Refresh ↺
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-neutral-900 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-neutral-600 text-sm">
          No {filter !== "all" ? filter : ""} transactions yet
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((tx) => (
            <TransactionCard
              key={tx.index}
              tx={tx}
              account={account}
              threshold={threshold}
              isOwner={isOwner}
              actionLoading={actionLoading}
              onConfirm={confirmTransaction}
              onExecute={executeTransaction}
              onRevoke={revokeConfirmation}
              checkConfirmation={checkConfirmation}
            />
          ))}
        </div>
      )}

      {/* Non-owner notice */}
      {!isOwner && !loading && filtered.some((t) => !t.executed) && (
        <p className="text-xs text-neutral-600 text-center">
          Connect as an owner to confirm or execute transactions
        </p>
      )}
    </div>
  );
}
