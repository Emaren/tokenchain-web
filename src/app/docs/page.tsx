import Link from "next/link";

const endpoints = [
  ["Explorer", "https://explorer.tokenchain.tokentap.ca"],
  ["RPC", "https://rpc.tokenchain.tokentap.ca"],
  ["REST", "https://rest.tokenchain.tokentap.ca"],
  ["gRPC", "grpc.tokenchain.tokentap.ca:9090"],
  ["API", "https://api.tokenchain.tokentap.ca"],
];

export default function DocsPage() {
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
      </section>
    </main>
  );
}
