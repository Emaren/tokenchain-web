import { NextRequest, NextResponse } from "next/server";
import { API_BASE } from "@/lib/tokenchain-api";

type RequestBody = {
  token?: string;
  date?: string;
  denom?: string;
  activity_score?: number;
  bucket_c_amount?: number;
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
  const denom = String(body.denom ?? "").trim();
  const activityScore = Number(body.activity_score);
  const bucketCAmount = Number(body.bucket_c_amount);

  if (!token) {
    return NextResponse.json({ ok: false, error: "token_required" }, { status: 400 });
  }
  if (!date) {
    return NextResponse.json({ ok: false, error: "date_required" }, { status: 400 });
  }
  if (!denom) {
    return NextResponse.json({ ok: false, error: "denom_required" }, { status: 400 });
  }
  if (!Number.isFinite(activityScore) || activityScore <= 0) {
    return NextResponse.json({ ok: false, error: "invalid_activity_score" }, { status: 400 });
  }
  if (!Number.isFinite(bucketCAmount) || bucketCAmount <= 0) {
    return NextResponse.json({ ok: false, error: "invalid_bucket_c_amount" }, { status: 400 });
  }

  const upstream = await fetch(`${API_BASE}/v1/admin/loyalty/merchant-allocation`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      date,
      denom,
      activity_score: Math.trunc(activityScore),
      bucket_c_amount: Math.trunc(bucketCAmount),
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
