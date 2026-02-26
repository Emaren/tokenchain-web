import Link from "next/link";
import { getMerchantRouting } from "@/lib/tokenchain-api";

const companies = [
  {
    slug: "prairie-wheat-co",
    name: "Prairie Wheat Co.",
    token: "$WHEAT",
    summary: "Farm-to-main-street rewards with harvest-season campaigns.",
  },
  {
    slug: "granite-cafe",
    name: "Granite Cafe",
    token: "$STONE",
    summary: "Daily coffee loyalty and referral rewards with flexible redemption.",
  },
  {
    slug: "grainback-network",
    name: "Grainback Network",
    token: "$GRAIN",
    summary: "Community participation layer tied to shared value loops.",
  },
];

export default async function CompanyDashboardIndexPage() {
  const routing = await getMerchantRouting(25);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.12em] text-[var(--muted)]">Company Dashboards</p>
      <h1 className="display mt-3 text-5xl text-[var(--gold-soft)]">Business Console Previews</h1>
      <p className="mt-4 max-w-3xl text-[var(--muted)]">
        Build-mode pages for merchant operators. These are additive previews so we can compare UI directions before final trim.
      </p>

      <section className="mt-7 grid gap-4 md:grid-cols-3">
        {companies.map((company) => (
          <Link
            key={company.slug}
            href={`/company/${company.slug}`}
            className="rounded-2xl border border-[var(--line)] bg-[var(--panel)]/70 p-5 hover:border-[var(--gold)]/40"
          >
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{company.token}</p>
            <h2 className="mt-2 text-xl font-semibold text-white">{company.name}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{company.summary}</p>
            <p className="mt-4 text-sm text-[var(--gold)]">Open Dashboard</p>
          </Link>
        ))}
      </section>

      <section className="mt-8 rounded-3xl border border-[var(--line)] bg-[var(--panel)]/70 p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="display text-3xl text-[var(--gold-soft)]">Live Routing Snapshot</h2>
          <Link
            href="https://api.testnet.tokenchain.tokentap.ca/v1/loyalty/merchant-routing"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-[var(--line)] bg-black/20 px-4 py-2 text-xs"
          >
            Raw API
          </Link>
        </div>
        {routing.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-[var(--muted)]">
                <tr>
                  <th className="py-2 pr-4">Token</th>
                  <th className="py-2 pr-4">Stakers</th>
                  <th className="py-2 pr-4">Treasury</th>
                  <th className="py-2 pr-4">Supply</th>
                </tr>
              </thead>
              <tbody>
                {routing.slice(0, 8).map((item) => (
                  <tr key={item.denom} className="border-t border-[var(--line)]">
                    <td className="py-2 pr-4 text-white">{item.symbol || item.name || item.denom}</td>
                    <td className="py-2 pr-4 text-white">{item.merchant_incentive_stakers_pct}</td>
                    <td className="py-2 pr-4 text-white">{item.merchant_incentive_treasury_pct}</td>
                    <td className="py-2 pr-4 text-[var(--muted)]">{item.minted_supply}/{item.max_supply}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-[var(--muted)]">Routing feed unavailable.</p>
        )}
      </section>
    </main>
  );
}
