"use client";

import Link from "next/link";
import { useWallet } from "@/lib/WalletContext";
import { ETHERSCAN_BASE, CONTRACT_ADDRESS } from "@/lib/contract";

const short = (addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;

export default function Header() {
  const {
    account,
    isConnected,
    isCorrectNetwork,
    isLoading,
    connect,
    switchToSepolia,
  } = useWallet();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <span className="font-semibold text-white text-sm">MultiSig Wallet</span>
          <span className="hidden sm:inline text-xs bg-amber-500/15 text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded-full font-medium">
            Sepolia
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Link
            href={`${ETHERSCAN_BASE}/address/${CONTRACT_ADDRESS}`}
            target="_blank"
            className="hidden md:flex items-center gap-1.5 text-xs text-neutral-500 hover:text-violet-400 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Etherscan
          </Link>

          <Link
            href="https://github.com/edumor/MultiSigWallet"
            target="_blank"
            className="hidden md:flex items-center gap-1.5 text-xs text-neutral-500 hover:text-violet-400 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.73.083-.73 1.205.085 1.84 1.238 1.84 1.238 1.07 1.833 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.334-5.466-5.93 0-1.31.468-2.382 1.236-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 013.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.838 1.235 1.91 1.235 3.22 0 4.61-2.804 5.625-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </Link>

          {isConnected && !isCorrectNetwork ? (
            <button
              onClick={switchToSepolia}
              className="text-xs bg-red-500/15 text-red-400 border border-red-500/25 px-3 py-1.5 rounded-lg hover:bg-red-500/25 transition-colors"
            >
              Switch to Sepolia
            </button>
          ) : isConnected ? (
            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-sm text-neutral-200 font-mono">{short(account!)}</span>
            </div>
          ) : (
            <button
              onClick={connect}
              disabled={isLoading}
              className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm px-4 py-1.5 rounded-lg transition-colors font-medium"
            >
              {isLoading ? "Connecting…" : "Connect Wallet"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
