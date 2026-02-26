import Link from "next/link";

const usageBars = [
  ["CPU", 18, "#7eb6ff"],
  ["RAM", 61, "#e9b26a"],
  ["Disk", 27, "#86d0a3"],
] as const;

const tokenRows = [
  {
    name: "WHEAT",
    split: "70% stakers / 30% treasury",
    rewards: "500 WHEAT + 6.5 TOKEN",
    treasury: "2.8 TOKEN",
  },
  {
    name: "STONE",
    split: "60% stakers / 40% treasury",
    rewards: "380 STONE + 4.2 TOKEN",
    treasury: "3.1 TOKEN",
  },
  {
    name: "GRAIN",
    split: "65% stakers / 35% treasury",
    rewards: "250 GRAIN + 3.8 TOKEN",
    treasury: "2.0 TOKEN",
  },
];

export default function AdminMockAlphaPage() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10">
      <div className="rounded-3xl border border-[var(--line)] bg-[linear-gradient(180deg,#11192e_0%,#0f1726_100%)] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
          <div>
            <p className="display text-4xl text-[var(--gold-soft)]">TokenTap Admin</p>
            <p className="mt-1 text-sm text-[var(--muted)]">Alternate mockup preview (non-destructive build-mode page)</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-300">
              Node: Online
            </span>
            <Link href="/admin" className="rounded-full border border-[var(--line)] px-3 py-1 text-[var(--muted)]">
              Back to Admin Hub
            </Link>
          </div>
        </header>

        <nav className="mt-4 flex flex-wrap gap-2 text-sm">
          {[
            "Dashboard",
            "Users",
            "Tokens",
            "Staking Pools",
            "Transactions",
            "Settings",
            "Logs",
            "System Monitor",
          ].map((item, i) => (
            <button
              key={item}
              type="button"
              className={`rounded-lg border px-3 py-2 ${
                i === 0
                  ? "border-[var(--gold)]/40 bg-[var(--gold)]/15 text-[var(--gold-soft)]"
                  : "border-[var(--line)] bg-black/20 text-[var(--muted)]"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <section className="mt-6 grid gap-4 xl:grid-cols-[2fr_1fr]">
          <article className="rounded-2xl border border-[var(--line)] bg-black/20 p-5">
            <p className="text-sm uppercase tracking-[0.14em] text-[var(--muted)]">Fee Distribution Settings</p>
            <div className="mt-4 space-y-4 text-sm">
              <SliderRow label="Validators" value={70} badge="70%" />
              <SliderRow label="TOKEN Stakers" value={20} badge="20%" />
              <SliderRow label="Merchant Incentive Pool" value={10} badge="10%" />
              <SliderRow label="Treasury Reserve" value={0} badge="0%" />
            </div>
            <button
              type="button"
              className="mt-5 rounded-xl bg-[var(--gold)] px-4 py-2 text-sm font-semibold text-black"
            >
              Apply Changes
            </button>
          </article>

          <div className="space-y-4">
            <article className="rounded-2xl border border-[var(--line)] bg-black/20 p-5">
              <p className="text-sm uppercase tracking-[0.14em] text-[var(--muted)]">Server Usage</p>
              <div className="mt-4 space-y-3 text-sm">
                {usageBars.map(([label, value, color]) => (
                  <div key={label}>
                    <div className="flex justify-between">
                      <span>{label}</span>
                      <span>{value}%</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-[#1c2a3a]">
                      <div className="h-2 rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-[var(--line)] bg-black/20 p-5">
              <p className="text-sm uppercase tracking-[0.14em] text-[var(--muted)]">Explorer</p>
              <div className="mt-3 space-y-2">
                <Link
                  href="https://explorer.testnet.tokenchain.tokentap.ca"
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl border border-[var(--line)] bg-black/25 px-3 py-2 text-sm"
                >
                  Open Ping.pub target
                </Link>
                <Link
                  href="https://api.testnet.tokenchain.tokentap.ca/v1/ibc/channels?port_id=transfer"
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl border border-[var(--line)] bg-black/25 px-3 py-2 text-sm"
                >
                  View IBC Channels API
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-[var(--line)] bg-black/20 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm uppercase tracking-[0.14em] text-[var(--muted)]">Merchant Incentive Allocation</p>
            <button type="button" className="rounded-xl border border-[var(--line)] bg-black/25 px-3 py-1.5 text-sm">
              Update
            </button>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-3 text-sm">
            <InfoPill label="Metric" value="Weighted Activity Score" />
            <InfoPill label="Max Share Per Token" value="50%" />
            <InfoPill label="Payout Time" value="12:00 AM Edmonton" />
          </div>
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-[2fr_1fr]">
          <article className="rounded-2xl border border-[var(--line)] bg-black/20 p-5">
            <p className="text-sm uppercase tracking-[0.14em] text-[var(--muted)]">Token Management</p>
            <div className="mt-4 space-y-3">
              {tokenRows.map((row) => (
                <div key={row.name} className="rounded-xl border border-[var(--line)] bg-[#0f1a2c] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-lg font-semibold text-[var(--gold)]">{row.name} Token</p>
                    <button type="button" className="rounded-lg border border-[var(--line)] bg-black/20 px-3 py-1 text-sm">
                      Edit Token
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-white">Allocation: {row.split}</p>
                  <p className="mt-1 text-sm text-white">Staker Rewards: {row.rewards}</p>
                  <p className="mt-1 text-sm text-white">Treasury Payout: {row.treasury}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-[var(--line)] bg-black/20 p-5">
            <p className="text-sm uppercase tracking-[0.14em] text-[var(--muted)]">System Controls</p>
            <div className="mt-4 space-y-2 text-sm">
              {[
                "Restart Node",
                "Run Chain Upgrade",
                "Flush Mempool",
                "Sync with Explorer",
              ].map((action) => (
                <button key={action} type="button" className="w-full rounded-lg border border-[var(--line)] bg-black/25 px-3 py-2 text-left">
                  {action}
                </button>
              ))}
              <button type="button" className="w-full rounded-lg border border-red-500/40 bg-red-900/20 px-3 py-2 text-left text-red-300">
                Emergency Halt
              </button>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

function SliderRow({ label, value, badge }: { label: string; value: number; badge: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span>{label}</span>
        <span className="rounded-md border border-[var(--line)] bg-black/30 px-2 py-0.5 text-xs">{badge}</span>
      </div>
      <div className="h-2 rounded-full bg-[#1d2b3c]">
        <div className="h-2 rounded-full bg-gradient-to-r from-[#79a9f5] to-[#4c6fac]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-black/25 p-3">
      <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-sm text-white">{value}</p>
    </div>
  );
}
