"use client";

import { ethers } from "ethers";
import { useWallet } from "@/lib/WalletContext";
import { useMultiSig } from "@/lib/useMultiSig";
import { ETHERSCAN_BASE, CONTRACT_ADDRESS } from "@/lib/contract";

const short = (addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;

function Skeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-neutral-800 rounded-xl" />
        ))}
      </div>
      <div className="h-16 bg-neutral-800 rounded-xl" />
      <div className="h-32 bg-neutral-800 rounded-xl" />
    </div>
  );
}

export default function Dashboard() {
  const { account, isOwner } = useWallet();
  const { owners, threshold, transactions, balance, loading, error, refresh } =
    useMultiSig();

  const pending = transactions.filter((tx) => !tx.executed).length;

  if (loading) return <Skeleton />;

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 text-center">
        <p className="text-red-400 text-sm mb-3">{error}</p>
        <button
          onClick={refresh}
          className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
        >
          Try again →
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Owner badge */}
      {isOwner && (
        <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/25 rounded-xl px-4 py-3">
          <span className="w-2 h-2 rounded-full bg-violet-400 shrink-0" />
          <span className="text-sm text-violet-300">
            You&apos;re an owner —{" "}
            <span className="font-mono text-violet-200">{short(account!)}</span>
          </span>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Owners", value: owners.length, color: "text-violet-400" },
          {
            label: "Required",
            value: `${threshold} / ${owners.length}`,
            color: "text-blue-400",
          },
          { label: "Pending", value: pending, color: "text-amber-400" },
          {
            label: "Balance",
            value: `${Number(ethers.formatEther(balance)).toFixed(4)} ETH`,
            color: "text-emerald-400",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-4"
          >
            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1.5">
              {s.label}
            </p>
            <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Contract address */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
          Contract
        </p>
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-xs text-neutral-300 break-all">
            {CONTRACT_ADDRESS}
          </span>
          <a
            href={`${ETHERSCAN_BASE}/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-xs text-neutral-600 hover:text-violet-400 transition-colors"
          >
            ↗
          </a>
        </div>
      </div>

      {/* Owners list */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
        <p className="text-xs text-neutral-500 uppercase tracking-wider mb-3">
          Owners
        </p>
        <div className="space-y-2.5">
          {owners.map((owner, i) => {
            const isYou = owner.toLowerCase() === account?.toLowerCase();
            return (
              <div key={owner} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs text-neutral-600 w-4 shrink-0">{i + 1}</span>
                  <span
                    className={`font-mono text-xs truncate ${
                      isYou ? "text-violet-300" : "text-neutral-300"
                    }`}
                  >
                    {owner}
                  </span>
                  {isYou && (
                    <span className="shrink-0 text-xs bg-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded">
                      you
                    </span>
                  )}
                </div>
                <a
                  href={`${ETHERSCAN_BASE}/address/${owner}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs text-neutral-700 hover:text-violet-400 transition-colors"
                >
                  ↗
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
