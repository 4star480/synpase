"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "@/lib/actions/admin";

const STATUSES = ["PENDING", "DELIVERED", "COMPLETED", "DISPUTED"] as const;

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) => startTransition(() => updateOrderStatus(orderId, e.target.value))}
      className="rounded-md border border-border-dim bg-background px-2 py-1 text-xs disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
