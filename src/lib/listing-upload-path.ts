const UPLOAD_PREFIX = "/api/uploads/listings/";

/** True when imagePath points at an admin-uploaded listing photo. */
export function isListingUploadPath(path?: string | null): boolean {
  if (!path) return false;
  return path.startsWith(UPLOAD_PREFIX) || path.startsWith("/uploads/listings/");
}

/** Normalize legacy /uploads/listings/* paths to the API route. */
export function listingUploadSrc(path: string): string {
  if (path.startsWith(UPLOAD_PREFIX)) return path;
  const filename = path.replace(/^\/uploads\/listings\//, "");
  return `${UPLOAD_PREFIX}${filename}`;
}

export function listingUploadPublicPath(filename: string): string {
  return `${UPLOAD_PREFIX}${filename}`;
}

export const LISTING_UPLOAD_PREFIX = UPLOAD_PREFIX;
