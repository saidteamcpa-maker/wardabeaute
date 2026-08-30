/**
 * lib/orders/submitOrder.ts
 * Client-side helper to submit an order (COD) with validation + webhooks.
 *
 * Flow:
 *  1. Honeypot check (spam bots fill hidden "website" field → throw)
 *  2. Phone validation via isValidMaPhone (regex 0[5-7]XXXXXXXX) + normalization
 *  3. POST to /api/orders (canonical order creation)
 *  4. Fire-and-forget to ORDER_WEBHOOK_URL / SHEETS_WEBHOOK_URL (if configured)
 *
 * TODOs for wiring:
 *  - TODO: Wire ORDER_WEBHOOK_URL to your n8n / Zapier / SpaceSeller webhook (set env var ORDER_WEBHOOK_URL)
 *  - TODO: Wire SHEETS_WEBHOOK_URL to Google Sheets Apps Script webhook (set env var SHEETS_WEBHOOK_URL)
 *  - TODO: Confirm /api/orders route exists and expects { productSlug, offer, name, phone, city, address }
 *  - TODO: Map `offer` strings to qty/price via PRICES from @/content/wardaContent if backend needs qty
 *  - TODO: Add analytics pixel events (Meta/TikTok) on successful submit if NEXT_PUBLIC_PIXELS_ENABLED
 *  - TODO: Add rate-limit / reCAPTCHA if spam increases
 */

import { isValidMaPhone, normalizeMaPhone } from "@/lib/phone";
import { ORDER_WEBHOOK_URL, SHEETS_WEBHOOK_URL } from "@/lib/config";

export interface SubmitOrderData {
  /** Offer key e.g. "single" | "duo" | "triple" | "duoXL" — must match PRICES keys */
  offer: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  /** Honeypot field — hidden input named "website"; must be empty */
  honeypot?: string;
  /** Product slug: velvastretch | silkstop | collaglow | kit-collagene */
  productSlug: string;
  /** Optional extras forwarded to backend */
  email?: string;
  notes?: string;
}

export interface SubmitOrderResult {
  ok: boolean;
  reference?: string;
  message?: string;
}

/**
 * Validate honeypot, validate + normalize phone, POST to /api/orders,
 * then fire-and-forget to external webhooks.
 * Throws on validation failure; returns fetch result otherwise.
 */
export async function submitOrder(data: SubmitOrderData): Promise<SubmitOrderResult> {
  const { offer, name, phone, city, address, honeypot, productSlug } = data;

  // 1) Honeypot — if filled, it's a bot → abort
  // The form should render: <input name="website" class="hidden" tabIndex={-1} autoComplete="off" />
  if (honeypot && honeypot.trim().length > 0) {
    throw new Error("Spam detected (honeypot filled).");
  }

  // 2) Basic required-field checks
  if (!name || !name.trim()) throw new Error("Nom complet requis.");
  if (!city || !city.trim()) throw new Error("Ville requise.");
  if (!address || !address.trim()) throw new Error("Adresse requise.");
  if (!offer || !offer.trim()) throw new Error("Offre requise.");
  if (!productSlug || !productSlug.trim()) throw new Error("Produit requis.");

  // 3) Phone validation — strict MA regex 0[5-7]XXXXXXXX
  const normalizedPhone = normalizeMaPhone(phone);
  if (!isValidMaPhone(normalizedPhone)) {
    throw new Error("Numéro marocain invalide. Ex: 0612345678 ou 0712345678");
  }

  const payload = {
    productSlug: productSlug.trim(),
    offer: offer.trim(),
    name: name.trim(),
    phone: normalizedPhone,
    city: city.trim(),
    address: address.trim(),
    // Optional passthrough
    ...(data.email ? { email: data.email.trim() } : {}),
    ...(data.notes ? { notes: data.notes.trim() } : {}),
  };

  // 4) Canonical order creation — POST to /api/orders
  // TODO: Confirm this endpoint matches your backend (currently frontend/app/api/orders/route.ts if exists)
  let apiResult: SubmitOrderResult;
  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Erreur API /api/orders: ${res.status}`);
    }

    // Try to parse JSON; fallback to { ok: true }
    try {
      apiResult = (await res.json()) as SubmitOrderResult;
    } catch {
      apiResult = { ok: true };
    }
  } catch (err) {
    // Re-throw so caller can show error UI
    throw err instanceof Error ? err : new Error("Échec de la commande.");
  }

  // 5) Fire-and-forget external webhooks — do NOT block UI, do NOT throw on failure
  // TODO: Wire ORDER_WEBHOOK_URL = process.env.ORDER_WEBHOOK_URL (e.g. n8n, Make, SpaceSeller)
  if (ORDER_WEBHOOK_URL) {
    fetch(ORDER_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, source: "warda-site", timestamp: new Date().toISOString() }),
      keepalive: true,
    }).catch(() => {
      // Silently ignore — webhook failure should not fail the order
      // TODO: Optionally log to Sentry / analytics
    });
  } else {
    // TODO: Set ORDER_WEBHOOK_URL in .env to enable external order forwarding
  }

  // TODO: Wire SHEETS_WEBHOOK_URL = process.env.SHEETS_WEBHOOK_URL (Google Sheets Apps Script)
  if (SHEETS_WEBHOOK_URL) {
    fetch(SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, source: "warda-site", timestamp: new Date().toISOString() }),
      keepalive: true,
    }).catch(() => {
      // Silently ignore
    });
  } else {
    // TODO: Set SHEETS_WEBHOOK_URL in .env to enable Google Sheets logging
  }

  return apiResult;
}

// -----------------------------------------------------------------------------
// Utility: WhatsApp deep link helper (optional, for "Commander sur WhatsApp" CTA)
// -----------------------------------------------------------------------------
export function buildWhatsAppLink(opts: { phone: string; productSlug: string; offer: string; name?: string }): string {
  const base = `https://wa.me/${opts.phone.replace(/[^0-9]/g, "")}`;
  const text = encodeURIComponent(
    `Salam, je veux commander ${opts.productSlug} — offre ${opts.offer}${opts.name ? ` (nom: ${opts.name})` : ""}. Paiement à la livraison.`
  );
  return `${base}?text=${text}`;
}
