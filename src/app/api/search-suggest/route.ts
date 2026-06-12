import { NextRequest, NextResponse } from "next/server";
import { searchSuggestions } from "@/lib/queries";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (q.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }
  try {
    const results = await searchSuggestions(q, 8);
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
