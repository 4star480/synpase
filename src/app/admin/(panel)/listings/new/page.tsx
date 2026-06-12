import Link from "next/link";
import { adminListingOptions } from "@/lib/admin-queries";
import { createListingAdmin } from "@/lib/actions/admin";
import { AdminListingForm } from "@/components/admin/AdminListingForm";

export const metadata = { title: "Admin — Add product" };

export default async function AdminNewListingPage() {
  const { games, sellers } = await adminListingOptions();

  return (
    <div>
      <Link href="/admin/listings" className="text-sm text-muted hover:text-accent">
        ← Back to products
      </Link>
      <h1 className="mt-4 text-2xl font-bold">Add new product</h1>
      <p className="mt-1 text-sm text-muted">Create a listing with custom image and pricing</p>
      <div className="mt-8">
        <AdminListingForm action={createListingAdmin} games={games} sellers={sellers} />
      </div>
    </div>
  );
}
