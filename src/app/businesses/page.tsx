import Link from "next/link";
import { getMerchantRouting } from "@/lib/tokenchain-api";

export default async function BusinessesPage() {
  const routing = await getMerchantRouting(12);

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-14">
      <h1 className="display text-5xl text-[var(--gold-soft)]">For Businesses</h1>
      <p className="mt-4 max-w-2xl text-[var(--muted)]">
        Launch a token without a dedicated blockchain team: define your token, define supply rules,
        and begin rewards distribution through TokenTap flows.
      </p>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ["1. Name", "Choose ticker, issuer metadata, and brand profile."],
          ["2. Rules", "Set cap, mint policies, and redemption terms."],
          ["3. Launch", "Distribute rewards and monitor performance."],
        ].map(([title, body]) => (
          <article key={title} className="rounded-2xl border border-[var(--line)] bg-[var(--panel)]/70 p-5">
            <p className="font-semibold text-white">{title}</p>
            <p className="mt-2 text-sm text-[var(--muted)]">{body}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--line)] bg-[var(--panel)]/70 p-5">
        <p className="text-sm uppercase tracking-[0.12em] text-[var(--muted)]">Live Routing</p>
        <h2 className="mt-2 text-xl font-semibold text-white">Merchant Incentive Split (Bucket C)</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Default is 50/50. Each token can be configured on-chain using `set-merchant-incentive-routing`.
        </p>

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
                {routing.map((item) => (
                  <tr key={item.denom} className="border-t border-[var(--line)]">
                    <td className="py-2 pr-4 text-white">{item.symbol || item.name || item.denom}</td>
                    <td className="py-2 pr-4 text-white">{item.merchant_incentive_stakers_pct}</td>
                    <td className="py-2 pr-4 text-white">{item.merchant_incentive_treasury_pct}</td>
                    <td className="py-2 pr-4 text-[var(--muted)]">
                      {item.minted_supply}/{item.max_supply}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-[var(--muted)]">Routing data is temporarily unavailable.</p>
        )}
      </section>

      <div className="mt-8 flex gap-3">
        <Link href="https://tokentap.ca" className="rounded-xl bg-[var(--gold)] px-4 py-2.5 text-sm font-semibold text-black">
          Launch Wallet
        </Link>
        <Link href="/docs" className="rounded-xl border border-[var(--line)] bg-black/20 px-4 py-2.5 text-sm">
          Docs
        </Link>
        <Link href="/admin/routing" className="rounded-xl border border-[var(--line)] bg-black/20 px-4 py-2.5 text-sm">
          Admin Console
        </Link>
      </div>
    </main>
  );
}
