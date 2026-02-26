"use client";

import { useMemo, useState } from "react";
import type { MerchantRoutingItem } from "@/lib/tokenchain-api";

type Props = {
  items: MerchantRoutingItem[];
};

type SubmitResult = {
  ok?: boolean;
  tx_hash?: string;
  error?: string;
  detail?: string;
  code?: number;
};

export default function MerchantRoutingAdminForm({ items }: Props) {
  const [token, setToken] = useState("");
  const [denom, setDenom] = useState(items[0]?.denom ?? "");
  const [stakersBps, setStakersBps] = useState(items[0]?.merchant_incentive_stakers_bps ?? 5000);
  const [treasuryBps, setTreasuryBps] = useState(items[0]?.merchant_incentive_treasury_bps ?? 5000);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  const bpsValid = stakersBps >= 0 && treasuryBps >= 0 && stakersBps + treasuryBps === 10000;

  const commandPreview = useMemo(() => {
    return [
      "tokenchaind tx loyalty set-merchant-incentive-routing",
      `'${denom}'`,
      String(stakersBps),
      String(treasuryBps),
      "--from founder",
      "--chain-id tokenchain-testnet-1",
      "--node http://127.0.0.1:26657",
      "--home /var/lib/tokenchain-testnet",
      "--keyring-backend test",
      "--yes --broadcast-mode sync --fees 5000utoken -o json",
    ].join(" ");
  }, [denom, stakersBps, treasuryBps]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResult(null);
    if (!denom || !token || !bpsValid) return;

    setPending(true);
    try {
      const res = await fetch("/api/admin/merchant-routing", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token,
          denom,
          merchant_incentive_stakers_bps: stakersBps,
          merchant_incentive_treasury_bps: treasuryBps,
        }),
      });
      const body = (await res.json()) as SubmitResult;
      setResult(body);
    } catch {
      setResult({ ok: false, error: "request_failed", detail: "Request to admin proxy failed" });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)]/70 p-5">
      <p className="text-sm uppercase tracking-[0.12em] text-[var(--muted)]">Operator Action</p>
      <h2 className="mt-2 text-xl font-semibold text-white">Set Merchant Incentive Routing</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        This uses the tokenchain indexer admin endpoint with Bearer auth. Token is used in-memory only.
      </p>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <label className="block text-sm">
          <span className="text-[var(--muted)]">Token Denom</span>
          <input
            className="mt-1 w-full rounded-lg border border-[var(--line)] bg-black/20 px-3 py-2 text-white"
            list="denom-options"
            value={denom}
            onChange={(e) => setDenom(e.target.value.trim())}
            placeholder="factory/tokenchain1.../token"
          />
          <datalist id="denom-options">
            {items.map((item) => (
              <option key={item.denom} value={item.denom}>
                {item.symbol}
              </option>
            ))}
          </datalist>
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="text-[var(--muted)]">Stakers BPS</span>
            <input
              className="mt-1 w-full rounded-lg border border-[var(--line)] bg-black/20 px-3 py-2 text-white"
              type="number"
              min={0}
              max={10000}
              value={stakersBps}
              onChange={(e) => setStakersBps(Number(e.target.value))}
            />
          </label>
          <label className="block text-sm">
            <span className="text-[var(--muted)]">Treasury BPS</span>
            <input
              className="mt-1 w-full rounded-lg border border-[var(--line)] bg-black/20 px-3 py-2 text-white"
              type="number"
              min={0}
              max={10000}
              value={treasuryBps}
              onChange={(e) => setTreasuryBps(Number(e.target.value))}
            />
          </label>
        </div>

        <label className="block text-sm">
          <span className="text-[var(--muted)]">Admin API Token</span>
          <input
            className="mt-1 w-full rounded-lg border border-[var(--line)] bg-black/20 px-3 py-2 text-white"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Bearer token"
          />
        </label>

        {!bpsValid && (
          <p className="text-sm text-red-300">Stakers BPS + Treasury BPS must equal 10000.</p>
        )}

        <button
          type="submit"
          disabled={!denom || !token || !bpsValid || pending}
          className="rounded-xl bg-[var(--gold)] px-4 py-2.5 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Submitting..." : "Submit Routing Update"}
        </button>
      </form>

      <div className="mt-5 rounded-xl border border-[var(--line)] bg-black/30 p-3">
        <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">CLI Fallback</p>
        <pre className="mt-2 overflow-x-auto text-xs text-[var(--gold)]">{commandPreview}</pre>
      </div>

      {result && (
        <div className="mt-4 rounded-xl border border-[var(--line)] bg-black/30 p-3 text-sm">
          {result.ok ? (
            <p className="text-green-300">Success. Tx hash: {result.tx_hash}</p>
          ) : (
            <p className="text-red-300">
              Failed: {result.error}
              {result.detail ? ` (${result.detail})` : ""}
              {typeof result.code === "number" ? ` [code ${result.code}]` : ""}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

