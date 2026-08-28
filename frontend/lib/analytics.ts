import { prisma } from "@/lib/db";

export type Range = "7d" | "30d" | "90d" | "all";

const ACTIVE = ["confirmed", "preparing", "shipped", "out_for_delivery", "delivered", "paid"];
const LOST = ["canceled", "cancelled", "returned"];

function rangeDate(range: Range): Date | null {
  if (range === "all") return null;
  const days = { "7d": 7, "30d": 30, "90d": 90 }[range] ?? 30;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export interface Overview {
  range: Range;
  totalOrders: number;
  revenuePotential: number;
  revenueCollected: number;
  aov: number;
  statusCounts: Record<string, number>;
  confirmationRate: number;
  deliveryRate: number;
  rtoRate: number;
  pageViews: number;
  addToCarts: number;
  beginCheckouts: number;
  conversionRate: number;
}

export async function getOverview(range: Range): Promise<Overview> {
  const from = rangeDate(range);
  const where = from ? { createdAt: { gte: from } } : {};

  const orders = await prisma.order.findMany({
    where,
    select: { createdAt: true, total: true, status: true },
  });

  const statusCounts: Record<string, number> = {};
  let revenuePotential = 0;
  let revenueCollected = 0;
  let activeCount = 0;
  let deliveredCount = 0;
  let returnedCount = 0;
  let nonLostCount = 0;

  for (const o of orders) {
    statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1;
    if (ACTIVE.includes(o.status)) {
      revenuePotential += o.total;
      activeCount += 1;
    }
    if (o.status === "delivered" || o.status === "paid") {
      revenueCollected += o.total;
      deliveredCount += 1;
    }
    if (o.status === "returned") returnedCount += 1;
    if (!LOST.includes(o.status)) nonLostCount += 1;
  }

  const totalOrders = orders.length;
  const aov = nonLostCount > 0 ? Math.round(orders.filter((o) => !LOST.includes(o.status)).reduce((s, o) => s + o.total, 0) / nonLostCount) : 0;

  const evWhere = from ? { timestamp: { gte: from } } : {};
  const [pv, atc, bc] = await Promise.all([
    prisma.analyticsEvent.count({ where: { ...evWhere, eventType: "page_view" } }),
    prisma.analyticsEvent.count({ where: { ...evWhere, eventType: "add_to_cart" } }),
    prisma.analyticsEvent.count({ where: { ...evWhere, eventType: "begin_checkout" } }),
  ]);

  return {
    range,
    totalOrders,
    revenuePotential,
    revenueCollected,
    aov,
    statusCounts,
    confirmationRate: totalOrders > 0 ? activeCount / totalOrders : 0,
    deliveryRate: totalOrders > 0 ? deliveredCount / totalOrders : 0,
    rtoRate: deliveredCount + returnedCount > 0 ? returnedCount / (deliveredCount + returnedCount) : 0,
    pageViews: pv,
    addToCarts: atc,
    beginCheckouts: bc,
    conversionRate: pv > 0 ? totalOrders / pv : 0,
  };
}

export interface SeriesPoint {
  date: string;
  revenue: number;
  orders: number;
  pageViews: number;
}

export async function getSeries(range: Range): Promise<SeriesPoint[]> {
  const from = rangeDate(range);
  const oWhere = from ? { createdAt: { gte: from } } : {};
  const orders = await prisma.order.findMany({
    where: oWhere,
    select: { createdAt: true, total: true, status: true },
  });
  const evWhere = from ? { timestamp: { gte: from } } : {};
  const events = await prisma.analyticsEvent.findMany({
    where: { ...evWhere, eventType: "page_view" },
    select: { timestamp: true },
  });

  const map = new Map<string, SeriesPoint>();
  for (const o of orders) {
    const k = dayKey(o.createdAt);
    if (!map.has(k)) map.set(k, { date: k, revenue: 0, orders: 0, pageViews: 0 });
    const p = map.get(k)!;
    p.orders += 1;
    if (ACTIVE.includes(o.status)) p.revenue += o.total;
  }
  for (const e of events) {
    const k = dayKey(e.timestamp);
    if (!map.has(k)) map.set(k, { date: k, revenue: 0, orders: 0, pageViews: 0 });
    map.get(k)!.pageViews += 1;
  }
  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export interface BreakdownRow {
  key: string;
  label: string;
  count: number;
  revenue: number;
}

export async function getSources(range: Range): Promise<BreakdownRow[]> {
  const from = rangeDate(range);
  const where = from ? { createdAt: { gte: from } } : {};
  const orders = await prisma.order.findMany({ where, select: { source: true, total: true, status: true } });
  const map = new Map<string, BreakdownRow>();
  for (const o of orders) {
    const key = o.source || "direct";
    if (!map.has(key)) map.set(key, { key, label: key, count: 0, revenue: 0 });
    const r = map.get(key)!;
    r.count += 1;
    if (ACTIVE.includes(o.status)) r.revenue += o.total;
  }
  return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
}

export async function getDevices(range: Range): Promise<BreakdownRow[]> {
  const from = rangeDate(range);
  const where = from ? { createdAt: { gte: from } } : {};
  const orders = await prisma.order.findMany({ where, select: { device: true, total: true, status: true } });
  const map = new Map<string, BreakdownRow>();
  for (const o of orders) {
    const key = o.device || "inconnu";
    if (!map.has(key)) map.set(key, { key, label: key, count: 0, revenue: 0 });
    const r = map.get(key)!;
    r.count += 1;
    if (ACTIVE.includes(o.status)) r.revenue += o.total;
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
}

export interface ProductRow {
  slug: string;
  name: string;
  units: number;
  revenue: number;
  orders: number;
}

export async function getProducts(range: Range): Promise<ProductRow[]> {
  const from = rangeDate(range);
  const where = from ? { createdAt: { gte: from } } : {};
  const orders = await prisma.order.findMany({
    where,
    select: { items: { select: { slug: true, name: true, qty: true, unitPrice: true } } },
  });
  const map = new Map<string, ProductRow>();
  const orderHas = new Map<string, Set<string>>();
  for (const o of orders) {
    const seen = new Set<string>();
    for (const it of o.items) {
      if (!map.has(it.slug)) map.set(it.slug, { slug: it.slug, name: it.name, units: 0, revenue: 0, orders: 0 });
      const r = map.get(it.slug)!;
      r.units += it.qty;
      r.revenue += it.qty * it.unitPrice;
      if (!seen.has(it.slug)) {
        seen.add(it.slug);
        r.orders += 1;
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
}

export interface CodFunnel {
  pageViews: number;
  addToCarts: number;
  beginCheckouts: number;
  orders: number;
  confirmed: number;
  delivered: number;
}

export async function getCodFunnel(range: Range): Promise<CodFunnel> {
  const ov = await getOverview(range);
  const confirmed = ov.statusCounts["confirmed"] ?? 0;
  const delivered = (ov.statusCounts["delivered"] ?? 0) + (ov.statusCounts["paid"] ?? 0);
  return {
    pageViews: ov.pageViews,
    addToCarts: ov.addToCarts,
    beginCheckouts: ov.beginCheckouts,
    orders: ov.totalOrders,
    confirmed: confirmed + (ov.statusCounts["preparing"] ?? 0) + (ov.statusCounts["shipped"] ?? 0) + (ov.statusCounts["out_for_delivery"] ?? 0) + delivered,
    delivered,
  };
}

export interface CityRow {
  city: string;
  orders: number;
  revenue: number;
  delivered: number;
  returned: number;
  deliveryRate: number;
  rtoRate: number;
  confirmationRate: number;
}

export interface CustomerRow {
  phone: string;
  orders: number;
  revenue: number;
}

export interface Audience {
  totalCustomers: number;
  repeatCustomers: number;
  repeatRate: number;
  avgLtv: number;
  cities: CityRow[];
  topCustomers: CustomerRow[];
}

export async function getAudience(range: Range): Promise<Audience> {
  const from = rangeDate(range);
  const where = from ? { createdAt: { gte: from } } : {};
  const orders = await prisma.order.findMany({ where, select: { phone: true, city: true, total: true, status: true } });

  const byPhone = new Map<string, CustomerRow>();
  const byCity = new Map<string, { city: string; orders: number; revenue: number; delivered: number; returned: number; active: number }>();
  let revenueNonLost = 0;

  for (const o of orders) {
    if (!byPhone.has(o.phone)) byPhone.set(o.phone, { phone: o.phone, orders: 0, revenue: 0 });
    const p = byPhone.get(o.phone)!;
    p.orders += 1;
    p.revenue += o.total;

    const c = o.city || "Inconnue";
    if (!byCity.has(c)) byCity.set(c, { city: c, orders: 0, revenue: 0, delivered: 0, returned: 0, active: 0 });
    const cc = byCity.get(c)!;
    cc.orders += 1;
    cc.revenue += o.total;
    if (o.status === "delivered" || o.status === "paid") cc.delivered += 1;
    if (o.status === "returned") cc.returned += 1;
    if (ACTIVE.includes(o.status)) cc.active += 1;

    if (!LOST.includes(o.status)) revenueNonLost += o.total;
  }

  const totalCustomers = byPhone.size;
  const repeatCustomers = Array.from(byPhone.values()).filter((x) => x.orders > 1).length;
  const avgLtv = totalCustomers > 0 ? Math.round(revenueNonLost / totalCustomers) : 0;

  const cities: CityRow[] = Array.from(byCity.values())
    .map((c) => ({
      city: c.city,
      orders: c.orders,
      revenue: c.revenue,
      delivered: c.delivered,
      returned: c.returned,
      deliveryRate: c.orders > 0 ? c.delivered / c.orders : 0,
      rtoRate: c.delivered + c.returned > 0 ? c.returned / (c.delivered + c.returned) : 0,
      confirmationRate: c.orders > 0 ? c.active / c.orders : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  const topCustomers = Array.from(byPhone.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 10);

  return {
    totalCustomers,
    repeatCustomers,
    repeatRate: totalCustomers > 0 ? repeatCustomers / totalCustomers : 0,
    avgLtv,
    cities,
    topCustomers,
  };
}

export interface CampaignRow {
  key: string;
  label: string;
  orders: number;
  revenue: number;
  aov: number;
  confirmationRate: number;
}

export async function getCampaigns(range: Range): Promise<CampaignRow[]> {
  const from = rangeDate(range);
  const where = from ? { createdAt: { gte: from } } : {};
  const orders = await prisma.order.findMany({ where, select: { utmCampaign: true, total: true, status: true } });
  const map = new Map<string, { key: string; label: string; orders: number; revenue: number; active: number; nonLostTotal: number; nonLost: number }>();
  for (const o of orders) {
    const key = o.utmCampaign || "direct";
    if (!map.has(key)) map.set(key, { key, label: key, orders: 0, revenue: 0, active: 0, nonLostTotal: 0, nonLost: 0 });
    const r = map.get(key)!;
    r.orders += 1;
    if (ACTIVE.includes(o.status)) {
      r.revenue += o.total;
      r.active += 1;
    }
    if (!LOST.includes(o.status)) {
      r.nonLostTotal += o.total;
      r.nonLost += 1;
    }
  }
  return Array.from(map.values())
    .map((r) => ({
      key: r.key,
      label: r.label,
      orders: r.orders,
      revenue: r.revenue,
      aov: r.nonLost > 0 ? Math.round(r.nonLostTotal / r.nonLost) : 0,
      confirmationRate: r.orders > 0 ? r.active / r.orders : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

export interface AnalyticsBundle {
  overview: Overview;
  series: SeriesPoint[];
  sources: BreakdownRow[];
  devices: BreakdownRow[];
  products: ProductRow[];
  funnel: CodFunnel;
  audience: Audience;
  campaigns: CampaignRow[];
}
