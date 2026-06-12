import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { completeCryptoPayment } from "@/lib/payments/checkout";
import { paymentConfig } from "@/lib/payments/config";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  if (!paymentConfig().allowSimulateConfirm) {
    return NextResponse.json({ error: "Not available" }, { status: 403 });
  }

  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as { orderId?: string };
  if (!body.orderId) return NextResponse.json({ error: "Missing orderId" }, { status: 400 });

  const order = await prisma.order.findUnique({
    where: { id: body.orderId },
    select: { buyerId: true, payment: { select: { processorRef: true } } },
  });
  if (!order || order.buyerId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (order.payment?.processorRef !== "simulated") {
    return NextResponse.json({ error: "This payment cannot be confirmed manually" }, { status: 400 });
  }

  const result = await completeCryptoPayment(body.orderId, `sim_tx_${Date.now()}`);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  return NextResponse.json({ ok: true });
}
