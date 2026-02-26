import WalletConnectCard from "@/components/wallet-connect-card";
import { getMerchantAllocations } from "@/lib/tokenchain-api";

export default async function EconomicStakingPage() {
  const allocations = await getMerchantAllocations(30);
  const latest = allocations.slice(0, 5);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.12em] text-[var(--muted)]">Staking / Economic</p>
      <h1 className="display mt-3 text-5xl text-[var(--gold-soft)]">Stake TOKEN (Economic)</h1>
      <p className="mt-4 max-w-3xl text-[var(--muted)]">
        Economic staking pool view for daily accrual and claim flow. This page is build-mode UI over live chain telemetry.
      </p>

      <section className="mt-7 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <article className="rounded-3xl border border-[var(--line)] bg-[var(--panel)]/70 p-6">
          <h2 className="text-2xl font-semibold text-white">Pool Snapshot</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3 text-sm">
            <Panel label="Pool APR (preview)" value="8.4%" />
            <Panel label="Claim Window" value="Anytime" />
            <Panel label="Unbonding" value="Instant" />
          </div>

          <div className="mt-6 rounded-2xl border border-[var(--line)] bg-black/25 p-4 text-sm">
            <p className="text-[var(--muted)]">Daily accrual model</p>
            <p className="mt-2 text-white">
              Pool share = stake amount x duration multiplier. Rewards accrue at Edmonton midnight and can be claimed anytime.
            </p>
            <div className="mt-4 h-2 rounded-full bg-[#1d2b3c]">
              <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-[#e0c679] to-[#a57e2d]" />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <button type="button" className="rounded-xl bg-[var(--gold)] px-4 py-2 font-semibold text-black">
              Stake TOKEN
            </button>
            <button type="button" className="rounded-xl border border-[var(--line)] bg-black/20 px-4 py-2">
              Claim Rewards
            </button>
            <button type="button" className="rounded-xl border border-[var(--line)] bg-black/20 px-4 py-2">
              Unstake TOKEN
            </button>
          </div>
        </article>

        <WalletConnectCard />
      </section>

      <section className="mt-8 rounded-3xl border border-[var(--line)] bg-[var(--panel)]/70 p-6">
        <h2 className="display text-3xl text-[var(--gold-soft)]">Recent Incentive Ledger Events</h2>
        {latest.length > 0 ? (
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
                {latest.map((item) => (
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
          <p className="mt-4 text-sm text-[var(--muted)]">No ledger events yet.</p>
        )}
      </section>
    </main>
  );
}

function Panel({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-black/20 p-3">
      <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-sm text-white">{value}</p>
    </div>
  );
}
