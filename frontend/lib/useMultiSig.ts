"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI, PUBLIC_RPCS } from "./contract";
import { useWallet } from "./WalletContext";

export interface TxData {
  index: number;
  to: string;
  value: bigint;
  data: string;
  executed: boolean;
  numConfirmations: number;
}

/** Try each public RPC in order until one works */
async function getReadProvider(): Promise<ethers.JsonRpcProvider> {
  // Prefer injected provider (MetaMask) for reading — avoids CORS/firewall issues
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      const p = new ethers.BrowserProvider(window.ethereum);
      await p.getBlockNumber(); // quick liveness check
      return p as unknown as ethers.JsonRpcProvider;
    } catch {
      // fall through to public RPCs
    }
  }

  for (const url of PUBLIC_RPCS) {
    try {
      const p = new ethers.JsonRpcProvider(url);
      await p.getBlockNumber();
      return p;
    } catch {
      // try next
    }
  }

  // Last resort: return first RPC without a liveness check
  return new ethers.JsonRpcProvider(PUBLIC_RPCS[0]);
}

export function useMultiSig() {
  const { signer } = useWallet();

  const [owners, setOwners] = useState<string[]>([]);
  const [threshold, setThreshold] = useState(0);
  const [transactions, setTransactions] = useState<TxData[]>([]);
  const [balance, setBalance] = useState<bigint>(0n);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const writeContract = useMemo(
    () => (signer ? new ethers.Contract(CONTRACT_ADDRESS, ABI, signer) : null),
    [signer]
  );

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const provider = await getReadProvider();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

      const [ownersRaw, thresholdRaw, txCountRaw, balanceRaw] =
        await Promise.all([
          contract.getOwners(),
          contract.numConfirmationsRequired(),
          contract.getTransactionCount(),
          provider.getBalance(CONTRACT_ADDRESS),
        ]);

      setOwners([...ownersRaw]);
      setThreshold(Number(thresholdRaw));
      setBalance(balanceRaw);

      const count = Number(txCountRaw);
      const txPromises = Array.from({ length: count }, (_, i) =>
        contract.getTransaction(i)
      );
      const txData = await Promise.all(txPromises);

      const txList: TxData[] = txData.map((tx, i) => ({
        index: i,
        to: tx.to,
        value: tx.value,
        data: tx.data,
        executed: tx.executed,
        numConfirmations: Number(tx.numConfirmations),
      }));

      setTransactions([...txList].reverse());
    } catch (err) {
      console.error(err);
      setError("Could not load contract data. Check network connectivity.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const withLoading = useCallback(
    async (fn: () => Promise<void>) => {
      setActionLoading(true);
      try {
        await fn();
        await fetchData();
      } catch (err: unknown) {
        const msg =
          typeof err === "object" && err !== null && "reason" in err
            ? String((err as { reason: string }).reason)
            : err instanceof Error
            ? err.message
            : "Transaction failed";
        throw new Error(msg);
      } finally {
        setActionLoading(false);
      }
    },
    [fetchData]
  );

  const submitTransaction = useCallback(
    (to: string, ethValue: string, data: string) =>
      withLoading(async () => {
        if (!writeContract) throw new Error("Wallet not connected");
        const value = ethers.parseEther(ethValue || "0");
        const tx = await writeContract.submitTransaction(to, value, data || "0x");
        await tx.wait();
      }),
    [writeContract, withLoading]
  );

  const confirmTransaction = useCallback(
    (index: number) =>
      withLoading(async () => {
        if (!writeContract) throw new Error("Wallet not connected");
        const tx = await writeContract.confirmTransaction(index);
        await tx.wait();
      }),
    [writeContract, withLoading]
  );

  const executeTransaction = useCallback(
    (index: number) =>
      withLoading(async () => {
        if (!writeContract) throw new Error("Wallet not connected");
        const tx = await writeContract.executeTransaction(index);
        await tx.wait();
      }),
    [writeContract, withLoading]
  );

  const revokeConfirmation = useCallback(
    (index: number) =>
      withLoading(async () => {
        if (!writeContract) throw new Error("Wallet not connected");
        const tx = await writeContract.revokeConfirmation(index);
        await tx.wait();
      }),
    [writeContract, withLoading]
  );

  const checkConfirmation = useCallback(
    async (txIndex: number, address: string): Promise<boolean> => {
      try {
        const provider = await getReadProvider();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        return await contract.isConfirmed(txIndex, address);
      } catch {
        return false;
      }
    },
    []
  );

  return {
    owners,
    threshold,
    transactions,
    balance,
    loading,
    actionLoading,
    error,
    refresh: fetchData,
    submitTransaction,
    confirmTransaction,
    executeTransaction,
    revokeConfirmation,
    checkConfirmation,
  };
}
