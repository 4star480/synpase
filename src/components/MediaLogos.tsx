const OUTLETS = ["The New York Times", "Axios", "CNN", "CNBC", "IGN", "Reviews.io", "Google Reviews"];

export function MediaLogos() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 opacity-50">
      {OUTLETS.map((name) => (
        <span key={name} className="text-xs font-bold uppercase tracking-widest text-muted sm:text-sm">
          {name}
        </span>
      ))}
    </div>
  );
}
