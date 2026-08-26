import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromCookies } from "@/lib/auth";
import { getOverview, getSeries, getSources, getDevices, getProducts, getCodFunnel, getAudience, getCampaigns, type Range } from "@/lib/analytics";

const RANGES: Range[] = ["7d", "30d", "90d", "all"];

export async function GET(req: NextRequest) {
  const session = await getAdminSessionFromCookies();
  if (!session) {
    return NextResponse.json({ detail: "unauthorized" }, { status: 401 });
  }
  const rangeParam = req.nextUrl.searchParams.get("range") as Range | null;
  const range: Range = rangeParam && RANGES.includes(rangeParam) ? rangeParam : "30d";

  const [overview, series, sources, devices, products, funnel, audience, campaigns] = await Promise.all([
    getOverview(range),
    getSeries(range),
    getSources(range),
    getDevices(range),
    getProducts(range),
    getCodFunnel(range),
    getAudience(range),
    getCampaigns(range),
  ]);

  return NextResponse.json({ overview, series, sources, devices, products, funnel, audience, campaigns });
}
