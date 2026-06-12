import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { formatPrice } from "@/lib/format";
import { CheckoutForm } from "@/components/payments/CheckoutForm";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage({ params }: { params: Promise<{ listingId: string }> }) {
  const { listingId } = await params;
  const buyerId = await getSessionUserId();
  if (!buyerId) redirect(`/login?redirect=${encodeURIComponent(`/checkout/${listingId}`)}`);

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      game: { select: { name: true, slug: true } },
      seller: { select: { username: true } },
    },
  });

  if (!listing || listing.status !== "ACTIVE" || listing.stock < 1) notFound();
  if (listing.sellerId === buyerId) redirect(`/listing/${listingId}`);

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:px-6">
      <nav className="text-sm text-muted">
        <Link href="/" className="hover:text-accent">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/listing/${listingId}`} className="hover:text-accent">
          Listing
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Checkout</span>
      </nav>

      <h1 className="mt-4 text-2xl font-bold">Secure checkout</h1>
      <p className="mt-1 text-sm text-muted">
        {listing.game.name} · Seller {listing.seller.username} · {formatPrice(listing.priceCents)}
      </p>

      <div className="relative z-10 mt-8">
        <CheckoutForm listingId={listing.id} priceCents={listing.priceCents} title={listing.title} />
      </div>
    </div>
  );
}
