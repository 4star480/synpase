import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { paymentConfig } from "@/lib/payments/config";
import { getCryptoPaymentStatus } from "@/lib/payments/checkout";
import { CryptoPaymentPanel } from "@/components/payments/CryptoPaymentPanel";

export const metadata = { title: "Crypto payment" };

export default async function CryptoPaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const buyerId = await getSessionUserId();
  if (!buyerId) redirect(`/login?redirect=${encodeURIComponent(`/checkout/order/${orderId}/crypto`)}`);

  const status = await getCryptoPaymentStatus(orderId, buyerId);
  if (!status || !status.payment) notFound();

  const cfg = paymentConfig();

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
      <nav className="text-sm text-muted">
        <Link href="/orders" className="hover:text-accent">
          Orders
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Crypto payment</span>
      </nav>

      <h1 className="mt-4 text-2xl font-bold">Complete crypto payment</h1>
      <p className="mt-1 text-sm text-muted">
        {cfg.cryptoMode === "nowpayments"
          ? "Powered by NOWPayments"
          : "Send the exact amount below. Your payment is verified automatically."}
      </p>

      <div className="mt-8">
        <CryptoPaymentPanel
          initial={{
            ...status,
            payment: {
              ...status.payment,
              expiresAt: status.payment.expiresAt?.toISOString() ?? null,
            },
          }}
          allowManualConfirm={cfg.allowSimulateConfirm}
        />
      </div>
    </div>
  );
}
