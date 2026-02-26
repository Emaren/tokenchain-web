import Link from "next/link";
import WalletConnectCard from "@/components/wallet-connect-card";
import { getLiveStatus } from "@/lib/tokenchain-api";

const validators = [
  { moniker: "tokenchain-testnet-validator", commission: "5%", votingPower: "100%" },
  { moniker: "future-validator-02", commission: "7%", votingPower: "0%" },
  { moniker: "future-validator-03", commission: "8%", votingPower: "0%" },
];

export default async function SecurityStakingPage() {
  const live = await getLiveStatus();

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.12em] text-[var(--muted)]">Staking / Security</p>
      <h1 className="display mt-3 text-5xl text-[var(--gold-soft)]">Delegate TOKEN</h1>
      <p className="mt-4 max-w-3xl text-[var(--muted)]">
        Consensus staking for validator security. Build-mode interface for delegation flow and validator selection.
      </p>

      <section className="mt-7 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <article className="rounded-3xl border border-[var(--line)] bg-[var(--panel)]/70 p-6">
          <h2 className="text-2xl font-semibold text-white">Validator Set</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-[var(--muted)]">
                <tr>
                  <th className="py-2 pr-4">Moniker</th>
                  <th className="py-2 pr-4">Commission</th>
                  <th className="py-2 pr-4">Voting Power</th>
                  <th className="py-2 pr-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {validators.map((v) => (
                  <tr key={v.moniker} className="border-t border-[var(--line)]">
                    <td className="py-2 pr-4 text-white">{v.moniker}</td>
                    <td className="py-2 pr-4 text-white">{v.commission}</td>
                    <td className="py-2 pr-4 text-white">{v.votingPower}</td>
                    <td className="py-2 pr-4">
                      <button type="button" className="rounded-lg border border-[var(--line)] bg-black/20 px-3 py-1 text-xs">
                        Delegate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <button type="button" className="rounded-xl bg-[var(--gold)] px-4 py-2 font-semibold text-black">
              Preview Delegate Tx
            </button>
            <Link href="https://rpc.testnet.tokenchain.tokentap.ca/status" target="_blank" rel="noreferrer" className="rounded-xl border border-[var(--line)] bg-black/20 px-4 py-2">
              Validator RPC Status
            </Link>
          </div>
        </article>

        <div className="space-y-4">
          <WalletConnectCard />
          <article className="rounded-2xl border border-[var(--line)] bg-[var(--panel)]/70 p-5">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Network</p>
            <p className="mt-2 text-sm text-white">{live?.rpc_network ?? "n/a"}</p>
            <p className="mt-2 text-sm text-white">Height {live?.latest_block_height ?? "n/a"}</p>
            <p className="mt-2 text-sm text-white">Sync: {live ? (live.catching_up ? "syncing" : "online") : "unknown"}</p>
          </article>
        </div>
      </section>
    </main>
  );
}
