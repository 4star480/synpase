import { NextRequest, NextResponse } from "next/server";
import { searchGameSuggestions, searchSuggestions } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (q.trim().length < 2) {
    return NextResponse.json({ results: [], games: [] });
  }
  try {
    const [results, games] = await Promise.all([searchSuggestions(q, 8), searchGameSuggestions(q, 4)]);
    return NextResponse.json(
      { results, games },
      { headers: { "Cache-Control": "private, no-store, max-age=0" } },
    );
  } catch (err) {
    console.error("search-suggest error:", err);
    return NextResponse.json({ results: [], games: [] });
  }
}
