"use client";

import { useActionState } from "react";
import { createGiftCard, type GiftCardFormState } from "@/lib/actions/gift-cards";

export function GiftCardForm() {
  const [state, action, pending] = useActionState(createGiftCard, {} as GiftCardFormState);

  return (
    <form action={action} className="rounded-xl border border-border-dim bg-surface p-5 space-y-4">
      <h2 className="font-semibold">Issue new gift card</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-muted">Amount (USD)</span>
          <input
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            required
            placeholder="50.00"
            className="mt-1 w-full rounded-lg border border-border-dim bg-background px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="text-muted">Expires in (days, 0 = never)</span>
          <input
            name="expiresDays"
            type="number"
            min="0"
            defaultValue={365}
            className="mt-1 w-full rounded-lg border border-border-dim bg-background px-3 py-2"
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="text-muted">Code (optional — auto-generated if empty)</span>
        <input
          name="code"
          placeholder="Leave blank to auto-generate"
          className="mt-1 w-full rounded-lg border border-border-dim bg-background px-3 py-2 font-mono uppercase"
        />
      </label>
      <label className="block text-sm">
        <span className="text-muted">Label</span>
        <input
          name="label"
          placeholder="Promo / support credit"
          className="mt-1 w-full rounded-lg border border-border-dim bg-background px-3 py-2"
        />
      </label>
      {state.error && <p className="text-sm text-rose-400">{state.error}</p>}
      {state.success && <p className="text-sm text-success">{state.success}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create gift card"}
      </button>
    </form>
  );
}
