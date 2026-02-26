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

export type MerchantAllocationItem = {
  key: string;
  date: string;
  denom: string;
  activity_score: number;
  bucket_c_amount: number;
  stakers_amount: number;
  treasury_amount: number;
  merchant_incentive_stakers_bps: number;
  merchant_incentive_treasury_bps: number;
  merchant_incentive_stakers_pct: string;
  merchant_incentive_treasury_pct: string;
};

type MerchantAllocationResponse = {
	ok: boolean;
	count: number;
	items: MerchantAllocationItem[];
};

export type IBCChannelItem = {
	port_id: string;
	channel_id: string;
	state: string;
	ordering: string;
	counterparty_port_id: string;
	counterparty_channel_id: string;
	connection_id: string;
	version: string;
};

type IBCChannelsResponse = {
	ok: boolean;
	count: number;
	open_count: number;
	items: IBCChannelItem[];
};

export type RelayerStatus = {
	ok: boolean;
	relayer_service: string;
	service_active?: string;
	service_enabled?: string;
	hermes_binary: string;
	hermes_config: string;
	hermes_config_exists?: boolean;
	hermes_health_ok?: boolean;
	hermes_health_output?: string;
	hermes_health_error?: string;
	service_active_error?: string;
	service_enabled_error?: string;
	checked_at?: string;
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

export async function getMerchantAllocations(
  limit: number,
  filters?: { date?: string; denom?: string },
): Promise<MerchantAllocationItem[]> {
  try {
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    if (filters?.date) params.set("date", filters.date);
    if (filters?.denom) params.set("denom", filters.denom);

    const res = await fetch(`${API_BASE}/v1/loyalty/merchant-allocations?${params.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const body = (await res.json()) as MerchantAllocationResponse;
    if (!body.ok || !Array.isArray(body.items)) return [];
    return body.items;
  } catch {
    return [];
	}
}

export async function getIBCChannels(limit: number, portID?: string): Promise<IBCChannelItem[]> {
	try {
		const params = new URLSearchParams();
		params.set("limit", String(limit));
		if (portID) params.set("port_id", portID);
		const res = await fetch(`${API_BASE}/v1/ibc/channels?${params.toString()}`, { cache: "no-store" });
		if (!res.ok) return [];
		const body = (await res.json()) as IBCChannelsResponse;
		if (!body.ok || !Array.isArray(body.items)) return [];
		return body.items;
	} catch {
		return [];
	}
}

export async function getRelayerStatus(): Promise<RelayerStatus | null> {
	try {
		const res = await fetch(`${API_BASE}/v1/ibc/relayer-status`, { cache: "no-store" });
		if (!res.ok) return null;
		return (await res.json()) as RelayerStatus;
	} catch {
		return null;
	}
}
