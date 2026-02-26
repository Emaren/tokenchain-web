import Link from "next/link";
import WalletConnectCard from "@/components/wallet-connect-card";
import { getMerchantAllocations, getMerchantRouting } from "@/lib/tokenchain-api";

export default async function MerchantStakingPage() {
  const [routing, allocations] = await Promise.all([getMerchantRouting(50), getMerchantAllocations(40)]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.12em] text-[var(--muted)]">Staking / Merchant Pools</p>
      <h1 className="display mt-3 text-5xl text-[var(--gold-soft)]">Stake Merchant Tokens</h1>
      <p className="mt-4 max-w-3xl text-[var(--muted)]">
        Merchant-token pool dashboard with live routing and latest allocation history.
      </p>

      <section className="mt-7 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <article className="rounded-3xl border border-[var(--line)] bg-[var(--panel)]/70 p-6">
          <h2 className="text-2xl font-semibold text-white">Available Merchant Pools</h2>
          {routing.length > 0 ? (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-[var(--muted)]">
                  <tr>
                    <th className="py-2 pr-4">Token</th>
                    <th className="py-2 pr-4">Stakers</th>
                    <th className="py-2 pr-4">Treasury</th>
                    <th className="py-2 pr-4">Pool Action</th>
                  </tr>
                </thead>
                <tbody>
                  {routing.map((item) => (
                    <tr key={item.denom} className="border-t border-[var(--line)]">
                      <td className="py-2 pr-4 text-white">{item.symbol || item.name || item.denom}</td>
                      <td className="py-2 pr-4 text-white">{item.merchant_incentive_stakers_pct}</td>
                      <td className="py-2 pr-4 text-white">{item.merchant_incentive_treasury_pct}</td>
                      <td className="py-2 pr-4">
                        <button type="button" className="rounded-lg border border-[var(--line)] bg-black/20 px-3 py-1 text-xs">
                          Stake
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 text-sm text-[var(--muted)]">No merchant pools registered yet.</p>
          )}

          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <Link href="/company" className="rounded-xl border border-[var(--line)] bg-black/20 px-4 py-2">
              Open Company Dashboards
            </Link>
            <Link href="/admin/routing" className="rounded-xl border border-[var(--line)] bg-black/20 px-4 py-2">
              Edit Routing in Admin
            </Link>
          </div>
        </article>

        <WalletConnectCard />
      </section>

      <section className="mt-8 rounded-3xl border border-[var(--line)] bg-[var(--panel)]/70 p-6">
        <h2 className="display text-3xl text-[var(--gold-soft)]">Latest Merchant Allocation Writes</h2>
        {allocations.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-[var(--muted)]">
                <tr>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Denom</th>
                  <th className="py-2 pr-4">Stakers</th>
                  <th className="py-2 pr-4">Treasury</th>
                </tr>
              </thead>
              <tbody>
                {allocations.slice(0, 15).map((item) => (
                  <tr key={item.key} className="border-t border-[var(--line)]">
                    <td className="py-2 pr-4 text-white">{item.date}</td>
                    <td className="py-2 pr-4 text-[var(--muted)] break-all">{item.denom}</td>
                    <td className="py-2 pr-4 text-white">{item.stakers_amount}</td>
                    <td className="py-2 pr-4 text-white">{item.treasury_amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-[var(--muted)]">No allocation history yet.</p>
        )}
      </section>
    </main>
  );
}
