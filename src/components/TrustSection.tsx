import Image from "next/image";

const FEATURES = [
  { icon: "🛡️", title: "TradeGuard Protection", body: "Payments are held until you confirm delivery." },
  { icon: "✅", title: "Verified Sellers", body: "Top sellers pass extra identity checks." },
  { icon: "💬", title: "24/7 Support", body: "Our team handles disputes around the clock." },
  { icon: "🌍", title: "Global Community", body: "Trade across dozens of supported games." },
];

export function TrustSection({ gameCount }: { gameCount?: number }) {
  const features = FEATURES.map((f) =>
    f.title === "Global Community" && gameCount
      ? { ...f, body: `Trade across ${gameCount}+ supported games worldwide.` }
      : f,
  );

  return (
    <section className="mt-12 sm:mt-20">
      <div className="text-center">
        <p className="text-sm font-semibold text-accent">How it works</p>
        <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">Your security is our priority</h2>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="rounded-xl border border-border-dim/60 bg-surface/80 p-5">
            <span className="text-2xl">{f.icon}</span>
            <h3 className="mt-3 font-bold">{f.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {["/images/site/video-buy.svg", "/images/site/video-sell.svg", "/images/site/video-brand.svg"].map((src) => (
          <div key={src} className="relative aspect-[5/3] overflow-hidden rounded-xl border border-border-dim/60">
            <Image src={src} alt="" fill className="object-cover" sizes="33vw" unoptimized />
          </div>
        ))}
      </div>
    </section>
  );
}
