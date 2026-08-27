/**
 * Bundle upsell logic for the "Kit Collagène Inside & Outside" promotion.
 *
 * The 49 MAD discount applies ONLY to the CollaGlow + VelvaStretch
 * individual-product combination. The existing kit-collagene product
 * is NOT eligible.
 *
 * All business logic is centralized here — never hardcoded in components.
 */

export const BUNDLE_DISCOUNT = 49;
export const BUNDLE_PRICE = 549; // 319 + 279 - 49
export const COLLAGLOW_SLUG = "collaglow";
export const VELVASTRETCH_SLUG = "velvastretch";
export const KIT_SLUG = "kit-collagene";

export type UpsellType =
  | { eligible: false }
  | { eligible: true; type: "add_missing"; missing: string; missingName: string; originalTotal: number; bundleTotal: number }
  | { eligible: true; type: "apply_discount"; originalTotal: number; bundleTotal: number };

/**
 * Determine whether the customer qualifies for the bundle upsell.
 *
 * Conditions:
 *  - Has CollaGlow only  → propose VelvaStretch
 *  - Has VelvaStretch only → propose CollaGlow
 *  - Has BOTH → communicate the 49 MAD savings
 *  - Has neither / has Kit / has unrelated → no popup
 */
export function getUpsellInfo(
  cartSlugs: string[],
  productNames: Record<string, string>
): UpsellType {
  const hasV = cartSlugs.includes(VELVASTRETCH_SLUG);
  const hasC = cartSlugs.includes(COLLAGLOW_SLUG);
  const hasKit = cartSlugs.includes(KIT_SLUG);

  // Condition 4 & 5: neither product, or has Kit → no popup
  if (hasKit) return { eligible: false };
  if (!hasV && !hasC) return { eligible: false };

  const originalTotal = 319 + 279; // CollaGlow + VelvaStretch without discount

  // Condition 3: already has both → communicate savings
  if (hasV && hasC) {
    return {
      eligible: true,
      type: "apply_discount",
      originalTotal,
      bundleTotal: BUNDLE_PRICE,
    };
  }

  // Condition 1: has CollaGlow only → propose VelvaStretch
  if (hasC && !hasV) {
    return {
      eligible: true,
      type: "add_missing",
      missing: VELVASTRETCH_SLUG,
      missingName: productNames[VELVASTRETCH_SLUG] || "VelvaStretch™",
      originalTotal,
      bundleTotal: BUNDLE_PRICE,
    };
  }

  // Condition 2: has VelvaStretch only → propose CollaGlow
  if (hasV && !hasC) {
    return {
      eligible: true,
      type: "add_missing",
      missing: COLLAGLOW_SLUG,
      missingName: productNames[COLLAGLOW_SLUG] || "CollaGlow™",
      originalTotal,
      bundleTotal: BUNDLE_PRICE,
    };
  }

  return { eligible: false };
}
