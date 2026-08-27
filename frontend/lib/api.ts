const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ApiProduct {
  slug: string;
  name: string;
  ar_sub: string;
  price: number;
  old_price: number;
  badge: string;
  stars: number;
  reviews: number;
}

export async function getProducts(): Promise<ApiProduct[]> {
  const res = await fetch(`${API_URL}/api/products`);
  if (!res.ok) throw new Error("products fetch failed");
  return res.json();
}

export async function checkGeo(): Promise<{ allowed: boolean; is_morocco: boolean }> {
  try {
    const res = await fetch(`${API_URL}/api/geo`, { method: "POST" });
    const data = await res.json();
    return { allowed: !!data.allowed, is_morocco: !!data.is_morocco };
  } catch {
    return { allowed: true, is_morocco: true }; // degraded: allow
  }
}

export interface CreateOrderPayload {
  customer_name: string;
  phone: string;
  city: string;
  items: { slug: string; qty: number }[];
  upsell: boolean;
  idempotency_key: string;
}

export async function createOrder(payload: CreateOrderPayload): Promise<{ id: string; total: number; discount?: number }> {
  // Try backend first (canonical — has Sheets, CAPI, geo). Fall back to local
  // Next.js route if backend is unreachable (e.g. CORS/dns in dev or outage).
  const backends = [`${API_URL}/api/orders`, `/api/orders`];
  let lastErr: any = null;
  for (const url of backends) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 403) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.detail === "orders_only_morocco" ? "morocco_only" : "blocked");
      }
      if (res.status === 422) throw new Error("invalid_phone");
      if (!res.ok) throw new Error("order_failed");
      const data = await res.json();
      // Normalize: backend now returns reference as id, frontend already does the same
      if (data?.id) return data;
      // Unexpected shape — try next
      lastErr = new Error("order_failed");
      continue;
    } catch (e: any) {
      // For the first (backend) URL, swallow network errors and try fallback
      if (url === backends[0] && e?.message !== "morocco_only" && e?.message !== "blocked" && e?.message !== "invalid_phone") {
        lastErr = e;
        continue;
      }
      throw e;
    }
  }
  throw lastErr || new Error("order_failed");
}

export async function addUpsell(orderId: string): Promise<void> {
  await fetch(`${API_URL}/api/orders/${orderId}/upsell`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ add: true }),
  });
}
