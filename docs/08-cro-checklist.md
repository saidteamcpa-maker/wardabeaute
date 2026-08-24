# 08 — CRO Checklist (pre-launch quality gate)

Launch only when ALL are done. 30 points.

## CRITICAL (blocks launch)
- [ ] Mobile-first: tested at 360 / 390 / 414 px
- [ ] LCP < 2.5s on Slow 4G (Lighthouse)
- [ ] Hero + CTA above fold on mobile (no scroll to see CTA)
- [ ] Cart is a DRAWER (no /cart page)
- [ ] Checkout is a POPUP (no separate checkout page)
- [ ] COD form ≤ 5 fields (name, phone, city, address, [postal opt])
- [ ] Floating WhatsApp button bottom-right, z-9999, always visible
- [ ] Announcement bar rotates correctly on mobile
- [ ] RTL Arabic blocks render correctly (real Android Chrome)
- [ ] Trust badges visible on every PDP, before AND after CTA
- [ ] Confirmation page loads instantly after submit (no spinner hang)
- [ ] Stock counter near CTA (honest range)
- [ ] Phone validation: Morocco regex + example "0612345678"
- [ ] Geo-gate works: non-Morocco / VPN blocked; 0666666666 whitelisted

## HIGH (strongly required)
- [ ] Before/after images on every PDP (top conversion element)
- [ ] Testimonials with photos (Moroccan women, not stock)
- [ ] Real-time social-proof toast ("Fatima de Casa vient de commander")
- [ ] Price struck-through (old vs current) — anchoring
- [ ] Product AR name beside FR name
- [ ] FAQ on every PDP (cuts bounce 15–25%)
- [ ] Urgency near CTA (stock/timer/copy)
- [ ] "Livraison gratuite" stated ≥3x per PDP
- [ ] 99 MAD upsell shows 10–15s after submit, only place discounted
- [ ] Post-purchase cross-sell on thank-you (original prices)
- [ ] Bundle CTA on home + PDP (Body Confidence Kit)

## MEDIUM
- [ ] Meta Pixel: PageView, AddToCart, InitiateCheckout, Purchase
- [ ] TikTok Pixel: same 4 events
- [ ] Meta + TikTok CAPI with shared event_id dedup
- [ ] Pixels deferred (afterInteractive)
- [ ] GA4 with form-submit conversion
- [ ] 404 page with product recos
- [ ] Smooth scroll between sections (mobile)
- [ ] Image alt text AR + FR
- [ ] Sticky bottom CTA bar on PDP (mobile)
- [ ] Tap targets ≥ 48px; inputs font ≥ 16px
- [ ] COD safety reassurance ("مكتعطيش درهم حتى توصلك") near every CTA
- [ ] 4-week guarantee badge near CTA
- [ ] Order bump checkbox in checkout popup
- [ ] WhatsApp deep-link confirm message on thank-you

## AOV boosters (verify present)
- [ ] Per-product 1/2/3 piece offers with rising savings
- [ ] Cart-drawer cross-sells (original prices)
- [ ] In-page upsell blocks (Velva↔CollaGlow, Silk↔Velva)
- [ ] Body Confidence Kit = 650 vs 827
- [ ] 99 MAD upsell post-submit
