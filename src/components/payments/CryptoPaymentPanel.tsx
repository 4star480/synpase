"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { cryptoQrUrl } from "@/lib/payments/crypto-invoice";
import { CRYPTO_CURRENCIES } from "@/lib/payments/types";

type PaymentPayload = {
  orderId: string;
  paymentStatus: string;
  payment: {
    cryptoCurrency: string | null;
    cryptoAmount: string | null;
    cryptoAddress: string | null;
    expiresAt: string | null;
    processorRef: string | null;
    status: string;
  } | null;
  listingTitle: string;
  amountCents: number;
};

export function CryptoPaymentPanel({
  initial,
  allowManualConfirm,
}: {
  initial: PaymentPayload;
  allowManualConfirm: boolean;
}) {
  const router = useRouter();
  const [data, setData] = useState(initial);
  const [copied, setCopied] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const p = data.payment;
  const meta = CRYPTO_CURRENCIES.find((c) => c.id === p?.cryptoCurrency);
  const expired = p?.expiresAt && new Date(p.expiresAt) < new Date();
  const paid = data.paymentStatus === "PAID";

  useEffect(() => {
    if (paid) {
      const t = setTimeout(() => router.push("/orders"), 2000);
      return () => clearTimeout(t);
    }
    const id = setInterval(async () => {
      const res = await fetch(`/api/payments/crypto/status?orderId=${data.orderId}`);
      if (!res.ok) return;
      const next = (await res.json()) as PaymentPayload;
      setData(next);
      if (next.paymentStatus === "PAID") router.push("/orders");
    }, 8000);
    return () => clearInterval(id);
  }, [data.orderId, paid, router]);

  async function copy(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  async function confirmPaymentSent() {
    setConfirming(true);
    try {
      const res = await fetch("/api/payments/crypto/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: data.orderId }),
      });
      if (res.ok) router.push("/orders");
    } finally {
      setConfirming(false);
    }
  }

  if (paid) {
    return (
      <div className="rounded-2xl border border-success/40 bg-success/10 p-8 text-center">
        <p className="text-2xl">✓</p>
        <p className="mt-2 text-lg font-bold text-success">Payment confirmed</p>
        <p className="mt-1 text-sm text-muted">Redirecting to your orders…</p>
      </div>
    );
  }

  if (!p?.cryptoAddress || expired || data.paymentStatus === "FAILED") {
    return (
      <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-8 text-center">
        <p className="font-bold text-rose-400">Invoice expired or failed</p>
        <p className="mt-2 text-sm text-muted">Start a new checkout from the listing page.</p>
      </div>
    );
  }

  const qr = cryptoQrUrl(p.cryptoAddress);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border-dim bg-surface p-6 text-center">
        <p className="text-sm text-muted">Send exactly</p>
        <p className="mt-1 text-2xl font-extrabold text-accent">
          {p.cryptoAmount} {p.cryptoCurrency}
        </p>
        <p className="text-sm text-muted">≈ {formatPrice(data.amountCents)} USD</p>
        {meta && <p className="mt-1 text-xs text-muted">{meta.label}</p>}
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qr} alt="Payment QR code" className="rounded-xl border border-border-dim bg-white p-2" width={220} height={220} />
        <div className="min-w-0 flex-1 space-y-4 w-full">
          <div>
            <p className="text-xs font-semibold uppercase text-muted">Wallet address</p>
            <div className="mt-1 flex gap-2">
              <code className="flex-1 break-all rounded-lg bg-surface-2 px-3 py-2 text-xs">{p.cryptoAddress}</code>
              <button
                type="button"
                onClick={() => copy(p.cryptoAddress!, "addr")}
                className="shrink-0 rounded-lg border border-border-dim px-3 py-2 text-xs font-semibold hover:border-accent"
              >
                {copied === "addr" ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-muted">Amount</p>
            <div className="mt-1 flex gap-2">
              <code className="flex-1 rounded-lg bg-surface-2 px-3 py-2 text-sm font-bold">{p.cryptoAmount}</code>
              <button
                type="button"
                onClick={() => copy(p.cryptoAmount!, "amt")}
                className="shrink-0 rounded-lg border border-border-dim px-3 py-2 text-xs font-semibold hover:border-accent"
              >
                {copied === "amt" ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
          {p.expiresAt && (
            <p className="text-xs text-warning">
              Expires {new Date(p.expiresAt).toLocaleString()} — status updates automatically every 8s
            </p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border-dim bg-surface-2 p-4 text-sm text-muted">
        <p className="font-semibold text-foreground">{data.listingTitle}</p>
        <p className="mt-2">
          Send only <strong className="text-foreground">{p.cryptoCurrency}</strong> to this address. Wrong network =
          lost funds. TradeGuard releases payment to the seller after you confirm delivery.
        </p>
      </div>

      {allowManualConfirm && p.processorRef === "simulated" && (
        <button
          type="button"
          onClick={confirmPaymentSent}
          disabled={confirming}
          className="touch-manipulation w-full rounded-xl border border-accent/50 py-3.5 text-sm font-semibold text-accent hover:bg-accent/10 active:scale-[0.99] disabled:opacity-50"
        >
          {confirming ? "Confirming payment…" : "I've sent the payment"}
        </button>
      )}
    </div>
  );
}
