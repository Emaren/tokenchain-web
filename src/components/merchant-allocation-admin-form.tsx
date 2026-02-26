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

export default function MerchantAllocationAdminForm({ items }: Props) {
  const [token, setToken] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [denom, setDenom] = useState(items[0]?.denom ?? "");
  const [activityScore, setActivityScore] = useState(100);
  const [bucketCAmount, setBucketCAmount] = useState(1000);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  const valid = !!date && !!denom && activityScore > 0 && bucketCAmount > 0 && !!token;

  const commandPreview = useMemo(() => {
    return [
      "tokenchaind tx loyalty record-merchant-allocation",
      `'${date}'`,
      `'${denom}'`,
      String(activityScore),
      String(bucketCAmount),
      "--from founder",
      "--chain-id tokenchain-testnet-1",
      "--node http://127.0.0.1:26657",
      "--home /var/lib/tokenchain-testnet",
      "--keyring-backend test",
      "--yes --broadcast-mode sync --fees 5000utoken -o json",
    ].join(" ");
  }, [date, denom, activityScore, bucketCAmount]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResult(null);
    if (!valid) return;

    setPending(true);
    try {
      const res = await fetch("/api/admin/merchant-allocation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token,
          date,
          denom,
          activity_score: Math.trunc(activityScore),
          bucket_c_amount: Math.trunc(bucketCAmount),
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
      <h2 className="mt-2 text-xl font-semibold text-white">Record Merchant Allocation</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Writes a date+denom Bucket C allocation record on-chain using `record-merchant-allocation`.
      </p>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="text-[var(--muted)]">Date (YYYY-MM-DD)</span>
            <input
              className="mt-1 w-full rounded-lg border border-[var(--line)] bg-black/20 px-3 py-2 text-white"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="2026-02-26"
            />
          </label>
          <label className="block text-sm">
            <span className="text-[var(--muted)]">Token Denom</span>
            <input
              className="mt-1 w-full rounded-lg border border-[var(--line)] bg-black/20 px-3 py-2 text-white"
              list="allocation-denom-options"
              value={denom}
              onChange={(e) => setDenom(e.target.value.trim())}
              placeholder="factory/tokenchain1.../token"
            />
            <datalist id="allocation-denom-options">
              {items.map((item) => (
                <option key={item.denom} value={item.denom}>
                  {item.symbol}
                </option>
              ))}
            </datalist>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="text-[var(--muted)]">Activity Score</span>
            <input
              className="mt-1 w-full rounded-lg border border-[var(--line)] bg-black/20 px-3 py-2 text-white"
              type="number"
              min={1}
              value={activityScore}
              onChange={(e) => setActivityScore(Number(e.target.value))}
            />
          </label>
          <label className="block text-sm">
            <span className="text-[var(--muted)]">Bucket C Amount (utoken)</span>
            <input
              className="mt-1 w-full rounded-lg border border-[var(--line)] bg-black/20 px-3 py-2 text-white"
              type="number"
              min={1}
              value={bucketCAmount}
              onChange={(e) => setBucketCAmount(Number(e.target.value))}
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

        <button
          type="submit"
          disabled={!valid || pending}
          className="rounded-xl bg-[var(--gold)] px-4 py-2.5 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Submitting..." : "Submit Allocation Record"}
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
