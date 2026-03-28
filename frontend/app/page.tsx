import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import TransactionList from "@/components/TransactionList";
import SubmitForm from "@/components/SubmitForm";
import { CONTRACT_ADDRESS, ETHERSCAN_BASE } from "@/lib/contract";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        {/* Hero */}
        <div className="text-center space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Live on Sepolia Testnet
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            MultiSig Wallet
          </h1>
          <p className="text-neutral-400 max-w-lg mx-auto text-sm leading-relaxed">
            An on-chain multi-signature wallet that requires{" "}
            <span className="text-violet-400 font-medium">
              multiple owner confirmations
            </span>{" "}
            before executing any transaction — no single point of failure.
          </p>
          <a
            href={`${ETHERSCAN_BASE}/address/${CONTRACT_ADDRESS}#code`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-neutral-600 hover:text-violet-400 transition-colors"
          >
            {CONTRACT_ADDRESS}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3"
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
          </a>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          {/* Left: stats + submit */}
          <div className="lg:col-span-2 space-y-5">
            <Dashboard />
            <SubmitForm />
          </div>

          {/* Right: transactions */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">
              Transaction History
            </h2>
            <TransactionList />
          </div>
        </div>

        {/* How it works */}
        <div className="border-t border-neutral-900 pt-10">
          <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-6 text-center">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                title: "Submit",
                desc: "Any owner proposes a transaction with destination, value, and calldata.",
              },
              {
                step: "02",
                title: "Confirm",
                desc: "Each owner independently reviews and confirms the proposed transaction.",
              },
              {
                step: "03",
                title: "Threshold",
                desc: "The transaction becomes executable once the required number of confirmations is reached.",
              },
              {
                step: "04",
                title: "Execute",
                desc: "Any owner triggers the execution. Revocation is available until this point.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 space-y-2"
              >
                <span className="text-xs font-mono text-violet-500">
                  {item.step}
                </span>
                <h3 className="text-sm font-semibold text-neutral-200">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-8 mt-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-700">
            Built by{" "}
            <a
              href="https://github.com/edumor"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-violet-400 transition-colors"
            >
              Eduardo Moreno
            </a>{" "}
            · Ethereum Sepolia Testnet
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/edumor/MultiSigWallet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-700 hover:text-violet-400 transition-colors"
            >
              GitHub ↗
            </a>
            <a
              href={`${ETHERSCAN_BASE}/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-700 hover:text-violet-400 transition-colors"
            >
              Etherscan ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
