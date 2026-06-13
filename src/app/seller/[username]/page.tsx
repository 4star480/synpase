import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { avgRating, listingsBySeller } from "@/lib/queries";
import { sellerIsOnline } from "@/lib/seller-status";
import { displaySalesCount } from "@/lib/trader-stats";
import { ListingCard } from "@/components/ListingCard";
import { Avatar } from "@/components/Avatar";
import { RatingStars } from "@/components/RatingStars";

export default async function SellerPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const seller = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      bio: true,
      avatarHue: true,
      verified: true,
      memberSince: true,
      salesCount: true,
      reviews: {
        select: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          author: { select: { username: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { listings: true } },
    },
  });

  if (!seller) notFound();

  const [listings, completedSales] = await Promise.all([
    listingsBySeller(seller.id),
    prisma.order.count({
      where: {
        listing: { sellerId: seller.id },
        status: { in: ["DELIVERED", "COMPLETED"] },
      },
    }),
  ]);
  const totalSales = displaySalesCount(seller.salesCount, completedSales);
  const rating = avgRating(seller.reviews);
  const online = sellerIsOnline(seller.username);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl border border-border-dim bg-surface p-6 sm:p-8">
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url(/images/hero/space.svg)" }}
        />
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar username={seller.username} hue={seller.avatarHue} size={80} />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold">{seller.username}</h1>
              {seller.verified && (
                <span className="rounded-full bg-accent/15 px-3 py-0.5 text-xs font-bold text-accent">
                  ✓ Verified Seller
                </span>
              )}
              <span
                className={`rounded-full px-3 py-0.5 text-xs font-medium ${
                  online ? "bg-success/15 text-success" : "bg-muted/15 text-muted"
                }`}
              >
                {online ? "● Online" : "○ Offline"}
              </span>
            </div>
            <RatingStars rating={rating} count={seller.reviews.length} />
            {seller.bio && <p className="mt-2 max-w-xl text-sm text-muted">{seller.bio}</p>}
          </div>
          <dl className="grid w-full grid-cols-3 gap-4 text-center sm:flex sm:w-auto sm:gap-8">
            <div>
              <dt className="text-xs text-muted">Sales</dt>
              <dd className="text-2xl font-extrabold text-accent">{totalSales.toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Active offers</dt>
              <dd className="text-2xl font-extrabold">{listings.length}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Since</dt>
              <dd className="text-2xl font-extrabold">{seller.memberSince.getFullYear()}</dd>
            </div>
          </dl>
        </div>
      </div>

      <h2 className="mt-10 text-xl font-bold">Active offers</h2>
      {listings.length === 0 ? (
        <p className="mt-3 text-muted">This seller has no active offers.</p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}

      <h2 className="mt-10 text-xl font-bold">Reviews</h2>
      {seller.reviews.length === 0 ? (
        <p className="mt-3 text-muted">No reviews yet.</p>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {seller.reviews.map((r) => (
            <li
              key={r.id}
              className="rounded-xl border border-border-dim bg-surface p-4 transition hover:border-accent/30"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{r.author.username}</span>
                <RatingStars rating={r.rating} />
              </div>
              {r.comment && <p className="mt-1.5 text-sm text-muted">{r.comment}</p>}
              <p className="mt-2 text-[11px] text-muted/70">
                {r.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
