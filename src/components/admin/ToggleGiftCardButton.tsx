"use client";

import { useTransition } from "react";
import { toggleGiftCard } from "@/lib/actions/gift-cards";

export function ToggleGiftCardButton({ cardId, active }: { cardId: string; active: boolean }) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(() => toggleGiftCard(cardId, !active))}
      className="text-xs font-semibold text-muted hover:text-accent disabled:opacity-50"
    >
      {active ? "Disable" : "Enable"}
    </button>
  );
}
