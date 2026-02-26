import Link from "next/link";
import WalletConnectCard from "@/components/wallet-connect-card";
import { getIBCChannels, getLiveStatus, getMerchantAllocations } from "@/lib/tokenchain-api";

export default async function UserHomePage() {
  const [live, channels, allocations] = await Promise.all([
    getLiveStatus(),
    getIBCChannels(20, "transfer"),
    getMerchantAllocations(12),
  ]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.12em] text-[var(--muted)]">User Dashboard</p>
      <h1 className="display mt-3 text-5xl text-[var(--gold-soft)]">Wallet + Chain Stats</h1>
      <p className="mt-4 max-w-3xl text-[var(--muted)]">
        Build-mode user view for connected-wallet identity, chain telemetry, and personal reward overview.
      </p>

      <section className="mt-7 grid gap-4 lg:grid-cols-[1fr_2fr]">
        <WalletConnectCard />

        <article className="rounded-3xl border border-[var(--line)] bg-[var(--panel)]/70 p-6">
          <h2 className="text-2xl font-semibold text-white">Network Snapshot</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Chain" value={live?.rpc_network ?? "n/a"} />
            <Metric label="Height" value={live?.latest_block_height ?? "n/a"} />
            <Metric label="Sync" value={live ? (live.catching_up ? "syncing" : "online") : "unknown"} />
            <Metric label="IBC Channels" value={String(channels.length)} />
          </div>

          <div className="mt-5 rounded-2xl border border-[var(--line)] bg-black/20 p-4 text-sm text-[var(--muted)]">
            Wallet-specific balances and reward positions are currently in build mode. This panel is live-wired to network APIs first,
            then wallet-indexed balances/claims are next.
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link href="/staking" className="rounded-xl border border-[var(--line)] bg-black/20 px-4 py-2">
              Open Staking Pages
            </Link>
            <Link href="/user/activity" className="rounded-xl border border-[var(--line)] bg-black/20 px-4 py-2">
              View Activity
            </Link>
            <Link href="https://api.testnet.tokenchain.tokentap.ca/v1/status" target="_blank" rel="noreferrer" className="rounded-xl border border-[var(--line)] bg-black/20 px-4 py-2">
              Raw Status API
            </Link>
          </div>
        </article>
      </section>

      <section className="mt-8 rounded-3xl border border-[var(--line)] bg-[var(--panel)]/70 p-6">
        <h2 className="display text-3xl text-[var(--gold-soft)]">Latest Incentive Ledger Records</h2>
        {allocations.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-[var(--muted)]">
                <tr>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Denom</th>
                  <th className="py-2 pr-4">Bucket C</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map((item) => (
                  <tr key={item.key} className="border-t border-[var(--line)]">
                    <td className="py-2 pr-4 text-white">{item.date}</td>
                    <td className="py-2 pr-4 text-[var(--muted)] break-all">{item.denom}</td>
                    <td className="py-2 pr-4 text-white">{item.bucket_c_amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-[var(--muted)]">No incentive records yet.</p>
        )}
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-black/20 p-3">
      <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-sm text-white">{value}</p>
    </div>
  );
}
