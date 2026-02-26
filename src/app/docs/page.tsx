import Link from "next/link";
import { getIBCChannels, getRelayerStatus } from "@/lib/tokenchain-api";

const endpoints = [
  ["Explorer (bootstrap)", "https://explorer.testnet.tokenchain.tokentap.ca"],
  ["RPC", "https://rpc.testnet.tokenchain.tokentap.ca"],
  ["REST", "https://rest.testnet.tokenchain.tokentap.ca"],
  ["gRPC", "grpc.testnet.tokenchain.tokentap.ca:443"],
  ["API", "https://api.testnet.tokenchain.tokentap.ca"],
  ["Faucet", "https://faucet.testnet.tokenchain.tokentap.ca"],
  ["Seed", "seed.testnet.tokenchain.tokentap.ca:26656"],
];

export default async function DocsPage() {
  const relayer = await getRelayerStatus();
  const channels = await getIBCChannels(20, "transfer");

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-14">
      <h1 className="display text-5xl text-[var(--gold-soft)]">Docs</h1>
      <p className="mt-4 text-[var(--muted)]">
        Day-1 network information and endpoint index.
      </p>

      <section className="mt-8 space-y-4">
        <article className="rounded-2xl border border-[var(--line)] bg-[var(--panel)]/70 p-5">
          <p className="text-sm uppercase tracking-[0.12em] text-[var(--muted)]">Network</p>
          <p className="mt-2">Chain ID: <strong>tokenchain-testnet-1</strong></p>
          <p className="mt-1">Bech32 Prefix: <strong>tokenchain</strong></p>
          <p className="mt-1">Base Denom: <strong>utoken</strong> (display <strong>TOKEN</strong>)</p>
        </article>

        <article className="rounded-2xl border border-[var(--line)] bg-[var(--panel)]/70 p-5">
          <p className="text-sm uppercase tracking-[0.12em] text-[var(--muted)]">Endpoints</p>
          <ul className="mt-3 space-y-2 text-sm">
            {endpoints.map(([label, value]) => (
              <li key={label}>
                <span className="text-white">{label}:</span>{" "}
                {value.startsWith("http") ? (
                  <Link href={value} target="_blank" rel="noreferrer" className="text-[var(--gold)]">
                    {value}
                  </Link>
                ) : (
                  <span className="text-[var(--gold)]">{value}</span>
                )}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-[var(--line)] bg-[var(--panel)]/70 p-5">
          <p className="text-sm uppercase tracking-[0.12em] text-[var(--muted)]">Indexer APIs</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <span className="text-white">Network status:</span>{" "}
              <Link href="https://api.testnet.tokenchain.tokentap.ca/v1/status" target="_blank" rel="noreferrer" className="text-[var(--gold)]">
                /v1/status
              </Link>
            </li>
            <li>
              <span className="text-white">Merchant routing:</span>{" "}
              <Link href="https://api.testnet.tokenchain.tokentap.ca/v1/loyalty/merchant-routing" target="_blank" rel="noreferrer" className="text-[var(--gold)]">
                /v1/loyalty/merchant-routing
              </Link>
            </li>
            <li>
              <span className="text-white">Merchant allocations:</span>{" "}
              <Link href="https://api.testnet.tokenchain.tokentap.ca/v1/loyalty/merchant-allocations" target="_blank" rel="noreferrer" className="text-[var(--gold)]">
                /v1/loyalty/merchant-allocations
              </Link>
            </li>
            <li>
              <span className="text-white">IBC channels:</span>{" "}
              <Link href="https://api.testnet.tokenchain.tokentap.ca/v1/ibc/channels?port_id=transfer" target="_blank" rel="noreferrer" className="text-[var(--gold)]">
                /v1/ibc/channels
              </Link>
            </li>
            <li>
              <span className="text-white">Relayer status:</span>{" "}
              <Link href="https://api.testnet.tokenchain.tokentap.ca/v1/ibc/relayer-status" target="_blank" rel="noreferrer" className="text-[var(--gold)]">
                /v1/ibc/relayer-status
              </Link>
            </li>
            <li>
              <span className="text-white">Admin home:</span>{" "}
              <Link href="/admin" className="text-[var(--gold)]">
                /admin
              </Link>
            </li>
            <li>
              <span className="text-white">Admin mock (alt):</span>{" "}
              <Link href="/admin/mock-alpha" className="text-[var(--gold)]">
                /admin/mock-alpha
              </Link>
            </li>
            <li>
              <span className="text-white">Admin routing update:</span>{" "}
              <Link href="/admin/routing" className="text-[var(--gold)]">
                /admin/routing
              </Link>
            </li>
            <li>
              <span className="text-white">Admin allocation record:</span>{" "}
              <Link href="/admin/allocations" className="text-[var(--gold)]">
                /admin/allocations
              </Link>
            </li>
            <li>
              <span className="text-white">Company dashboards:</span>{" "}
              <Link href="/company" className="text-[var(--gold)]">
                /company
              </Link>
            </li>
            <li>
              <span className="text-white">Staking suite:</span>{" "}
              <Link href="/staking" className="text-[var(--gold)]">
                /staking
              </Link>
            </li>
            <li>
              <span className="text-white">User dashboard:</span>{" "}
              <Link href="/user" className="text-[var(--gold)]">
                /user
              </Link>
            </li>
            <li>
              <span className="text-white">Admin daily allocation batch:</span>{" "}
              <Link href="/admin/daily-allocation" className="text-[var(--gold)]">
                /admin/daily-allocation
              </Link>
            </li>
          </ul>
        </article>

        <article className="rounded-2xl border border-[var(--line)] bg-[var(--panel)]/70 p-5">
          <p className="text-sm uppercase tracking-[0.12em] text-[var(--muted)]">IBC Readiness</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Live relayer and transfer-channel visibility from the indexer API.
          </p>

          <div className="mt-3 space-y-1 text-sm">
            <p>
              <span className="text-white">Service:</span>{" "}
              <strong>{relayer?.service_active ?? "unknown"}</strong>{" "}
              <span className="text-[var(--muted)]">({relayer?.service_enabled ?? "unknown"})</span>
            </p>
            <p>
              <span className="text-white">Hermes health:</span>{" "}
              <strong>{relayer?.hermes_health_ok ? "ok" : "not ready"}</strong>
            </p>
            <p>
              <span className="text-white">Transfer channels:</span>{" "}
              <strong>{channels.length}</strong>
            </p>
          </div>

          {channels.length > 0 ? (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-xs">
                <thead className="text-[var(--muted)]">
                  <tr>
                    <th className="py-2 pr-4">Channel</th>
                    <th className="py-2 pr-4">State</th>
                    <th className="py-2 pr-4">Counterparty</th>
                    <th className="py-2 pr-4">Connection</th>
                  </tr>
                </thead>
                <tbody>
                  {channels.map((c) => (
                    <tr key={`${c.port_id}/${c.channel_id}`} className="border-t border-[var(--line)]">
                      <td className="py-2 pr-4 text-white">{c.port_id}/{c.channel_id}</td>
                      <td className="py-2 pr-4 text-white">{c.state}</td>
                      <td className="py-2 pr-4 text-[var(--muted)]">{c.counterparty_port_id}/{c.counterparty_channel_id || "-"}</td>
                      <td className="py-2 pr-4 text-[var(--muted)]">{c.connection_id || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-4 text-sm text-[var(--muted)]">
              No transfer channels opened yet.
            </p>
          )}
        </article>

        <article className="rounded-2xl border border-[var(--line)] bg-[var(--panel)]/70 p-5">
          <p className="text-sm uppercase tracking-[0.12em] text-[var(--muted)]">Faucet Request</p>
          <pre className="mt-3 overflow-x-auto rounded-xl border border-[var(--line)] bg-black/30 p-3 text-xs text-[var(--gold)]">
{`curl -X POST https://faucet.testnet.tokenchain.tokentap.ca/v1/faucet/request \\
  -H 'content-type: application/json' \\
  -d '{"address":"tokenchain1..."}'`}
          </pre>
        </article>
      </section>
    </main>
  );
}
