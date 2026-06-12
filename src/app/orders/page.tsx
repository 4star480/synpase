import { Suspense } from "react";
import { redirect } from "next/navigation";
import { OrdersList } from "@/components/OrdersList";
import { getCurrentUser } from "@/lib/session";

export const metadata = { title: "My orders" };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/orders");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">My orders</h1>
      <Suspense
        fallback={
          <div className="mt-8 rounded-xl border border-border-dim bg-surface p-10 text-center text-sm text-muted">
            Loading your orders…
          </div>
        }
      >
        <OrdersList />
      </Suspense>
    </div>
  );
}
