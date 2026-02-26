import Link from "next/link";
import { notFound } from "next/navigation";

type TokenSpec = {
  ticker: string;
  title: string;
  summary: string;
};

const TOKENS: Record<string, TokenSpec> = {
  token: {
    ticker: "$TOKEN",
    title: "Network Token",
    summary: "Core gas, fee, and security asset for TokenChain.",
  },
  wheat: {
    ticker: "$WHEAT",
    title: "Merchant Token #1",
    summary: "Pilot merchant reward asset with transparent cap and on-chain flow.",
  },
  stone: {
    ticker: "$STONE",
    title: "Merchant Token #2",
    summary: "Second ecosystem merchant token for local commerce programs.",
  },
  grain: {
    ticker: "$GRAIN",
    title: "Grainback",
    summary: "Community wealth layer aligned to long-term participation.",
  },
};

export default async function TokenPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const token = TOKENS[slug];

  if (!token) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-14">
      <p className="text-sm uppercase tracking-[0.12em] text-[var(--muted)]">Token Profile</p>
      <h1 className="display mt-3 text-5xl text-[var(--gold-soft)]">{token.ticker}</h1>
      <p className="mt-2 text-xl text-white">{token.title}</p>
      <p className="mt-4 max-w-2xl text-[var(--muted)]">{token.summary}</p>

      <section className="mt-8 rounded-2xl border border-[var(--line)] bg-[var(--panel)]/70 p-5">
        <p className="text-sm uppercase tracking-[0.12em] text-[var(--muted)]">Explorer</p>
        <p className="mt-2 text-sm">
          <Link
            href="https://explorer.testnet.tokenchain.tokentap.ca"
            target="_blank"
            rel="noreferrer"
            className="text-[var(--gold)]"
          >
            Open Ping.pub
          </Link>
        </p>
      </section>
    </main>
  );
}
