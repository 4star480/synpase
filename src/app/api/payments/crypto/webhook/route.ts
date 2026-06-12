import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { prisma } from "@/lib/prisma";
import { completeCryptoPayment } from "@/lib/payments/checkout";
import { paymentConfig } from "@/lib/payments/config";

/** NOWPayments IPN webhook — https://documenter.getpostman.com/view/7907941/S1a32n38 */
export async function POST(req: Request) {
  const cfg = paymentConfig();
  const raw = await req.text();
  let payload: Record<string, unknown>;

  try {
    payload = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (cfg.ipnSecret) {
    const sig = req.headers.get("x-nowpayments-sig");
    const sorted = JSON.stringify(payload, Object.keys(payload).sort());
    const expected = createHmac("sha512", cfg.ipnSecret).update(sorted).digest("hex");
    if (sig !== expected) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  const paymentStatus = String(payload.payment_status ?? "");
  const orderId = String(payload.order_id ?? "");
  const invoiceId = String(payload.invoice_id ?? payload.payment_id ?? "");

  if (!orderId) {
    return NextResponse.json({ ok: true, skipped: "no order_id" });
  }

  const paidStatuses = ["finished", "confirmed", "sending"];
  if (!paidStatuses.includes(paymentStatus)) {
    if (paymentStatus === "failed" || paymentStatus === "expired") {
      await prisma.order.updateMany({
        where: { id: orderId, paymentStatus: "AWAITING" },
        data: { paymentStatus: "FAILED" },
      });
      await prisma.payment.updateMany({
        where: { orderId },
        data: { status: paymentStatus === "expired" ? "EXPIRED" : "FAILED" },
      });
    }
    return NextResponse.json({ ok: true, status: paymentStatus });
  }

  const txHash = payload.payin_hash ? String(payload.payin_hash) : undefined;
  const result = await completeCryptoPayment(orderId, txHash);

  if (invoiceId) {
    await prisma.payment.updateMany({
      where: { orderId },
      data: { cryptoInvoiceId: invoiceId },
    });
  }

  return NextResponse.json({ ok: result.ok, error: result.ok ? undefined : result.error });
}
