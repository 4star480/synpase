import { NextResponse } from "next/server";
import { getBuyerOrders, serializeBuyerOrder } from "@/lib/order-queries";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await getBuyerOrders(user.id);

  return NextResponse.json(
    { orders: orders.map(serializeBuyerOrder) },
    {
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
      },
    },
  );
}
