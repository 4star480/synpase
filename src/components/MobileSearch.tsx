"use client";

import { usePathname } from "next/navigation";
import { SearchBar } from "./SearchBar";

export function MobileSearch() {
  const pathname = usePathname();
  // Homepage has hero search; auth pages are form-focused
  if (
    pathname === "/" ||
    pathname === "/browse" ||
    pathname.startsWith("/browse?") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return null;
  }

  return (
    <div className="px-4 pb-3 lg:hidden">
      <SearchBar />
    </div>
  );
}
