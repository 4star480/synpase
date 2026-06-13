import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { avgRating } from "@/lib/queries";
import { getSessionUserId } from "@/lib/session";
import { formatPrice, formatDelivery } from "@/lib/format";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Avatar } from "@/components/Avatar";
import { RatingStars } from "@/components/RatingStars";
import { ListingThumbnail } from "@/components/ListingThumbnail";
import { GameCover } from "@/components/GameCover";
import { WishlistButton } from "@/components/WishlistButton";
import { sellerIsOnline } from "@/lib/seller-status";
import { displaySalesCount } from "@/lib/trader-stats";
import { BuyButton } from "./BuyButton";

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [listing, viewerId] = await Promise.all([
    prisma.listing.findUnique({
      where: { id },
      include: {
        game: true,
        seller: {
          select: {
            id: true,
            username: true,
            avatarHue: true,
            verified: true,
            memberSince: true,
            salesCount: true,
            bio: true,
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
          },
        },
      },
    }),
    getSessionUserId(),
  ]);

  if (!listing) notFound();

  await prisma.listing.update({ where: { id }, data: { views: { increment: 1 } } });

  const rating = avgRating(listing.seller.reviews);
  const online = sellerIsOnline(listing.seller.username);
  const available = listing.status === "ACTIVE" && listing.stock > 0;
  const isOwn = viewerId === listing.seller.id;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 pb-[calc(9rem+env(safe-area-inset-bottom,0px))] sm:px-6 lg:pb-8">
      <nav className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-sm text-muted">
        <Link href="/browse" className="hover:text-foreground">
          Browse
        </Link>
        <span>/</span>
        <Link href={`/browse?game=${listing.game.slug}`} className="hover:text-foreground">
          {listing.game.name}
        </Link>
        <span>/</span>
        <span className="line-clamp-1 text-foreground">
          {listing.title.length > 42 ? `${listing.title.slice(0, 40)}…` : listing.title}
        </span>
      </nav>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-border-dim bg-surface">
            <div className="relative">
              <ListingThumbnail
                category={listing.category}
                title={listing.title}
                gameName={listing.game.name}
                gameSlug={listing.game.slug}
                imagePath={listing.imagePath}
                bannerFrom={listing.game.bannerFrom}
                bannerTo={listing.game.bannerTo}
              />
              <div className="absolute right-4 top-4">
                <WishlistButton listingId={listing.id} />
              </div>
              {listing.featured && (
                <span className="absolute left-4 top-4 rounded-md bg-accent px-2.5 py-1 text-xs font-bold uppercase text-white">
                  🔥 Hot offer
                </span>
              )}
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2">
                <CategoryBadge category={listing.category} />
                <span className="text-sm text-muted">{listing.game.name}</span>
                <span className="text-xs text-muted">· {listing.views + 1} views</span>
              </div>
              <h1 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">{listing.title}</h1>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-foreground/90">
                {listing.description}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border-dim bg-surface p-6">
            <h2 className="text-lg font-semibold">Seller reviews ({listing.seller.reviews.length})</h2>
            {listing.seller.reviews.length === 0 ? (
              <p className="mt-2 text-sm text-muted">This seller has no reviews yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {listing.seller.reviews.slice(0, 8).map((r) => (
                  <li key={r.id} className="rounded-xl bg-surface-2 p-4 transition hover:bg-background">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{r.author.username}</span>
                      <RatingStars rating={r.rating} />
                    </div>
                    {r.comment && <p className="mt-1.5 text-sm text-muted">{r.comment}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <aside className="h-fit space-y-4 lg:sticky lg:top-20">
          <div className="rounded-2xl border border-border-dim bg-surface p-6 shadow-xl shadow-black/20">
            <p className="text-3xl font-extrabold text-accent">{formatPrice(listing.priceCents)}</p>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between rounded-lg bg-surface-2 px-3 py-2">
                <dt className="text-muted">Delivery</dt>
                <dd className="font-semibold">~{formatDelivery(listing.deliveryMins)}</dd>
              </div>
              <div className="flex justify-between rounded-lg bg-surface-2 px-3 py-2">
                <dt className="text-muted">In stock</dt>
                <dd className="font-semibold">{listing.stock}</dd>
              </div>
              <div className="flex justify-between rounded-lg bg-success/10 px-3 py-2">
                <dt className="text-success">Buyer protection</dt>
                <dd className="font-semibold text-success">✓ Included</dd>
              </div>
            </dl>
            <div className="mt-5 hidden lg:block">
              {isOwn ? (
                <p className="rounded-xl bg-surface-2 p-4 text-center text-sm text-muted">
                  This is your listing.
                </p>
              ) : available ? (
                <BuyButton listingId={listing.id} loggedIn={Boolean(viewerId)} price={listing.priceCents} />
              ) : (
                <p className="rounded-xl bg-warning/10 p-4 text-center text-sm font-semibold text-warning">
                  Sold out
                </p>
              )}
            </div>
          </div>

          <Link
            href={`/seller/${listing.seller.username}`}
            className="block rounded-2xl border border-border-dim bg-surface p-6 transition hover:border-accent/50 hover:shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Avatar username={listing.seller.username} hue={listing.seller.avatarHue} size={52} />
              <div>
                <p className="flex items-center gap-1.5 font-semibold">
                  {listing.seller.username}
                  {listing.seller.verified && (
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
                      ✓ Verified
                    </span>
                  )}
                </p>
                <RatingStars rating={rating} count={listing.seller.reviews.length} />
                <p className={`text-[11px] ${online ? "text-success" : "text-muted"}`}>
                  {online ? "● Online now" : "○ Offline"}
                </p>
              </div>
            </div>
            {listing.seller.bio && (
              <p className="mt-3 line-clamp-2 text-xs text-muted">{listing.seller.bio}</p>
            )}
            <p className="mt-2 text-xs text-muted">
              Member since{" "}
              {listing.seller.memberSince.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              {listing.seller.salesCount > 0 && (
                <> · {listing.seller.salesCount.toLocaleString()} sales</>
              )}
            </p>
          </Link>

          <GameCover
            name={listing.game.name}
            slug={listing.game.slug}
            coverImage={listing.game.coverImage}
            bannerFrom={listing.game.bannerFrom}
            bannerTo={listing.game.bannerTo}
            size="sm"
          />
        </aside>
      </div>

      {/* Mobile sticky purchase bar */}
      <div className="mobile-above-tab-bar fixed inset-x-0 border-t border-border-dim bg-surface/95 p-4 backdrop-blur-lg lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xl font-extrabold text-accent">{formatPrice(listing.priceCents)}</p>
            <p className="text-xs text-muted">~{formatDelivery(listing.deliveryMins)} · {listing.stock} in stock</p>
          </div>
          <div className="shrink-0 min-w-[9rem] flex-1 max-w-[11rem]">
            {isOwn ? (
              <p className="rounded-xl bg-surface-2 px-3 py-3 text-center text-xs text-muted">Your listing</p>
            ) : available ? (
              <BuyButton
                listingId={listing.id}
                loggedIn={Boolean(viewerId)}
                price={listing.priceCents}
                compact
              />
            ) : (
              <p className="rounded-xl bg-warning/10 px-3 py-3 text-center text-xs font-semibold text-warning">
                Sold out
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
