import { SearchBar } from "./SearchBar";

export function HeaderSearch() {
  return (
    <div className="hidden flex-1 max-w-xl lg:block">
      <SearchBar glow />
    </div>
  );
}
