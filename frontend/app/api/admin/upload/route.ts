import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

const ALLOWED = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
  "image/heic",
  "image/heif",
]);
const EXT: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "image/avif": ".avif",
  "image/heic": ".heic",
  "image/heif": ".heif",
};
const EXT_BY_NAME: Record<string, string> = {
  ".png": ".png",
  ".jpg": ".jpg",
  ".jpeg": ".jpg",
  ".webp": ".webp",
  ".gif": ".gif",
  ".svg": ".svg",
  ".avif": ".avif",
  ".heic": ".heic",
  ".heif": ".heif",
};
const MAX_BYTES = 8 * 1024 * 1024; // 8 Mo

function extFromName(name: string): string {
  const dot = name.lastIndexOf(".");
  if (dot < 0) return "";
  return name.slice(dot).toLowerCase();
}

export async function POST(req: NextRequest) {
  const session = await getAdminSessionFromCookies();
  if (!session) return NextResponse.json({ error: "Non autorisé — reconnectez-vous" }, { status: 401 });
  let form: FormData | null = null;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Formulaire invalide" }, { status: 400 });
  }
  const file = form?.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
  }
  const f = file as File;
  // Some browsers/OS (notably iOS) send "" for HEIC or unknown types — fall back to filename extension.
  let mime: string = (f.type || "").toLowerCase().trim();
  let ext = EXT[mime];
  if (!mime || !ALLOWED.has(mime)) {
    const byName = EXT_BY_NAME[extFromName((f as any).name || "")];
    if (byName) {
      // Accept based on extension when MIME is unknown or generic.
      ext = byName;
      if (!mime) mime = `image/${byName.slice(1)}`;
    } else if (!ALLOWED.has(mime)) {
      return NextResponse.json({ error: `Type non autorisé: ${f.type || "inconnu"} (${(f as any).name || "sans nom"})` }, { status: 400 });
    }
  }
  if (!ext) ext = EXT[mime] || extFromName((f as any).name || "") || ".img";
  const buf = Buffer.from(await f.arrayBuffer());
  if (buf.length === 0) {
    return NextResponse.json({ error: "Fichier vide" }, { status: 400 });
  }
  if (buf.length > MAX_BYTES) {
    return NextResponse.json({ error: `Fichier trop volumineux (${(buf.length / 1024 / 1024).toFixed(1)} Mo / 8 Mo max)` }, { status: 400 });
  }
  const safeName = `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  try {
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, safeName), buf);
  } catch (e: any) {
    console.error("[upload] write failed:", e?.message || e);
    return NextResponse.json({ error: `Écriture échouée: ${e?.message || "permission"}` }, { status: 500 });
  }
  return NextResponse.json({ url: `/uploads/${safeName}` });
}
