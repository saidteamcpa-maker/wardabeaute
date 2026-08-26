import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/store-content";

export const dynamic = "force-dynamic";

export async function GET() {
  const site = await getSiteContent();
  return NextResponse.json({ site });
}
