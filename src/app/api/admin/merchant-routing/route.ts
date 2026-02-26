import { NextRequest, NextResponse } from "next/server";
import { API_BASE } from "@/lib/tokenchain-api";

type RequestBody = {
  token?: string;
  denom?: string;
  merchant_incentive_stakers_bps?: number;
  merchant_incentive_treasury_bps?: number;
};

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const token = String(body.token ?? "").trim();
  const denom = String(body.denom ?? "").trim();
  const stakers = Number(body.merchant_incentive_stakers_bps);
  const treasury = Number(body.merchant_incentive_treasury_bps);

  if (!token) {
    return NextResponse.json({ ok: false, error: "token_required" }, { status: 400 });
  }
  if (!denom) {
    return NextResponse.json({ ok: false, error: "denom_required" }, { status: 400 });
  }
  if (!Number.isFinite(stakers) || !Number.isFinite(treasury)) {
    return NextResponse.json({ ok: false, error: "invalid_bps" }, { status: 400 });
  }

  const upstream = await fetch(`${API_BASE}/v1/admin/loyalty/merchant-routing`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      denom,
      merchant_incentive_stakers_bps: Math.trunc(stakers),
      merchant_incentive_treasury_bps: Math.trunc(treasury),
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

