/** Shared environment helpers for production-safe configuration. */

export function getSessionSecret(): Uint8Array {
  const raw = process.env.SESSION_SECRET?.trim();
  if (!raw) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET is required in production");
    }
    return new TextEncoder().encode("development-only-session-secret");
  }
  if (raw.length < 32 && process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be at least 32 characters in production");
  }
  return new TextEncoder().encode(raw);
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function publicSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}
