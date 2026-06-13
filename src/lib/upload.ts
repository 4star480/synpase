import { randomUUID } from "crypto";
import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { listingUploadPublicPath } from "./listing-upload-path";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "listings");
const BLOB_STORE = "listing-images";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function extensionForType(type: string): string {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return "jpg";
}

function useBlobStorage(): boolean {
  if (process.env.USE_LOCAL_UPLOADS === "1") return false;
  return (
    process.env.NETLIFY === "true" ||
    process.env.NETLIFY === "1" ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
    Boolean(process.env.NETLIFY_BLOBS_CONTEXT)
  );
}

function safeFilename(filename: string): string | null {
  if (!/^[a-f0-9-]+\.(jpg|jpeg|png|webp|gif)$/i.test(filename)) return null;
  return filename;
}

async function writeBlob(key: string, data: ArrayBuffer, contentType: string) {
  const { getStore } = await import("@netlify/blobs");
  const store = getStore(BLOB_STORE);
  await store.set(key, data, { metadata: { contentType } });
}

async function readBlob(key: string): Promise<{ buffer: Buffer; contentType: string } | null> {
  const { getStore } = await import("@netlify/blobs");
  const store = getStore(BLOB_STORE);
  const result = await store.getWithMetadata(key, { type: "arrayBuffer" });
  if (!result?.data) return null;
  const contentType =
    (typeof result.metadata?.contentType === "string" && result.metadata.contentType) || "image/jpeg";
  return { buffer: Buffer.from(result.data), contentType };
}

export async function saveListingImage(file: File): Promise<string | { error: string }> {
  if (!file || file.size === 0) return { error: "No file provided." };
  if (file.size > MAX_BYTES) return { error: "Image must be under 5 MB." };
  if (!ALLOWED.has(file.type)) return { error: "Use JPG, PNG, WebP, or GIF." };

  const filename = `${randomUUID()}.${extensionForType(file.type)}`;
  const bytes = await file.arrayBuffer();

  if (useBlobStorage()) {
    try {
      await writeBlob(filename, bytes, file.type);
    } catch {
      return { error: "Image upload failed. Try again in a moment." };
    }
  } else {
    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(join(UPLOAD_DIR, filename), Buffer.from(bytes));
  }

  return listingUploadPublicPath(filename);
}

export async function readListingImage(
  filename: string,
): Promise<{ buffer: Buffer; contentType: string } | null> {
  const safe = safeFilename(filename);
  if (!safe) return null;

  if (useBlobStorage()) {
    try {
      return await readBlob(safe);
    } catch {
      return null;
    }
  }

  const diskPath = join(UPLOAD_DIR, safe);
  if (!existsSync(diskPath)) return null;

  const buffer = await readFile(diskPath);
  const ext = safe.split(".").pop()?.toLowerCase();
  const contentType =
    ext === "png"
      ? "image/png"
      : ext === "webp"
        ? "image/webp"
        : ext === "gif"
          ? "image/gif"
          : "image/jpeg";
  return { buffer, contentType };
}
