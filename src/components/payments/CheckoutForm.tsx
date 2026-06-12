"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { processCheckout, type CheckoutFormState } from "@/lib/actions/checkout";
import { formatPrice } from "@/lib/format";
import { GIFT_CARD_BRANDS } from "@/lib/payments/gift-card-brands";
import { CRYPTO_CURRENCIES } from "@/lib/payments/types";

function SubmitButtons({ priceCents }: { priceCents: number }) {
  const { pending } = useFormStatus();
  return (
    <>
      <button
        type="submit"
        name="intent"
        value="pay"
        disabled={pending}
        className="checkout-submit checkout-submit--crypto touch-manipulation w-full rounded-xl bg-buy py-4 text-base font-bold uppercase tracking-wide text-black shadow-lg shadow-buy/30 transition active:scale-[0.99] disabled:opacity-60"
      >
        {pending ? "Processing…" : "Continue to crypto payment"}
      </button>
      <button
        type="submit"
        name="intent"
        value="pay"
        disabled={pending}
        className="checkout-submit checkout-submit--gift touch-manipulation w-full rounded-xl bg-buy py-4 text-base font-bold uppercase tracking-wide text-black shadow-lg shadow-buy/30 transition active:scale-[0.99] disabled:opacity-60"
      >
        {pending ? "Processing…" : `Pay ${formatPrice(priceCents)} with gift card`}
      </button>
    </>
  );
}

export function CheckoutForm({
  listingId,
  priceCents,
  title,
}: {
  listingId: string;
  priceCents: number;
  title: string;
}) {
  const [state, formAction] = useActionState(processCheckout, {} as CheckoutFormState);

  return (
    <form action={formAction} className="checkout-pay-root relative z-10 space-y-5">
      <input type="hidden" name="listingId" value={listingId} />

      <div className="rounded-2xl border border-border-dim bg-surface p-5">
        <p className="text-sm text-muted">You&apos;re buying</p>
        <p className="mt-1 font-semibold line-clamp-2">{title}</p>
        <p className="mt-3 text-3xl font-extrabold text-accent">{formatPrice(priceCents)}</p>
      </div>

      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">Payment method</legend>
        <div className="grid grid-cols-2 gap-2">
          <label htmlFor="checkout-method-crypto" className="checkout-method-option">
            <input
              type="radio"
              id="checkout-method-crypto"
              name="method"
              value="CRYPTO"
              defaultChecked
            />
            <span className="text-lg" aria-hidden>
              ₿
            </span>
            Crypto
          </label>
          <label htmlFor="checkout-method-gift" className="checkout-method-option">
            <input type="radio" id="checkout-method-gift" name="method" value="GIFT_CARD" />
            <span className="text-lg" aria-hidden>
              🎁
            </span>
            Gift card
          </label>
        </div>
      </fieldset>

      <div className="checkout-panel checkout-panel--crypto">
        <fieldset className="rounded-xl border border-border-dim bg-surface-2 p-4">
          <legend className="text-sm font-semibold">Select cryptocurrency</legend>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {CRYPTO_CURRENCIES.map((c, i) => (
              <label key={c.id} htmlFor={`checkout-crypto-${c.id}`} className="checkout-crypto-option">
                <input
                  type="radio"
                  id={`checkout-crypto-${c.id}`}
                  name="cryptoCurrency"
                  value={c.id}
                  defaultChecked={i === 0}
                />
                {c.symbol} {c.id}
              </label>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">
            You&apos;ll get a wallet address and exact amount. Funds stay in TradeGuard until delivery is confirmed.
          </p>
        </fieldset>
      </div>

      <div className="checkout-panel checkout-panel--gift">
        <div className="rounded-xl border-2 border-accent/40 bg-surface-2 p-4 shadow-lg shadow-accent/5">
          <label htmlFor="giftCardCode" className="block text-sm font-semibold">
            Enter your gift card code
          </label>
          <p className="mt-1 text-xs text-muted">
            Amazon, Steam, PlayStation, Xbox, Nintendo, Google Play, Apple, Roblox, and more.
          </p>

          <input
            id="giftCardCode"
            name="giftCardCode"
            placeholder="Enter your gift card code"
            inputMode="text"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            className="checkout-gift-input mt-3 w-full rounded-lg border border-border-dim bg-background px-4 py-3.5 font-mono text-base uppercase tracking-wider outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          />

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="submit"
              name="intent"
              value="preview"
              className="checkout-preview-btn touch-manipulation rounded-lg bg-accent/15 px-4 py-2.5 text-sm font-semibold text-accent active:scale-[0.98]"
            >
              Check balance
            </button>
            {state.giftPreview && (
              <p className={`text-sm ${state.giftPreviewOk ? "text-success" : "text-rose-400"}`}>
                {state.giftPreview}
              </p>
            )}
          </div>

          <details className="mt-4">
            <summary className="cursor-pointer text-xs font-semibold text-muted">Accepted brands and amounts</summary>
            <ul className="mt-3 space-y-2">
              {GIFT_CARD_BRANDS.map((brand) => (
                <li key={brand.id} className="text-xs">
                  <span className="font-semibold text-foreground">
                    {brand.icon} {brand.name}
                  </span>
                  <span className="text-muted"> — ${brand.denominations.join(", $")}</span>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>

      {state.error && (
        <p className="rounded-lg bg-rose-500/10 px-4 py-3 text-sm text-rose-400">{state.error}</p>
      )}

      <SubmitButtons priceCents={priceCents} />

      <p className="text-center text-xs text-muted">
        🛡️ Protected by TradeGuard — payment held until you confirm delivery
      </p>
    </form>
  );
}
