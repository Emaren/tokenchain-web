import Link from "next/link";
import MerchantAllocationAdminForm from "@/components/merchant-allocation-admin-form";
import { getMerchantAllocations, getMerchantRouting } from "@/lib/tokenchain-api";

export default async function AdminAllocationsPage() {
  const routing = await getMerchantRouting(100);
  const allocations = await getMerchantAllocations(25);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-14">
      <p className="text-sm uppercase tracking-[0.12em] text-[var(--muted)]">TokenChain Admin</p>
      <h1 className="display mt-3 text-5xl text-[var(--gold-soft)]">Merchant Allocation Console</h1>
      <p className="mt-4 max-w-3xl text-[var(--muted)]">
        Operator tool for writing on-chain daily Bucket C allocation records by date and token denom.
      </p>

      <div className="mt-8">
        <MerchantAllocationAdminForm items={routing} />
      </div>

      <div className="mt-8 rounded-2xl border border-[var(--line)] bg-[var(--panel)]/70 p-5">
        <p className="text-sm uppercase tracking-[0.12em] text-[var(--muted)]">Latest Ledger Records</p>
        {allocations.length > 0 ? (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-[var(--muted)]">
                <tr>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Denom</th>
                  <th className="py-2 pr-4">Score</th>
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
          <p className="mt-3 text-sm text-[var(--muted)]">No allocation records yet.</p>
        )}
      </div>

      <div className="mt-8 rounded-2xl border border-[var(--line)] bg-[var(--panel)]/70 p-5 text-sm text-[var(--muted)]">
        <p>Need endpoint policy + status?</p>
        <p className="mt-2">
          <Link href="https://api.testnet.tokenchain.tokentap.ca/v1/endpoints" target="_blank" rel="noreferrer" className="text-[var(--gold)]">
            Open API endpoints
          </Link>
        </p>
      </div>
    </main>
  );
}
