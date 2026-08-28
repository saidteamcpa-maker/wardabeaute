/**
 * Bundle upsell logic for the "Kit Collagène Inside & Outside" promotion.
 *
 * The 49 MAD discount applies when the cart contains BOTH CollaGlow and
 * VelvaStretch — even if kit-collagene or SilkStop are also present.
 */

export const BUNDLE_DISCOUNT = 49;
export const BUNDLE_PRICE = 549; // 319 + 279 - 49
export const COLLAGLOW_SLUG = "collaglow";
export const VELVASTRETCH_SLUG = "velvastretch";

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

  if (!hasV && !hasC) return { eligible: false };

  const originalTotal = 319 + 279;

  if (hasV && hasC) {
    return {
      eligible: true,
      type: "apply_discount",
      originalTotal,
      bundleTotal: BUNDLE_PRICE,
    };
  }

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
