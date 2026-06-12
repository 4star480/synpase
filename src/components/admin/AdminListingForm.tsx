"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import type { AdminFormState } from "@/lib/actions/admin";
import { CATEGORIES } from "@/lib/format";
import { isListingUploadPath, listingUploadSrc } from "@/lib/listing-upload-path";

type ListingData = {
  id?: string;
  title: string;
  description: string;
  category: string;
  gameId: string;
  sellerId: string;
  priceCents: number;
  stock: number;
  deliveryMins: number;
  status: string;
  featured: boolean;
  imagePath: string;
};

const inputClass =
  "w-full rounded-lg border border-border-dim bg-background px-3 py-2.5 text-base outline-none focus:border-accent sm:text-sm";

export function AdminListingForm({
  action,
  listing,
  games,
  sellers,
  deleteAction,
}: {
  action: (prev: AdminFormState, formData: FormData) => Promise<AdminFormState>;
  listing?: ListingData;
  games: { id: string; name: string; emoji: string }[];
  sellers: { id: string; username: string }[];
  deleteAction?: () => Promise<void>;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const initialPreview =
    listing?.imagePath && isListingUploadPath(listing.imagePath)
      ? listingUploadSrc(listing.imagePath)
      : listing?.imagePath || null;
  const [preview, setPreview] = useState<string | null>(initialPreview);

  function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  return (
    <form action={formAction} encType="multipart/form-data" className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-5 rounded-xl border border-border-dim bg-surface p-6">
          <h2 className="font-semibold">Product details</h2>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Title</span>
            <input name="title" required defaultValue={listing?.title} className={inputClass} placeholder="50M OSRS GP — Fast GE Trade" />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Description</span>
            <textarea
              name="description"
              required
              rows={5}
              defaultValue={listing?.description}
              className={inputClass}
              placeholder="What the buyer receives and how you deliver..."
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Game</span>
              <select name="gameId" required defaultValue={listing?.gameId ?? ""} className={inputClass}>
                <option value="" disabled>
                  Select game
                </option>
                {games.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.emoji} {g.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Category</span>
              <select name="category" required defaultValue={listing?.category ?? ""} className={inputClass}>
                <option value="" disabled>
                  Select category
                </option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Seller</span>
            <select name="sellerId" required defaultValue={listing?.sellerId ?? sellers[0]?.id ?? ""} className={inputClass}>
              {sellers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.username}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-border-dim bg-surface p-6">
            <h2 className="font-semibold">Pricing & stock</h2>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Price (USD)</span>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  defaultValue={listing ? (listing.priceCents / 100).toFixed(2) : ""}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Stock</span>
                <input name="stock" type="number" min="0" required defaultValue={listing?.stock ?? 1} className={inputClass} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Delivery time</span>
                <select name="deliveryMins" defaultValue={String(listing?.deliveryMins ?? 60)} className={inputClass}>
                  <option value="15">15 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="240">4 hours</option>
                  <option value="720">12 hours</option>
                  <option value="1440">1 day</option>
                  <option value="4320">3 days</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Status</span>
                <select name="status" defaultValue={listing?.status ?? "ACTIVE"} className={inputClass}>
                  <option value="ACTIVE">Active</option>
                  <option value="PAUSED">Paused</option>
                  <option value="SOLD_OUT">Sold out</option>
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="featured" defaultChecked={listing?.featured} className="h-4 w-4 rounded accent-accent" />
                Featured on homepage
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-border-dim bg-surface p-6">
            <h2 className="font-semibold">Product image</h2>
            <p className="mt-1 text-xs text-muted">
              Upload a photo for this listing. JPG, PNG, WebP or GIF — max 5 MB. Leave empty to use the game cover.
            </p>
            {preview && (
              <div className="relative mt-3 aspect-video overflow-hidden rounded-lg bg-surface-2">
                <Image
                  src={preview}
                  alt="Product preview"
                  fill
                  className="object-cover"
                  unoptimized={preview.startsWith("blob:") || preview.startsWith("/api/")}
                />
              </div>
            )}
            <label className="mt-3 block">
              <span className="sr-only">Choose product image</span>
              <input
                type="file"
                name="image"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={onImageChange}
                className="w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-accent file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-accent-hover"
              />
            </label>
          </div>
        </div>
      </div>

      {state.error && <p className="rounded-lg bg-rose-400/10 px-4 py-3 text-sm text-rose-400">{state.error}</p>}
      {state.success && <p className="rounded-lg bg-success/10 px-4 py-3 text-sm text-success">{state.success}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent-hover disabled:opacity-60"
        >
          {pending ? "Saving..." : listing ? "Save changes" : "Create product"}
        </button>
        {listing && deleteAction && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Remove or pause this product?")) deleteAction();
            }}
            className="rounded-xl border border-rose-400/40 px-6 py-3 text-sm font-semibold text-rose-400 transition hover:bg-rose-400/10"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
