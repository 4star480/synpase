import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <span className="text-6xl">🎮</span>
      <h1 className="mt-6 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-sm text-muted">
        This listing, seller, or page doesn&apos;t exist. It may have been removed or sold out.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/browse"
          className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
        >
          Browse offers
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-border-dim px-5 py-2.5 text-sm font-semibold transition hover:border-accent hover:text-accent"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
