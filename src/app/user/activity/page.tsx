import Link from "next/link";
import { getMerchantAllocations } from "@/lib/tokenchain-api";

export default async function UserActivityPage() {
  const allocations = await getMerchantAllocations(30);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.12em] text-[var(--muted)]">User / Activity</p>
      <h1 className="display mt-3 text-5xl text-[var(--gold-soft)]">Recent Network Activity</h1>
      <p className="mt-4 max-w-3xl text-[var(--muted)]">
        Build-mode activity panel that will map to wallet-specific history once full transaction indexing is enabled.
      </p>

      <section className="mt-7 rounded-3xl border border-[var(--line)] bg-[var(--panel)]/70 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-white">Ledger Feed</h2>
          <Link href="/user" className="rounded-xl border border-[var(--line)] bg-black/20 px-4 py-2 text-sm">
            Back to User Home
          </Link>
        </div>

        {allocations.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-[var(--muted)]">
                <tr>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Denom</th>
                  <th className="py-2 pr-4">Activity Score</th>
                  <th className="py-2 pr-4">Bucket C</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map((item) => (
                  <tr key={item.key} className="border-t border-[var(--line)]">
                    <td className="py-2 pr-4 text-white">{item.date}</td>
                    <td className="py-2 pr-4 text-[var(--muted)] break-all">{item.denom}</td>
                    <td className="py-2 pr-4 text-white">{item.activity_score}</td>
                    <td className="py-2 pr-4 text-white">{item.bucket_c_amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-[var(--muted)]">No activity records yet.</p>
        )}
      </section>
    </main>
  );
}
