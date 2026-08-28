/**
 * Bundle upsell logic for the "Kit Collagène Inside & Outside" promotion.
 *
 * The discount is 49 MAD per matched VelvaStretch + CollaGlow pair.
 * Formula: discount = 49 × min(vsQty, cgQty)
 */

export const BUNDLE_DISCOUNT = 49;
export const COLLAGLOW_SLUG = "collaglow";
export const VELVASTRETCH_SLUG = "velvastretch";

export type UpsellType =
  | { eligible: false }
  | { eligible: true; type: "add_missing"; missing: string; missingName: string; discount: number }
  | { eligible: true; type: "apply_discount"; discount: number };

/**
 * Determine whether the customer qualifies for the bundle upsell.
 *
 * Conditions:
 *  - Has CollaGlow only  → propose VelvaStretch
 *  - Has VelvaStretch only → propose CollaGlow
 *  - Has BOTH → communicate the savings
 *  - Has neither → no popup
 */
export function getUpsellInfo(
  cartItems: { slug: string; qty: number }[],
  productNames: Record<string, string>
): UpsellType {
  const vsQty = cartItems.filter((i) => i.slug === VELVASTRETCH_SLUG).reduce((s, i) => s + i.qty, 0);
  const cgQty = cartItems.filter((i) => i.slug === COLLAGLOW_SLUG).reduce((s, i) => s + i.qty, 0);
  const hasV = vsQty > 0;
  const hasC = cgQty > 0;

  if (!hasV && !hasC) return { eligible: false };

  if (hasV && hasC) {
    const matchedPairs = Math.min(vsQty, cgQty);
    return {
      eligible: true,
      type: "apply_discount",
      discount: matchedPairs * BUNDLE_DISCOUNT,
    };
  }

  if (hasC && !hasV) {
    return {
      eligible: true,
      type: "add_missing",
      missing: VELVASTRETCH_SLUG,
      missingName: productNames[VELVASTRETCH_SLUG] || "VelvaStretch™",
      discount: BUNDLE_DISCOUNT,
    };
  }

  if (hasV && !hasC) {
    return {
      eligible: true,
      type: "add_missing",
      missing: COLLAGLOW_SLUG,
      missingName: productNames[COLLAGLOW_SLUG] || "CollaGlow™",
      discount: BUNDLE_DISCOUNT,
    };
  }

  return { eligible: false };
}
