"""Authoritative catalog + pricing. Server computes totals, never trusts the client."""

PRICES = {
    "velvastretch": {"1": 279, "2": 499, "3": 699},
    "silkstop": {"1": 229, "2": 419, "3": 599},
    "collaglow": {"1": 319, "2": 569, "3": 799},
}

UPSELL_99 = 99

PRODUCT_NAMES = {
    "velvastretch": "VelvaStretch™",
    "silkstop": "SilkStop™",
    "collaglow": "CollaGlow™",
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
    total = subtotal + upsell_total
    return subtotal, upsell_total, total, lines
