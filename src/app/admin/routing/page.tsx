import Link from "next/link";
import MerchantRoutingAdminForm from "@/components/merchant-routing-admin-form";
import { getMerchantRouting } from "@/lib/tokenchain-api";

export default async function AdminRoutingPage() {
  const routing = await getMerchantRouting(100);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-14">
      <p className="text-sm uppercase tracking-[0.12em] text-[var(--muted)]">TokenChain Admin</p>
      <h1 className="display mt-3 text-5xl text-[var(--gold-soft)]">Merchant Routing Console</h1>
      <p className="mt-4 max-w-3xl text-[var(--muted)]">
        Founder/operator tool for updating per-token Bucket C routing between stakers and merchant treasury.
      </p>

      <div className="mt-8">
        <MerchantRoutingAdminForm items={routing} />
      </div>

      <div className="mt-8 rounded-2xl border border-[var(--line)] bg-[var(--panel)]/70 p-5 text-sm text-[var(--muted)]">
        <p>Need endpoint policy + status?</p>
        <p className="mt-2">
          <Link href="https://api.testnet.tokenchain.tokentap.ca/v1/endpoints" target="_blank" rel="noreferrer" className="text-[var(--gold)]">
            Open API endpoints
          </Link>
        </p>
        <p className="mt-2">
          <Link href="/admin/allocations" className="text-[var(--gold)]">
            Go to allocation console
          </Link>
        </p>
        <p className="mt-2">
          <Link href="/admin/daily-allocation" className="text-[var(--gold)]">
            Go to daily allocation runner
          </Link>
        </p>
      </div>
    </main>
  );
}
