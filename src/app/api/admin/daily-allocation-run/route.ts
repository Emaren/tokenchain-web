import { NextRequest, NextResponse } from "next/server";
import { API_BASE } from "@/lib/tokenchain-api";

type ScoreItem = {
  denom?: string;
  activity_score?: number;
};

type RequestBody = {
  token?: string;
  date?: string;
  total_bucket_c_amount?: number;
  allow_overwrite?: boolean;
  dry_run?: boolean;
  items?: ScoreItem[];
};

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const token = String(body.token ?? "").trim();
  const date = String(body.date ?? "").trim();
  const totalBucketCAmount = Number(body.total_bucket_c_amount);
  const allowOverwrite = Boolean(body.allow_overwrite);
  const dryRun = Boolean(body.dry_run);
  const items = Array.isArray(body.items) ? body.items : [];

  if (!token) {
    return NextResponse.json({ ok: false, error: "token_required" }, { status: 400 });
  }
  if (!Number.isFinite(totalBucketCAmount) || totalBucketCAmount <= 0) {
    return NextResponse.json({ ok: false, error: "invalid_total_bucket_c_amount" }, { status: 400 });
  }
  if (items.length === 0) {
    return NextResponse.json({ ok: false, error: "items_required" }, { status: 400 });
  }

  const normalizedItems = items
    .map((item) => ({
      denom: String(item.denom ?? "").trim(),
      activity_score: Number(item.activity_score),
    }))
    .filter((item) => item.denom && Number.isFinite(item.activity_score) && item.activity_score > 0)
    .map((item) => ({
      denom: item.denom,
      activity_score: Math.trunc(item.activity_score),
    }));

  if (normalizedItems.length === 0) {
    return NextResponse.json({ ok: false, error: "invalid_items" }, { status: 400 });
  }

  const upstream = await fetch(`${API_BASE}/v1/admin/loyalty/daily-allocation/run`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      date,
      total_bucket_c_amount: Math.trunc(totalBucketCAmount),
      allow_overwrite: allowOverwrite,
      dry_run: dryRun,
      items: normalizedItems,
    }),
    cache: "no-store",
  });

  const text = await upstream.text();
  let parsed: unknown = { ok: false, error: "invalid_upstream_json", raw: text };
  try {
    parsed = JSON.parse(text) as unknown;
  } catch {
    // keep fallback parsed
  }

  return NextResponse.json(parsed, { status: upstream.status });
}
