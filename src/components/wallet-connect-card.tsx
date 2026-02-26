"use client";

import { useEffect, useMemo, useState } from "react";

type KeplrLike = {
  enable: (chainID: string) => Promise<void>;
};

type OfflineSignerLike = {
  getAccounts: () => Promise<Array<{ address: string }>>;
};

type WalletProvider = "keplr" | "demo";

type WalletState = {
  address: string;
  provider: WalletProvider;
};

const CHAIN_ID = "tokenchain-testnet-1";
const LOCAL_STORAGE_KEY = "tokenchain_web_wallet";
const DEMO_ADDRESS = "tokenchain1demo4t4s8dzc0r5v4m8pe0j4l74tc0s2demo";

export default function WalletConnectCard() {
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const cached = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!cached) return;
    try {
      const parsed = JSON.parse(cached) as WalletState;
      if (parsed?.address && parsed?.provider) {
        setWallet(parsed);
      }
    } catch {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, []);

  const hasKeplr = useMemo(() => {
    if (typeof window === "undefined") return false;
    const w = window as Window & {
      keplr?: KeplrLike;
      getOfflineSigner?: (chainID: string) => OfflineSignerLike;
    };
    return Boolean(w.keplr && w.getOfflineSigner);
  }, []);

  const saveWallet = (next: WalletState | null) => {
    setWallet(next);
    if (typeof window === "undefined") return;
    if (!next) {
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
  };

  const connectKeplr = async () => {
    if (typeof window === "undefined") return;
    const w = window as Window & {
      keplr?: KeplrLike;
      getOfflineSigner?: (chainID: string) => OfflineSignerLike;
    };

    if (!w.keplr || !w.getOfflineSigner) {
      setError("Keplr not detected. Use Demo Wallet or install Keplr.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await w.keplr.enable(CHAIN_ID);
      const signer = w.getOfflineSigner(CHAIN_ID);
      const accounts = await signer.getAccounts();
      if (!accounts.length) {
        setError("No accounts found in Keplr for this chain.");
        return;
      }
      saveWallet({ address: accounts[0].address, provider: "keplr" });
    } catch {
      setError("Keplr connection failed. Confirm chain + wallet permissions.");
    } finally {
      setLoading(false);
    }
  };

  const useDemoWallet = () => {
    setError(null);
    saveWallet({ address: DEMO_ADDRESS, provider: "demo" });
  };

  const disconnect = () => {
    setError(null);
    saveWallet(null);
  };

  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--panel)]/70 p-5">
      <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Wallet</p>
      {wallet ? (
        <>
          <p className="mt-2 text-sm text-white">
            Connected via <strong>{wallet.provider === "keplr" ? "Keplr" : "Demo Wallet"}</strong>
          </p>
          <p className="mt-2 break-all text-sm text-[var(--gold)]">{wallet.address}</p>
          <button
            type="button"
            onClick={disconnect}
            className="mt-4 rounded-xl border border-[var(--line)] bg-black/25 px-4 py-2 text-sm"
          >
            Disconnect
          </button>
        </>
      ) : (
        <>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Connect a wallet to preview personalized staking and rewards views.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={connectKeplr}
              disabled={loading}
              className="rounded-xl bg-[var(--gold)] px-4 py-2 text-sm font-semibold text-black disabled:opacity-70"
            >
              {loading ? "Connecting..." : "Connect Keplr"}
            </button>
            <button
              type="button"
              onClick={useDemoWallet}
              className="rounded-xl border border-[var(--line)] bg-black/25 px-4 py-2 text-sm"
            >
              Use Demo Wallet
            </button>
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">Keplr detected: {hasKeplr ? "yes" : "no"}</p>
          {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
        </>
      )}
    </section>
  );
}
