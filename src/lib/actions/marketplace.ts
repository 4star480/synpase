"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { CATEGORIES } from "@/lib/format";
import { resolveListingImage } from "@/lib/listing-images";

export type FormState = { error?: string };

export async function createListing(_prev: FormState, formData: FormData): Promise<FormState> {
  const sellerId = await getSessionUserId();
  if (!sellerId) {
    return { error: "You must be logged in to create a listing." };
  }

  const seller = await prisma.user.findUnique({
    where: { id: sellerId },
    select: { id: true },
  });
  if (!seller) {
    return { error: "Your session has expired. Please log in again." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const gameId = String(formData.get("gameId") ?? "");
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock") ?? 1);
  const deliveryMins = Number(formData.get("deliveryMins") ?? 60);

  if (title.length < 5 || title.length > 120) return { error: "Title must be 5-120 characters." };
  if (description.length < 20) return { error: "Description must be at least 20 characters." };
  if (!CATEGORIES.some((c) => c.value === category)) return { error: "Pick a category." };
  if (!Number.isFinite(price) || price <= 0 || price > 100000) return { error: "Enter a valid price." };
  if (!Number.isInteger(stock) || stock < 1 || stock > 9999) return { error: "Enter a valid stock amount." };

  const game = await prisma.game.findUnique({
    where: { id: gameId },
    select: { id: true, slug: true, bannerFrom: true, bannerTo: true, emoji: true },
  });
  if (!game) return { error: "Pick a game." };

  const listingId = crypto.randomUUID();
  const imagePath = resolveListingImage(game.slug, category);

  const listing = await prisma.listing.create({
    data: {
      id: listingId,
      title,
      description,
      category,
      gameId,
      sellerId,
      priceCents: Math.round(price * 100),
      stock,
      deliveryMins,
      imagePath,
    },
  });

  redirect(`/listing/${listing.id}`);
}

/** @deprecated Use /checkout/[listingId] — kept for legacy callers */
export async function buyListing(listingId: string) {
  const buyerId = await getSessionUserId();
  if (!buyerId) redirect("/login");
  redirect(`/checkout/${listingId}`);
}
