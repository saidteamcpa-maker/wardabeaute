"""Authoritative catalog + pricing. Server computes totals, never trusts the client."""

PRICES = {
    "velvastretch": {"1": 279, "2": 499, "3": 699},
    "silkstop": {"1": 229, "2": 419, "3": 599},
    "collaglow": {"1": 319, "2": 569, "3": 799},
    "kit-collagene": {"1": 549},
}

UPSELL_99 = 99

# "Kit Collagène Inside & Outside" bundle discount — applied server-side when
# the order contains BOTH velvastretch AND collaglow (individual products only).
# The existing kit-collagene product is NOT eligible for this discount.
CO_COLLAGEN_DISCOUNT = 49

PRODUCT_NAMES = {
    "velvastretch": "VelvaStretch™",
    "silkstop": "SilkStop™",
    "collaglow": "CollaGlow™",
    "kit-collagene": "Kit Collagène Inside & Outside",
    "upsell-99": "Mini Soin Warda (99 MAD)",
}

SEED_PRODUCTS = [
    {
        "id": "velvastretch",
        "name": "VelvaStretch™",
        "ar_sub": "سيروم الكولاجين لعلامات التمدد",
        "price": 279,
        "old_price": 399,
        "badge": "🔥 Bestseller",
        "stars": 4.9,
        "reviews": 847,
    },
    {
        "id": "silkstop",
        "name": "SilkStop™",
        "ar_sub": "زيت إيقاف نمو الشعر بالزيوت الطبيعية",
        "price": 229,
        "old_price": 329,
        "badge": "⭐ Plus Vendu",
        "stars": 4.8,
        "reviews": 1203,
    },
    {
        "id": "collaglow",
        "name": "CollaGlow™",
        "ar_sub": "علكات الكولاجين البحري + حمض الهيالورونيك",
        "price": 319,
        "old_price": 449,
        "badge": "✨ Nouveau",
        "stars": 4.8,
        "reviews": 612,
    },
    {
        "id": "kit-collagene",
        "name": "Kit Collagène Inside & Outside",
        "ar_sub": "الكولاجين من الداخل والخارج",
        "price": 549,
        "old_price": 848,
        "badge": "🔥 Offre Duo",
        "stars": 4.9,
        "reviews": 1031,
    },
]


def unit_price(slug: str, tier: int) -> int:
    """tier is 1/2/3 (quantity). Returns unit price for that tier."""
    table = PRICES.get(slug)
    if not table:
        return 0
    return table.get(str(tier), table["1"])


def compute_total(items, upsell=False) -> tuple:
    subtotal = 0
    lines = []
    for it in items:
        up = unit_price(it.slug, it.qty)
        # up is the PACK price for the chosen tier (qty = number of pieces in the pack).
        line = up
        subtotal += line
        lines.append(
            {
                "slug": it.slug,
                "name": PRODUCT_NAMES.get(it.slug, it.slug),
                "qty": it.qty,
                "unit_price": up,
                "line_total": line,
            }
        )
    upsell_total = UPSELL_99 if upsell else 0

    # "Kit Collagène Inside & Outside" bundle discount: auto-applied when the
    # order contains BOTH velvastretch AND collaglow as individual products.
    # The existing kit-collagene product is NOT eligible — even if both
    # individual products are also present alongside the Kit.
    slugs = [it.slug for it in items]
    has_velva = "velvastretch" in slugs
    has_collaglow = "collaglow" in slugs
    has_kit = "kit-collagene" in slugs
    discount = CO_COLLAGEN_DISCOUNT if (has_velva and has_collaglow and not has_kit) else 0

    total = subtotal + upsell_total - discount
    return subtotal, upsell_total, discount, total, lines
