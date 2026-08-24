# 06 — Checkout · Cart Drawer · Upsell · Thank-You

This is the conversion core. Implement exactly.

## 1. Cart = DRAWER (no cart page)
- `useCart` zustand store: `items: [{slug, qty, offerTier}]`, `add(item)`, `remove`, `updateQty`, `open/close`.
- Clicking a product-page CTA "add offer to cart" → adds selected offer tier, **opens CartDrawer**.
- CartDrawer (right slide-in): line items, subtotal, **cross-sell row** (3 other products at original
  prices — same price as PDP, no discount), "Commander" CTA → opens CheckoutPopup.
- Cross-sells shown in drawer AND at bottom of every product page (same original prices).

## 2. Offer tiers per product (quantity selector on PDP)
- VelvaStretch™: 1=279, 2=499, 3=699 MAD
- SilkStop™: 1=229, 2=419, 3=599 MAD
- CollaGlow™: 1=319, 2=569, 3=799 MAD
- CTA label: "اطلبي الآن — الدفع عند الاستلام" (adds chosen tier, opens drawer).

## 3. CheckoutPopup (modal over current page)
Steps:
1. **Order summary** (items, subtotal, free delivery note).
2. **Form** (react-hook-form + zod):
   - Nom complet * (min 2)
   - Téléphone * — example text below input: "Ex: 0612345678" ; validate `^0(5|6|7|8)[0-9]{8}$`
   - Ville * (dropdown: Casablanca, Rabat, Marrakech, Fès, Tanger, Agadir, Meknès, Kénitra, Oujda, autres…)
   - Adresse complète *
   - Code postal (optional)
3. **Order bump** checkbox (contextual, from strategy 7.3): e.g. for VelvaStretch buyer:
   "☐ YES — أضيفي CollaGlow™ بـ 269 MAD (بدل 319) — نتائج أسرع"
4. **Trust + scarcity** inside popup: "⚡ 47 personnes regardent", "📦 Fatima de Casa vient de commander",
   "🔒 Vos données protégées", "💳 الدفع عند الاستلام".
5. CTA: "🌹 Confirmer ma commande — Paiement à la livraison".
6. On submit: validate → call `POST /api/geo` (double gate) → `POST /api/orders`.
   - If `403 orders_only_morocco`: show "Désolé, les commandes sont réservées au Maroc 🇲🇦".
   - If `403` VPN: "Accès non autorisé depuis ce réseau."
   - On 200: trigger Meta/TikTok `Purchase` pixel (see 07), then show upsell step.

## 4. Post-submit 99 MAD upsell (10–15s window)
- After successful order, show a focused upsell panel for **10–15 seconds**:
  - Product `upsell-99` (e.g. "Mini VelvaStretch™ 5ml" or branded travel item), price **99 MAD**.
  - Copy: "🎁 Offre exclusive — ajoutez [X] pour seulement 99 MAD (au lieu de 149). 15 secondes."
  - Single CTA "Ajouter + 99 MAD" → `POST /api/orders/{id}/upsell` → updates Sheets row.
  - Auto-countdown; after 15s OR on "Non merci" → redirect to `/confirmation`.
- **This is the ONLY discounted product in the store.** Nowhere else use a discount.

## 5. Thank-You page (`/confirmation`)
- H1: "شكراً {prénom}! طلبيتك مسجلة 🌹"
- Order #WB-XXXX, product list, total MAD, "الدفع عند الاستلام".
- **Delivery reassurance:** "التوصيل خلال 24–48 ساعة" + confirmation rate line
  ("86% de nos clientes confirment sous 4h") for CRO/trust.
- WhatsApp button (floating, deep link `https://wa.me/2126XX...?text=...`).
- **Post-purchase cross-sell:** same original-price products grid ("النساء اللي شراو هاد المنتج شراو أيضاً").
- If upsell was added, show it in summary.

## 6. Webhook payload to Sheets (backend → Apps Script)
Sent as JSON POST; fields match CSV columns (see 10):
```
{
  order_id, date, customer_name, phone, city, address, postal,
  items_json, subtotal, upsell, total, status, country, ip,
  geo_risk, source ("web"), notes
}
```

## 7. CRO details on these surfaces
- CheckoutPopup + ThankYou must reinforce: free delivery, COD safety, 4-week guarantee, stock scarcity.
- Sticky mobile CTA on PDP always visible.
- "Real-time" stock counters: show a believable number (e.g. 23–61) per product; rotate slightly.
- Social-proof toast every ~45s: "📦 {name} de {city} vient de commander".

## 8. Validation rules summary
- Phone: Morocco regex above; show example; reject otherwise (no submit).
- Geo: Morocco IP required (backend enforces; whitelist `0666666666` bypasses).
- No card/payment fields ever.
