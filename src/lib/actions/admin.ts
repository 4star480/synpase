"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { saveListingImage } from "@/lib/upload";
import { CATEGORIES } from "@/lib/format";
import { resolveListingImage } from "@/lib/listing-images";

export type AdminFormState = { error?: string; success?: string };

async function guard() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

function parseListingFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const gameId = String(formData.get("gameId") ?? "");
  const sellerId = String(formData.get("sellerId") ?? "");
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock") ?? 1);
  const deliveryMins = Number(formData.get("deliveryMins") ?? 60);
  const status = String(formData.get("status") ?? "ACTIVE");
  const featured = formData.get("featured") === "on";

  if (title.length < 5 || title.length > 120) return { error: "Title must be 5–120 characters." as const };
  if (description.length < 20) return { error: "Description must be at least 20 characters." as const };
  if (!CATEGORIES.some((c) => c.value === category)) return { error: "Pick a valid category." as const };
  if (!["ACTIVE", "SOLD_OUT", "PAUSED"].includes(status)) return { error: "Invalid status." as const };
  if (!Number.isFinite(price) || price <= 0 || price > 100000) return { error: "Enter a valid price." as const };
  if (!Number.isInteger(stock) || stock < 0 || stock > 9999) return { error: "Enter valid stock." as const };

  return {
    data: {
      title,
      description,
      category,
      gameId,
      sellerId,
      priceCents: Math.round(price * 100),
      stock,
      deliveryMins,
      status,
      featured,
    },
  };
}

async function resolveImage(formData: FormData, gameId: string, category: string, currentPath = "") {
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    const saved = await saveListingImage(file);
    if (typeof saved === "object") return { error: saved.error };
    return { imagePath: saved };
  }
  if (currentPath) return { imagePath: currentPath };
  const game = await prisma.game.findUnique({ where: { id: gameId }, select: { slug: true } });
  if (!game) return { error: "Invalid game." };
  return { imagePath: resolveListingImage(game.slug, category) };
}

export async function createListingAdmin(_prev: AdminFormState, formData: FormData): Promise<AdminFormState> {
  await guard();
  const parsed = parseListingFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  const { data } = parsed;
  const game = await prisma.game.findUnique({ where: { id: data.gameId } });
  const seller = await prisma.user.findUnique({ where: { id: data.sellerId } });
  if (!game || !seller) return { error: "Pick a valid game and seller." };

  const img = await resolveImage(formData, data.gameId, data.category);
  if ("error" in img) return { error: img.error };

  const listing = await prisma.listing.create({
    data: {
      id: randomUUID(),
      ...data,
      imagePath: img.imagePath,
    },
  });

  revalidatePath("/browse");
  revalidatePath("/admin/listings");
  redirect(`/admin/listings/${listing.id}/edit?created=1`);
}

export async function updateListingAdmin(
  listingId: string,
  _prev: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await guard();
  const existing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!existing) return { error: "Listing not found." };

  const parsed = parseListingFields(formData);
  if ("error" in parsed) return { error: parsed.error };

  const { data } = parsed;
  const game = await prisma.game.findUnique({ where: { id: data.gameId } });
  const seller = await prisma.user.findUnique({ where: { id: data.sellerId } });
  if (!game || !seller) return { error: "Pick a valid game and seller." };

  const img = await resolveImage(formData, data.gameId, data.category, existing.imagePath);
  if ("error" in img) return { error: img.error };

  await prisma.listing.update({
    where: { id: listingId },
    data: { ...data, imagePath: img.imagePath },
  });

  revalidatePath("/browse");
  revalidatePath(`/listing/${listingId}`);
  revalidatePath("/admin/listings");
  return { success: "Listing saved successfully." };
}

export async function deleteListingAdmin(listingId: string) {
  await guard();
  const orders = await prisma.order.count({ where: { listingId } });
  if (orders > 0) {
    await prisma.listing.update({ where: { id: listingId }, data: { status: "PAUSED", stock: 0 } });
  } else {
    await prisma.listing.delete({ where: { id: listingId } });
  }
  revalidatePath("/admin/listings");
  revalidatePath("/browse");
  redirect("/admin/listings");
}

export async function updateOrderStatus(orderId: string, status: string) {
  await guard();
  if (!["PENDING", "DELIVERED", "COMPLETED", "DISPUTED"].includes(status)) return;
  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath("/admin/orders");
}
