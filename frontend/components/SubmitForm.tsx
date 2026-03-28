"use client";

import { useState } from "react";
import { useWallet } from "@/lib/WalletContext";
import { useMultiSig } from "@/lib/useMultiSig";

export default function SubmitForm() {
  const { isOwner, isConnected, isCorrectNetwork, connect, switchToSepolia } =
    useWallet();
  const { submitTransaction, actionLoading } = useMultiSig();

  const [to, setTo] = useState("");
  const [value, setValue] = useState("0");
  const [data, setData] = useState("0x");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!/^0x[0-9a-fA-F]{40}$/.test(to)) {
      setError("Invalid Ethereum address format");
      return;
    }
    if (data && data !== "0x" && !/^0x[0-9a-fA-F]*$/.test(data)) {
      setError("Data must be a valid hex string (0x...)");
      return;
    }

    try {
      await submitTransaction(to, value, data);
      setSuccess(true);
      setTo("");
      setValue("0");
      setData("0x");
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transaction failed");
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 text-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-neutral-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 9V7a5 5 0 00-10 0v2M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <p className="text-sm text-neutral-400">
          Connect your wallet to submit transactions
        </p>
        <button
          onClick={connect}
          className="bg-violet-600 hover:bg-violet-500 text-white text-sm px-5 py-2 rounded-lg transition-colors"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-5 text-center space-y-3">
        <p className="text-amber-400 text-sm">
          Switch to Sepolia to interact with this contract
        </p>
        <button
          onClick={switchToSepolia}
          className="bg-amber-600 hover:bg-amber-500 text-white text-sm px-5 py-2 rounded-lg transition-colors"
        >
          Switch Network
        </button>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 text-center">
        <p className="text-sm text-neutral-500">
          Only wallet owners can submit transactions
        </p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
      <h3 className="text-sm font-medium text-neutral-200 mb-4">
        Submit Transaction
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* To */}
        <div>
          <label className="block text-xs text-neutral-500 mb-1.5">
            Destination Address <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="0x..."
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm font-mono text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-violet-500 transition-colors"
            required
          />
        </div>

        {/* Value */}
        <div>
          <label className="block text-xs text-neutral-500 mb-1.5">
            ETH Value
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            min="0"
            step="0.0001"
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm font-mono text-neutral-200 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        {/* Data */}
        <div>
          <label className="block text-xs text-neutral-500 mb-1.5">
            Data{" "}
            <span className="text-neutral-600">(hex encoded calldata)</span>
          </label>
          <input
            type="text"
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder="0x"
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm font-mono text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        {error && (
          <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {success && (
          <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
            Transaction submitted successfully ✓
          </div>
        )}

        <button
          type="submit"
          disabled={actionLoading}
          className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm py-2.5 rounded-lg transition-colors font-medium"
        >
          {actionLoading ? "Submitting…" : "Submit Transaction"}
        </button>
      </form>
    </div>
  );
}
