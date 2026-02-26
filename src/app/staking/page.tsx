import Link from "next/link";
import { getLiveStatus, getMerchantRouting } from "@/lib/tokenchain-api";

export default async function StakingHubPage() {
  const [live, routing] = await Promise.all([getLiveStatus(), getMerchantRouting(25)]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.12em] text-[var(--muted)]">Staking</p>
      <h1 className="display mt-3 text-5xl text-[var(--gold-soft)]">Staking Hub</h1>
      <p className="mt-4 max-w-3xl text-[var(--muted)]">
        Three staking experiences: network security delegation, TOKEN economic staking, and merchant-token pools.
      </p>

      <section className="mt-7 grid gap-4 md:grid-cols-3">
        <StakingCard
          href="/staking/security"
          title="Delegate TOKEN (Security)"
          body="Traditional validator delegation path for chain security and governance alignment."
        />
        <StakingCard
          href="/staking/economic"
          title="Stake TOKEN (Economic)"
          body="Daily accrual pool fed by network fee share and optional subsidy."
        />
        <StakingCard
          href="/staking/merchant"
          title="Stake Merchant Tokens"
          body="Token-specific pools that combine merchant rewards with TOKEN incentive routing."
        />
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <Metric label="Chain" value={live?.rpc_network ?? "n/a"} />
        <Metric label="Height" value={live?.latest_block_height ?? "n/a"} />
        <Metric label="Merchant Pools Detected" value={String(routing.length)} />
      </section>
    </main>
  );
}

function StakingCard({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <Link href={href} className="rounded-2xl border border-[var(--line)] bg-[var(--panel)]/70 p-5 hover:border-[var(--gold)]/40">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">{body}</p>
      <p className="mt-4 text-sm text-[var(--gold)]">Open Page</p>
    </Link>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-[var(--line)] bg-[var(--panel)]/70 p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </article>
  );
}
