import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { adminListingOptions } from "@/lib/admin-queries";
import { updateListingAdmin, deleteListingAdmin } from "@/lib/actions/admin";
import { AdminListingForm } from "@/components/admin/AdminListingForm";

export const metadata = { title: "Admin — Edit product" };

export default async function AdminEditListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { id } = await params;
  const { created } = await searchParams;

  const [listing, { games, sellers }] = await Promise.all([
    prisma.listing.findUnique({
      where: { id },
      include: { game: true, seller: true },
    }),
    adminListingOptions(),
  ]);

  if (!listing) notFound();

  const updateAction = updateListingAdmin.bind(null, id);
  const deleteAction = deleteListingAdmin.bind(null, id);

  return (
    <div>
      <Link href="/admin/listings" className="text-sm text-muted hover:text-accent">
        ← Back to products
      </Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Edit product</h1>
          <p className="mt-1 text-sm text-muted truncate max-w-xl">{listing.title}</p>
        </div>
        <Link
          href={`/listing/${listing.id}`}
          target="_blank"
          className="rounded-lg border border-border-dim px-4 py-2 text-sm transition hover:border-accent"
        >
          View on store →
        </Link>
      </div>

      {created === "1" && (
        <p className="mt-4 rounded-lg bg-success/10 px-4 py-3 text-sm text-success">
          Product created successfully. You can upload an image or adjust the price below.
        </p>
      )}

      <div className="mt-8">
        <AdminListingForm
          action={updateAction}
          listing={{
            id: listing.id,
            title: listing.title,
            description: listing.description,
            category: listing.category,
            gameId: listing.gameId,
            sellerId: listing.sellerId,
            priceCents: listing.priceCents,
            stock: listing.stock,
            deliveryMins: listing.deliveryMins,
            status: listing.status,
            featured: listing.featured,
            imagePath: listing.imagePath,
          }}
          games={games}
          sellers={sellers}
          deleteAction={deleteAction}
        />
      </div>
    </div>
  );
}
