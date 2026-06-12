import { WishlistContent } from "./WishlistContent";

export const metadata = { title: "Wishlist" };

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Wishlist</h1>
      <p className="mt-1 text-sm text-muted">Offers you&apos;ve saved for later</p>
      <WishlistContent />
    </div>
  );
}
