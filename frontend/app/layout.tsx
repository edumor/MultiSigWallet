import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/lib/WalletContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MultiSig Wallet — Sepolia",
  description:
    "Interactive interface for a multi-signature Ethereum wallet on Sepolia testnet. Requires multiple owner confirmations before executing transactions.",
  openGraph: {
    title: "MultiSig Wallet — Sepolia",
    description:
      "Multi-signature wallet DApp built with Solidity, Next.js and ethers.js",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
