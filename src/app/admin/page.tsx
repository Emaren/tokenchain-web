import Link from "next/link";
import {
  getIBCChannels,
  getLiveStatus,
  getMerchantAllocations,
  getMerchantRouting,
  getRelayerStatus,
} from "@/lib/tokenchain-api";

export default async function AdminHomePage() {
  const [live, relayer, routing, allocations, channels] = await Promise.all([
    getLiveStatus(),
    getRelayerStatus(),
    getMerchantRouting(8),
    getMerchantAllocations(8),
    getIBCChannels(8, "transfer"),
  ]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.12em] text-[var(--muted)]">TokenChain Admin</p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="display text-5xl text-[var(--gold-soft)]">Control Hub</h1>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
          Build Mode
        </span>
      </div>
      <p className="mt-4 max-w-3xl text-[var(--muted)]">
        Operator view for network health, fee routing, merchant incentives, and control-panel previews.
      </p>

      <section className="mt-7 grid gap-4 md:grid-cols-4">
        <StatusCard label="Chain" value={live?.rpc_network ?? "n/a"} />
        <StatusCard label="Height" value={live?.latest_block_height ?? "n/a"} />
        <StatusCard label="Relayer" value={relayer?.service_active ?? "unknown"} />
        <StatusCard label="Transfer Channels" value={String(channels.length)} />
      </section>

      <section className="mt-8 rounded-3xl border border-[var(--line)] bg-[var(--panel)]/70 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="display text-3xl text-[var(--gold-soft)]">Admin Consoles</h2>
          <Link
            href="/admin/mock-alpha"
            className="rounded-xl border border-[var(--line)] bg-black/20 px-4 py-2 text-sm"
          >
            Open Alternate Mockup
          </Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <PanelLink
            href="/admin/routing"
            title="Merchant Routing"
            body="Set per-token Bucket C staker/treasury splits on-chain."
          />
          <PanelLink
            href="/admin/allocations"
            title="Single Allocation"
            body="Write date+denom allocation records manually."
          />
          <PanelLink
            href="/admin/daily-allocation"
            title="Daily Batch Runner"
            body="Run multi-token activity-score allocation batches."
          />
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-[var(--line)] bg-[var(--panel)]/70 p-6">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Merchant Incentive Routing</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Top Tokens</h3>
          {routing.length > 0 ? (
            <div className="mt-4 space-y-3">
              {routing.slice(0, 5).map((item) => (
                <div key={item.denom} className="rounded-xl border border-[var(--line)] bg-black/20 p-3">
                  <p className="text-sm font-semibold text-[var(--gold)]">{item.symbol || item.name || item.denom}</p>
                  <p className="mt-1 text-xs text-[var(--muted)] break-all">{item.denom}</p>
                  <p className="mt-2 text-xs text-white">
                    Stakers {item.merchant_incentive_stakers_pct} | Treasury {item.merchant_incentive_treasury_pct}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-[var(--muted)]">Routing feed unavailable.</p>
          )}
        </article>

        <article className="rounded-3xl border border-[var(--line)] bg-[var(--panel)]/70 p-6">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Latest Allocation Ledger</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Recent Writes</h3>
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
                  {allocations.slice(0, 6).map((item) => (
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
            <p className="mt-4 text-sm text-[var(--muted)]">No allocation records yet.</p>
          )}
        </article>
      </section>

      <section className="mt-8 rounded-3xl border border-[var(--line)] bg-[var(--panel)]/70 p-6">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Operator Shortcuts</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link href="/company" className="rounded-xl border border-[var(--line)] bg-black/20 px-4 py-2">
            Company Dashboards
          </Link>
          <Link href="/staking" className="rounded-xl border border-[var(--line)] bg-black/20 px-4 py-2">
            Staking Pages
          </Link>
          <Link href="/user" className="rounded-xl border border-[var(--line)] bg-black/20 px-4 py-2">
            User Pages
          </Link>
          <Link
            href="https://api.testnet.tokenchain.tokentap.ca/v1/endpoints"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-[var(--line)] bg-black/20 px-4 py-2"
          >
            API Endpoints
          </Link>
        </div>
      </section>
    </main>
  );
}

function StatusCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-[var(--line)] bg-[var(--panel)]/70 p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </article>
  );
}

function PanelLink({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <Link href={href} className="rounded-2xl border border-[var(--line)] bg-black/20 p-4 hover:border-[var(--gold)]/40">
      <p className="text-base font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">{body}</p>
    </Link>
  );
}
