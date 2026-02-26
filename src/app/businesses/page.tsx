import Link from "next/link";

export default function BusinessesPage() {
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

      <div className="mt-8 flex gap-3">
        <Link href="https://tokentap.ca" className="rounded-xl bg-[var(--gold)] px-4 py-2.5 text-sm font-semibold text-black">
          Launch Wallet
        </Link>
        <Link href="/docs" className="rounded-xl border border-[var(--line)] bg-black/20 px-4 py-2.5 text-sm">
          Docs
        </Link>
      </div>
    </main>
  );
}
