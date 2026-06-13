import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { saveListingImage } from "@/lib/upload";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload request." }, { status: 400 });
  }

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Choose an image file first." }, { status: 400 });
  }

  const saved = await saveListingImage(file);
  if (typeof saved === "object") {
    return NextResponse.json({ error: saved.error }, { status: 400 });
  }

  return NextResponse.json({ imagePath: saved });
}
