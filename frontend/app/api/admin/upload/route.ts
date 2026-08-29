import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

const ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"];
const EXT: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
};

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
  if (!ALLOWED.includes(f.type)) {
    return NextResponse.json({ error: `Type non autorisé: ${f.type}` }, { status: 400 });
  }
  const buf = Buffer.from(await f.arrayBuffer());
  if (buf.length === 0) {
    return NextResponse.json({ error: "Fichier vide" }, { status: 400 });
  }
  if (buf.length > 3 * 1024 * 1024) {
    return NextResponse.json({ error: "Fichier trop volumineux (3 Mo max)" }, { status: 400 });
  }
  const safeName = `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}${EXT[f.type] || ".img"}`;
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
