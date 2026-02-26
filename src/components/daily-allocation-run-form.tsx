"use client";

import { useMemo, useState } from "react";
import type { MerchantRoutingItem } from "@/lib/tokenchain-api";

type Props = {
  routingItems: MerchantRoutingItem[];
};

type SubmitResult = {
  ok?: boolean;
  error?: string;
  detail?: string;
  submitted_count?: number;
  tx_hash?: string;
};

export default function DailyAllocationRunForm({ routingItems }: Props) {
  const [token, setToken] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [totalBucketCAmount, setTotalBucketCAmount] = useState(20000);
  const [dryRun, setDryRun] = useState(true);
  const [allowOverwrite, setAllowOverwrite] = useState(false);
  const [itemsJson, setItemsJson] = useState(() =>
    JSON.stringify(
      routingItems.slice(0, 2).map((item, i) => ({
        denom: item.denom,
        activity_score: i === 0 ? 80 : 20,
      })),
      null,
      2,
    ),
  );
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  const parsedItems = useMemo(() => {
    try {
      const parsed = JSON.parse(itemsJson) as unknown;
      if (!Array.isArray(parsed)) return null;
      return parsed;
    } catch {
      return null;
    }
  }, [itemsJson]);

  const valid = !!token && !!date && totalBucketCAmount > 0 && parsedItems && parsedItems.length > 0;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResult(null);
    if (!valid) return;

    setPending(true);
    try {
      const res = await fetch("/api/admin/daily-allocation-run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token,
          date,
          total_bucket_c_amount: totalBucketCAmount,
          allow_overwrite: allowOverwrite,
          dry_run: dryRun,
          items: parsedItems,
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
      <p className="text-sm uppercase tracking-[0.12em] text-[var(--muted)]">Batch Runner</p>
      <h2 className="mt-2 text-xl font-semibold text-white">Run Daily Allocation Batch</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Computes deterministic Bucket C per-denom allocations from activity scores, then writes one on-chain record per denom.
      </p>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="text-[var(--muted)]">Date (YYYY-MM-DD)</span>
            <input
              className="mt-1 w-full rounded-lg border border-[var(--line)] bg-black/20 px-3 py-2 text-white"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="text-[var(--muted)]">Total Bucket C Amount (utoken)</span>
            <input
              className="mt-1 w-full rounded-lg border border-[var(--line)] bg-black/20 px-3 py-2 text-white"
              type="number"
              min={1}
              value={totalBucketCAmount}
              onChange={(e) => setTotalBucketCAmount(Number(e.target.value))}
            />
          </label>
        </div>

        <label className="block text-sm">
          <span className="text-[var(--muted)]">Items JSON (`denom` + `activity_score`)</span>
          <textarea
            className="mt-1 h-52 w-full rounded-lg border border-[var(--line)] bg-black/20 px-3 py-2 font-mono text-xs text-white"
            value={itemsJson}
            onChange={(e) => setItemsJson(e.target.value)}
          />
        </label>

        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={dryRun} onChange={(e) => setDryRun(e.target.checked)} />
            Dry run
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={allowOverwrite}
              onChange={(e) => setAllowOverwrite(e.target.checked)}
            />
            Allow overwrite existing day records
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

        {!parsedItems && <p className="text-sm text-red-300">Items JSON is invalid.</p>}

        <button
          type="submit"
          disabled={!valid || pending}
          className="rounded-xl bg-[var(--gold)] px-4 py-2.5 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Submitting..." : "Run Daily Allocation"}
        </button>
      </form>

      {result && (
        <div className="mt-4 rounded-xl border border-[var(--line)] bg-black/30 p-3 text-sm">
          {result.ok ? (
            <p className="text-green-300">Success. Batch accepted.</p>
          ) : (
            <p className="text-red-300">
              Failed: {result.error}
              {result.detail ? ` (${result.detail})` : ""}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
