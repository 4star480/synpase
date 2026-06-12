import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { getCryptoPaymentStatus } from "@/lib/payments/checkout";

export async function GET(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orderId = new URL(req.url).searchParams.get("orderId");
  if (!orderId) return NextResponse.json({ error: "Missing orderId" }, { status: 400 });

  const status = await getCryptoPaymentStatus(orderId, userId);
  if (!status) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    ...status,
    payment: status.payment
      ? {
          ...status.payment,
          expiresAt: status.payment.expiresAt?.toISOString() ?? null,
        }
      : null,
  });
}
