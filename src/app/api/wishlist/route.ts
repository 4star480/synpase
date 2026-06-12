import { listingsByIds } from "@/lib/queries";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const ids = Array.isArray(body.ids) ? (body.ids as string[]).slice(0, 48) : [];
  const listings = await listingsByIds(ids);
  return Response.json({ listings });
}
