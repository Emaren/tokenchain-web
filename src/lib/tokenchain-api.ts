export const API_BASE = "https://api.testnet.tokenchain.tokentap.ca";

export type LiveStatus = {
  ok: boolean;
  latest_block_height: string;
  catching_up: boolean;
  rpc_network: string;
};

export type MerchantRoutingItem = {
  denom: string;
  name: string;
  symbol: string;
  verified: boolean;
  max_supply: string;
  minted_supply: string;
  merchant_incentive_stakers_bps: number;
  merchant_incentive_treasury_bps: number;
  merchant_incentive_stakers_pct: string;
  merchant_incentive_treasury_pct: string;
};

type MerchantRoutingResponse = {
  ok: boolean;
  count: number;
  items: MerchantRoutingItem[];
};

export async function getLiveStatus(): Promise<LiveStatus | null> {
  try {
    const res = await fetch(`${API_BASE}/v1/status`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as LiveStatus;
  } catch {
    return null;
  }
}

export async function getMerchantRouting(limit: number): Promise<MerchantRoutingItem[]> {
  try {
    const res = await fetch(`${API_BASE}/v1/loyalty/merchant-routing?limit=${limit}`, { cache: "no-store" });
    if (!res.ok) return [];
    const body = (await res.json()) as MerchantRoutingResponse;
    if (!body.ok || !Array.isArray(body.items)) return [];
    return body.items;
  } catch {
    return [];
  }
}

