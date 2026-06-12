import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "listings");
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function saveListingImage(file: File): Promise<string | { error: string }> {
  if (!file || file.size === 0) return { error: "No file provided." };
  if (file.size > MAX_BYTES) return { error: "Image must be under 5 MB." };
  if (!ALLOWED.has(file.type)) return { error: "Use JPG, PNG, WebP, or GIF." };

  const ext =
    file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : file.type === "image/gif" ? "gif" : "jpg";
  const filename = `${randomUUID()}.${ext}`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(join(UPLOAD_DIR, filename), buffer);
  return `/uploads/listings/${filename}`;
}
