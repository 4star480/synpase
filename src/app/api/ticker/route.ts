import { NextResponse } from "next/server";
import { getTickerEvents, tickerCacheKey } from "@/lib/ticker";

export const dynamic = "force-dynamic";

export async function GET() {
  const events = await getTickerEvents(14);
  return NextResponse.json(
    { events, bucket: tickerCacheKey() },
    {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=120",
      },
    }
  );
}
