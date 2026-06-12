import { headers } from "next/headers";
import { getCurrentUser } from "@/lib/session";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileTabBar } from "./MobileTabBar";
import { MobileMenu } from "./MobileMenu";

export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  const user = await getCurrentUser();

  return (
    <>
      <MobileMenu
        user={user ? { username: user.username, avatarHue: user.avatarHue } : null}
      />
      <Header />
      <main className="flex-1 pb-[var(--mobile-tab-height)] lg:pb-0">{children}</main>
      <Footer />
      <MobileTabBar />
    </>
  );
}
