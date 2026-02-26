import Link from "next/link";
import { notFound } from "next/navigation";
import { getMerchantAllocations, getMerchantRouting } from "@/lib/tokenchain-api";

const COMPANY_META = {
  "prairie-wheat-co": {
    name: "Prairie Wheat Co.",
    tokenSymbol: "WHEAT",
    tagline: "Local grain rewards, transparent token policy, and daily incentive settlements.",
  },
  "granite-cafe": {
    name: "Granite Cafe",
    tokenSymbol: "STONE",
    tagline: "Coffee loyalty with instant digital rewards and clear redemption math.",
  },
  "grainback-network": {
    name: "Grainback Network",
    tokenSymbol: "GRAIN",
    tagline: "Community participation token strategy with on-chain accountability.",
  },
} as const;

type CompanySlug = keyof typeof COMPANY_META;

export default async function CompanyDashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = COMPANY_META[slug as CompanySlug];
  if (!company) notFound();

  const [routing, allocations] = await Promise.all([
    getMerchantRouting(100),
    getMerchantAllocations(50),
  ]);

  const tokenInfo = routing.find((item) => {
    const symbol = (item.symbol || "").toUpperCase();
    return symbol === company.tokenSymbol;
  });

  const tokenAllocations = allocations.filter((item) => {
    if (tokenInfo) return item.denom === tokenInfo.denom;
    return item.denom.toUpperCase().includes(company.tokenSymbol);
  });

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.12em] text-[var(--muted)]">Company Dashboard</p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="display text-5xl text-[var(--gold-soft)]">{company.name}</h1>
          <p className="mt-2 max-w-3xl text-[var(--muted)]">{company.tagline}</p>
        </div>
        <Link href="/company" className="rounded-xl border border-[var(--line)] bg-black/20 px-4 py-2 text-sm">
          All Companies
        </Link>
      </div>

      <section className="mt-7 grid gap-4 md:grid-cols-4">
        <Card label="Token" value={`$${company.tokenSymbol}`} />
        <Card label="Verified" value={tokenInfo?.verified ? "yes" : "pending"} />
        <Card label="Minted" value={tokenInfo ? tokenInfo.minted_supply : "n/a"} />
        <Card label="Cap" value={tokenInfo ? tokenInfo.max_supply : "n/a"} />
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <article className="rounded-3xl border border-[var(--line)] bg-[var(--panel)]/70 p-6">
          <h2 className="display text-3xl text-[var(--gold-soft)]">Campaign Controls</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <InputCard title="Mint Budget" value={tokenInfo ? `${tokenInfo.max_supply} max` : "set max supply"} />
            <InputCard title="Reward Rule" value="1 token per $10 spend" />
            <InputCard title="Referral Bonus" value="25 tokens per new customer" />
            <InputCard title="Redemption Window" value="7 days rolling" />
          </div>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <button type="button" className="rounded-xl bg-[var(--gold)] px-4 py-2 font-semibold text-black">
              Save Campaign
            </button>
            <button type="button" className="rounded-xl border border-[var(--line)] bg-black/20 px-4 py-2">
              Queue Mint Request
            </button>
            <button type="button" className="rounded-xl border border-[var(--line)] bg-black/20 px-4 py-2">
              Export Ledger CSV
            </button>
          </div>
        </article>

        <article className="rounded-3xl border border-[var(--line)] bg-[var(--panel)]/70 p-6">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Incentive Routing</p>
          <p className="mt-3 text-sm text-white">
            Stakers: <strong>{tokenInfo?.merchant_incentive_stakers_pct ?? "n/a"}</strong>
          </p>
          <p className="mt-2 text-sm text-white">
            Treasury: <strong>{tokenInfo?.merchant_incentive_treasury_pct ?? "n/a"}</strong>
          </p>
          <p className="mt-3 text-xs text-[var(--muted)] break-all">Denom: {tokenInfo?.denom ?? "not set"}</p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link href="/admin/routing" className="rounded-xl border border-[var(--line)] bg-black/20 px-3 py-2">
              Edit in Admin Routing
            </Link>
            <Link href="/admin/allocations" className="rounded-xl border border-[var(--line)] bg-black/20 px-3 py-2">
              Write Allocation Record
            </Link>
          </div>
        </article>
      </section>

      <section className="mt-8 rounded-3xl border border-[var(--line)] bg-[var(--panel)]/70 p-6">
        <h2 className="display text-3xl text-[var(--gold-soft)]">Recent Allocation Activity</h2>
        {tokenAllocations.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-[var(--muted)]">
                <tr>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Activity Score</th>
                  <th className="py-2 pr-4">Bucket C</th>
                  <th className="py-2 pr-4">Stakers</th>
                  <th className="py-2 pr-4">Treasury</th>
                </tr>
              </thead>
              <tbody>
                {tokenAllocations.slice(0, 12).map((item) => (
                  <tr key={item.key} className="border-t border-[var(--line)]">
                    <td className="py-2 pr-4 text-white">{item.date}</td>
                    <td className="py-2 pr-4 text-white">{item.activity_score}</td>
                    <td className="py-2 pr-4 text-white">{item.bucket_c_amount}</td>
                    <td className="py-2 pr-4 text-white">{item.stakers_amount}</td>
                    <td className="py-2 pr-4 text-white">{item.treasury_amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-[var(--muted)]">No token-specific allocations yet. Run the daily allocation batch first.</p>
        )}
      </section>
    </main>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-[var(--line)] bg-[var(--panel)]/70 p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </article>
  );
}

function InputCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">{title}</p>
      <p className="mt-2 text-sm text-white">{value}</p>
    </div>
  );
}
