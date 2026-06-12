"use client";

import { useActionState } from "react";
import { createListing, type FormState } from "@/lib/actions/marketplace";
import { CATEGORIES } from "@/lib/format";

const inputClass =
  "w-full rounded-lg border border-border-dim bg-background px-3 py-2.5 text-base outline-none placeholder:text-muted focus:border-accent sm:text-sm";

export function SellForm({ games }: { games: { id: string; name: string }[] }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(createListing, {});

  return (
    <form action={formAction} className="mt-6 space-y-5 rounded-xl border border-border-dim bg-surface p-6">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Title</span>
        <input
          name="title"
          required
          minLength={5}
          maxLength={120}
          placeholder="e.g. 100k Gold — Fast Delivery, Any Server"
          className={inputClass}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Game</span>
          <select name="gameId" required className={inputClass} defaultValue="">
            <option value="" disabled>
              Select a game
            </option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Category</span>
          <select name="category" required className={inputClass} defaultValue="">
            <option value="" disabled>
              Select a category
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
        <span className="mb-1.5 block text-sm font-medium">Description</span>
        <textarea
          name="description"
          required
          minLength={20}
          rows={6}
          placeholder="What exactly does the buyer receive? How do you deliver? Any requirements from the buyer?"
          className={inputClass}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Price (USD)</span>
          <input name="price" type="number" step="0.01" min="0.5" required placeholder="24.99" className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Stock</span>
          <input name="stock" type="number" min="1" defaultValue={1} required className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Delivery time</span>
          <select name="deliveryMins" defaultValue="60" className={inputClass}>
            <option value="15">15 minutes</option>
            <option value="60">1 hour</option>
            <option value="240">4 hours</option>
            <option value="720">12 hours</option>
            <option value="1440">1 day</option>
            <option value="4320">3 days</option>
            <option value="10080">7 days</option>
          </select>
        </label>
      </div>

      {state.error && (
        <p className="rounded-lg bg-rose-400/10 px-3 py-2 text-sm text-rose-400">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-accent py-3 font-semibold text-white transition hover:bg-accent-hover disabled:opacity-60"
      >
        {pending ? "Publishing..." : "Publish listing"}
      </button>
    </form>
  );
}
