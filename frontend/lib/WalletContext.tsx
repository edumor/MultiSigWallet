"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI, SEPOLIA_CHAIN_ID } from "./contract";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
}

interface WalletState {
  account: string | null;
  signer: ethers.JsonRpcSigner | null;
  isOwner: boolean;
  chainId: number | null;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  isLoading: boolean;
  connect: () => Promise<void>;
  switchToSepolia: () => Promise<void>;
}

const WalletContext = createContext<WalletState>({} as WalletState);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isConnected = !!account;
  const isCorrectNetwork = chainId === SEPOLIA_CHAIN_ID;

  const checkOwnership = useCallback(
    async (address: string, provider: ethers.BrowserProvider) => {
      try {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        const result = await contract.isOwner(address);
        setIsOwner(result);
      } catch {
        setIsOwner(false);
      }
    },
    []
  );

  const connect = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("MetaMask not found. Please install MetaMask to use this DApp.");
      return;
    }
    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      const s = await provider.getSigner();
      const addr = await s.getAddress();

      setSigner(s);
      setAccount(addr);
      setChainId(Number(network.chainId));

      if (Number(network.chainId) === SEPOLIA_CHAIN_ID) {
        await checkOwnership(addr, provider);
      }
    } catch (err) {
      console.error("Wallet connection error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [checkOwnership]);

  const switchToSepolia = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }],
      });
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "code" in err && (err as { code: number }).code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xaa36a7",
              chainName: "Sepolia Testnet",
              nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
              rpcUrls: ["https://rpc.sepolia.org"],
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        });
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setAccount(null);
        setSigner(null);
        setIsOwner(false);
      } else {
        connect();
      }
    };

    const handleChainChanged = () => window.location.reload();

    window.ethereum.on?.("accountsChanged", handleAccountsChanged);
    window.ethereum.on?.("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener?.("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener?.("chainChanged", handleChainChanged);
    };
  }, [connect]);

  return (
    <WalletContext.Provider
      value={{
        account,
        signer,
        isOwner,
        chainId,
        isConnected,
        isCorrectNetwork,
        isLoading,
        connect,
        switchToSepolia,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
