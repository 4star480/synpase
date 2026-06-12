import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/session";
import { allGames } from "@/lib/queries";
import { SellForm } from "./SellForm";

import { SITE_NAME } from "@/lib/brand";

export const metadata = { title: `Sell on ${SITE_NAME}` };

export default async function SellPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login?redirect=/sell");

  const games = await allGames();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold">Create a listing</h1>
      <p className="mt-1 text-sm text-muted">
        Describe exactly what the buyer gets and how you deliver it. Clear listings sell faster.
      </p>
      <SellForm games={games.map((g) => ({ id: g.id, name: g.name }))} />
    </div>
  );
}
