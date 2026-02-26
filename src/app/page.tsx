import Link from "next/link";
import {
  API_BASE,
  getIBCChannels,
  getLiveStatus,
  getMerchantAllocations,
  getMerchantRouting,
  getRelayerStatus,
} from "@/lib/tokenchain-api";

const links = {
  wallet: "https://tokentap.ca",
  explorer: "https://explorer.tokenchain.tokentap.ca",
  api: API_BASE,
  faucet: "https://faucet.testnet.tokenchain.tokentap.ca",
} as const;

const tokens = [
  ["token", "$TOKEN", "Network asset for fees and security"],
  ["wheat", "$WHEAT", "Merchant token #1"],
  ["stone", "$STONE", "Merchant token #2"],
  ["grain", "$GRAIN", "Community wealth rail"],
] as const;

export default async function Home() {
  const live = await getLiveStatus();
  const routing = await getMerchantRouting(4);
  const allocations = await getMerchantAllocations(5);
  const ibcChannels = await getIBCChannels(10, "transfer");
  const relayer = await getRelayerStatus();
  const stats = [
    ["Network", live?.rpc_network ?? "tokenchain-testnet-1"],
    ["Height", live?.latest_block_height ?? "n/a"],
    ["Sync", live ? (live.catching_up ? "Syncing" : "Online") : "Unknown"],
    ["Base Denom", "utoken (TOKEN)"],
  ] as const;

  return (
    <div className="min-h-screen grid-haze">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="display text-2xl text-[var(--gold-soft)]">
          TokenChain
        </Link>
        <nav className="hidden gap-6 text-sm text-[var(--muted)] xl:flex">
          <Link href="/businesses">For Businesses</Link>
          <Link href="/company">Company</Link>
          <Link href="/staking">Staking</Link>
          <Link href="/user">User</Link>
          <Link href="/admin">Admin</Link>
          <Link href="/docs">Docs</Link>
          <Link href={links.explorer} target="_blank" rel="noreferrer">
            Explorer
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-16">
        <section className="rounded-3xl border border-[var(--line)] bg-[var(--panel)]/70 p-8 backdrop-blur md:p-12">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            Built from Alberta. Built for anywhere.
          </p>
          <h1 className="display mt-4 max-w-3xl text-4xl leading-tight text-[var(--gold-soft)] md:text-6xl">
            Community commerce infrastructure for small-business tokens.
          </h1>
          <p className="mt-4 max-w-3xl text-base text-[var(--muted)] md:text-lg">
            TokenChain is a Cosmos chain for loyalty, rewards, and auditable local value flows.
            TokenTap handles user UX while TokenChain handles settlement and transparency.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={links.wallet}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-[var(--gold)] px-4 py-2.5 text-sm font-semibold text-black"
            >
              Launch Wallet
            </Link>
            <Link
              href="/businesses"
              className="rounded-xl border border-[var(--line)] bg-black/20 px-4 py-2.5 text-sm"
            >
              Launch a Token
            </Link>
            <Link
              href={links.explorer}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-[var(--line)] bg-black/20 px-4 py-2.5 text-sm"
            >
              View Explorer
            </Link>
            <Link
              href={links.faucet}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-[var(--line)] bg-black/20 px-4 py-2.5 text-sm"
            >
              Testnet Faucet
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          {stats.map(([k, v]) => (
            <article key={k} className="rounded-2xl border border-[var(--line)] bg-[var(--panel)]/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{k}</p>
              <p className="mt-2 text-sm font-semibold text-white">{v}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--line)] bg-[var(--panel)]/70 p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="display text-3xl text-[var(--gold-soft)]">Merchant Incentive Routing</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Live per-token Bucket C split between stakers and merchant treasury.
              </p>
            </div>
            <Link
              href={`${links.api}/v1/loyalty/merchant-routing`}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-[var(--line)] bg-black/20 px-3 py-2 text-xs text-[var(--muted)]"
            >
              Raw API
            </Link>
          </div>

          {routing.length > 0 ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {routing.map((item) => (
                <article key={item.denom} className="rounded-2xl border border-[var(--line)] bg-black/20 p-5">
                  <p className="text-lg font-semibold text-[var(--gold)]">
                    {item.symbol || item.name || item.denom}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted)] break-all">{item.denom}</p>
                  <p className="mt-3 text-sm text-white">
                    Stakers: <strong>{item.merchant_incentive_stakers_pct}</strong>
                  </p>
                  <p className="mt-1 text-sm text-white">
                    Treasury: <strong>{item.merchant_incentive_treasury_pct}</strong>
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm text-[var(--muted)]">Routing feed is temporarily unavailable.</p>
          )}
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--line)] bg-[var(--panel)]/70 p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="display text-3xl text-[var(--gold-soft)]">Latest Merchant Allocations</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                On-chain daily Bucket C ledger records used for merchant incentive distribution.
              </p>
            </div>
            <Link
              href={`${links.api}/v1/loyalty/merchant-allocations`}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-[var(--line)] bg-black/20 px-3 py-2 text-xs text-[var(--muted)]"
            >
              Raw API
            </Link>
          </div>

          {allocations.length > 0 ? (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-[var(--muted)]">
                  <tr>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Denom</th>
                    <th className="py-2 pr-4">Bucket C</th>
                    <th className="py-2 pr-4">Stakers</th>
                    <th className="py-2 pr-4">Treasury</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map((item) => (
                    <tr key={item.key} className="border-t border-[var(--line)]">
                      <td className="py-2 pr-4 text-white">{item.date}</td>
                      <td className="py-2 pr-4 text-[var(--muted)] break-all">{item.denom}</td>
                      <td className="py-2 pr-4 text-white">{item.bucket_c_amount}</td>
                      <td className="py-2 pr-4 text-white">{item.stakers_amount}</td>
                      <td className="py-2 pr-4 text-white">{item.treasury_amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-5 text-sm text-[var(--muted)]">Allocation ledger feed is temporarily unavailable.</p>
          )}
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--line)] bg-[var(--panel)]/70 p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="display text-3xl text-[var(--gold-soft)]">IBC + Relayer Status</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Day-1 interchain readiness for transfer channels and relay service health.
              </p>
            </div>
            <Link
              href={`${links.api}/v1/ibc/relayer-status`}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-[var(--line)] bg-black/20 px-3 py-2 text-xs text-[var(--muted)]"
            >
              Raw API
            </Link>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-[var(--line)] bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Relayer Service</p>
              <p className="mt-2 text-sm font-semibold text-white">{relayer?.service_active ?? "unknown"}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{relayer?.service_enabled ?? "unknown"}</p>
            </article>
            <article className="rounded-2xl border border-[var(--line)] bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Hermes Health</p>
              <p className="mt-2 text-sm font-semibold text-white">{relayer?.hermes_health_ok ? "ok" : "not ready"}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{relayer?.hermes_config_exists ? "config found" : "missing config"}</p>
            </article>
            <article className="rounded-2xl border border-[var(--line)] bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Transfer Channels</p>
              <p className="mt-2 text-sm font-semibold text-white">{ibcChannels.length}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">port: transfer</p>
            </article>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--line)] bg-[var(--panel)]/70 p-8">
          <h2 className="display text-3xl text-[var(--gold-soft)]">Token Ecosystem</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {tokens.map(([slug, ticker, desc]) => (
              <Link
                href={`/tokens/${slug}`}
                key={ticker}
                className="rounded-2xl border border-[var(--line)] bg-black/20 p-5 transition hover:border-[var(--gold)]/50"
              >
                <p className="text-lg font-semibold text-[var(--gold)]">{ticker}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ["Mint", "Create branded merchant tokens with clear supply rules."],
            ["Reward", "Distribute on every purchase, referral, or campaign."],
            ["Spend", "Redeem locally with auditable transfer history."],
          ].map(([title, body]) => (
            <article key={title} className="rounded-2xl border border-[var(--line)] bg-[var(--panel)]/70 p-5">
              <p className="display text-2xl text-[var(--gold-soft)]">{title}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">{body}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--line)] bg-[var(--panel)]/70 p-8">
          <h2 className="display text-3xl text-[var(--gold-soft)]">Build-Mode Panels</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            New additive UI surfaces for operator, company, staking, and user flows.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Link href="/admin" className="rounded-xl border border-[var(--line)] bg-black/20 p-4 text-sm hover:border-[var(--gold)]/40">
              Admin Hub
            </Link>
            <Link href="/admin/mock-alpha" className="rounded-xl border border-[var(--line)] bg-black/20 p-4 text-sm hover:border-[var(--gold)]/40">
              Admin Mock (Alt)
            </Link>
            <Link href="/company" className="rounded-xl border border-[var(--line)] bg-black/20 p-4 text-sm hover:border-[var(--gold)]/40">
              Company Dashboards
            </Link>
            <Link href="/staking" className="rounded-xl border border-[var(--line)] bg-black/20 p-4 text-sm hover:border-[var(--gold)]/40">
              Staking Suite
            </Link>
            <Link href="/user" className="rounded-xl border border-[var(--line)] bg-black/20 p-4 text-sm hover:border-[var(--gold)]/40">
              User Dashboard
            </Link>
            <Link href="/docs" className="rounded-xl border border-[var(--line)] bg-black/20 p-4 text-sm hover:border-[var(--gold)]/40">
              Technical Docs
            </Link>
          </div>
        </section>

        <footer className="mt-12 rounded-2xl border border-[var(--line)] bg-[var(--panel)]/70 p-5 text-sm text-[var(--muted)]">
          <p>No hype. Real endpoints. Verifiable supply.</p>
          <p className="mt-2">
            API: <Link href={links.api}>{links.api}</Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
