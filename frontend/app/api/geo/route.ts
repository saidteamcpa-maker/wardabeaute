import { NextRequest, NextResponse } from "next/server";
import { isMorocco } from "@/lib/geo";

export async function POST(req: NextRequest) {
  const morocco = await isMorocco(req);
  return NextResponse.json({ allowed: true, is_morocco: morocco });
}
