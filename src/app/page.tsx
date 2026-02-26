import Link from "next/link";

const links = {
  wallet: "https://tokentap.ca",
  explorer: "https://explorer.tokenchain.tokentap.ca",
  api: "https://api.tokenchain.tokentap.ca",
};

const stats = [
  ["Network", "tokenchain-testnet-1"],
  ["Base Denom", "utoken (TOKEN)"],
  ["Explorer", "Bootstrap Host"],
  ["Ops", "IBC + CosmWasm"],
] as const;

const tokens = [
  ["token", "$TOKEN", "Network asset for fees and security"],
  ["wheat", "$WHEAT", "Merchant token #1"],
  ["stone", "$STONE", "Merchant token #2"],
  ["grain", "$GRAIN", "Community wealth rail"],
] as const;

export default function Home() {
  return (
    <div className="min-h-screen grid-haze">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="display text-2xl text-[var(--gold-soft)]">
          TokenChain
        </Link>
        <nav className="hidden gap-6 text-sm text-[var(--muted)] md:flex">
          <Link href="/businesses">For Businesses</Link>
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
