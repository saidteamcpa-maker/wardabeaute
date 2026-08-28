"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "@/lib/cart";
import { createOrder, checkGeo } from "@/lib/api";
import { track } from "@/lib/pixels";
import { unitPrice } from "@/content/products";
import { useLang } from "@/components/LangProvider";
import { useCatalog } from "@/lib/catalog-context";
import { t } from "@/content/ui";
import { usePageOverride } from "@/lib/use-page-override";
import { UpsellPopup } from "@/components/UpsellPopup";
import { getUpsellInfo } from "@/lib/upsell";
import type { CartItem } from "@/lib/cart";

type FormData = { customer_name: string; phone: string; city: string };

export function CheckoutPopup() {
  const { lang } = useLang();
  const catalog = useCatalog();
  const { items, isCheckoutOpen, closeCheckout, clear } = useCart();
  const router = useRouter();
  const ov = usePageOverride("checkout");
  const Co = (k: string) => (ov ? ov[lang]?.[k] || t(lang, k) : t(lang, k));
  const [step, setStep] = useState<"form" | "upsell" | "error">("form");
  const [errorMsg, setErrorMsg] = useState("");
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const idemRef = useRef<string>("");
  const formDataRef = useRef<FormData | null>(null);
  const [upsellItems, setUpsellItems] = useState<CartItem[] | null>(null);
  const upsellAcceptedRef = useRef(false);

  // Filter stale slugs (old localStorage like bundle-bck) to prevent client crash
  const validItems = useMemo(() => items.filter((i) => i && typeof i.slug === "string" && !!catalog[i.slug]), [items, catalog]);
  // Upsell logic
  const productNames = useMemo(() => {
    const names: Record<string, string> = {};
    for (const [slug, p] of Object.entries(catalog)) {
      names[slug] = p.name;
    }
    return names;
  }, [catalog]);
  const upsellInfo = useMemo(() => getUpsellInfo(validItems, productNames), [validItems, productNames]);

  // Fresh idempotency key each time the checkout is opened
  useEffect(() => {
    if (isCheckoutOpen) {
      idemRef.current =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `idem-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      // Reset state when checkout opens
      setStep("form");
      setOrderId("");
      setErrorMsg("");
      setUpsellItems(null);
      formDataRef.current = null;
      upsellAcceptedRef.current = false;
    }
  }, [isCheckoutOpen]);

  const schema = useMemo(
    () =>
      z.object({
        customer_name: z.string().min(2, Co("co.nameReq")),
        phone: z.string().regex(/^0(6|7)[0-9]{8}$/, Co("co.phoneReq")),
        city: z.string().min(1, Co("co.cityReq")),
      }),
    [lang]
  );

  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const subtotal = validItems.reduce((s, i) => s + unitPrice(i.slug, i.qty, catalog), 0);
  const preDiscountTotal = subtotal;

  useEffect(() => {
    if (isCheckoutOpen) {
      track("InitiateCheckout", {
        value: subtotal,
        currency: "MAD",
        content_ids: validItems.map((i) => i.slug),
      });
    }
  }, [isCheckoutOpen, subtotal, validItems]);

  // Actual order submission (called after upsell resolution or directly)
  const submitOrder = useCallback(
    async (orderItems: CartItem[], formData: FormData) => {
      setLoading(true);
      setErrorMsg("");
      try {
        const geo = await checkGeo();
        if (!geo.allowed) {
          setStep("error");
          setErrorMsg(Co("co.errorMorocco"));
          setLoading(false);
          return;
        }
        const res = await createOrder({
          customer_name: formData.customer_name,
          phone: formData.phone,
          city: formData.city,
          items: orderItems.map((i) => ({ slug: i.slug, qty: i.qty })),
          upsell: false,
          idempotency_key: idemRef.current,
        });
        setOrderId(res.id);
        try {
          sessionStorage.setItem(
            "warda-last-order",
            JSON.stringify({
              id: res.id,
              customer_name: formData.customer_name,
              phone: formData.phone,
              city: formData.city,
              address: formData.city,
              items: orderItems.map((i) => ({
                slug: i.slug,
                name: catalog[i.slug]?.name || i.slug,
                qty: i.qty,
                price: unitPrice(i.slug, i.qty, catalog),
              })),
              total: res.total,
              upsellDiscount: res.discount || 0,
            })
          );
        } catch {}
        track("Purchase", { value: res.total, currency: "MAD", content_ids: orderItems.map((i) => i.slug), orderId: res.id });
        finish(res.id);
      } catch (e: any) {
        setStep("error");
        if (e?.message === "morocco_only") setErrorMsg(Co("co.errorMorocco"));
        else if (e?.message === "invalid_phone") setErrorMsg(Co("co.errorPhone"));
        else if (e?.message === "blocked") setErrorMsg(Co("co.errorBlocked"));
        else setErrorMsg(Co("co.errorGeneric"));
      } finally {
        setLoading(false);
      }
    },
    [catalog, Co]
  );

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    if (validItems.length === 0) {
      setStep("error");
      setErrorMsg(Co("co.errorGeneric"));
      setLoading(false);
      return;
    }
    // Check upsell eligibility
    if (upsellInfo.eligible) {
      // Store form data for later use after upsell resolution
      formDataRef.current = data;
      // If add_missing: prepare items with the missing product added
      if (upsellInfo.type === "add_missing") {
        const existing = validItems.find((i) => i.slug === upsellInfo.missing);
        if (!existing) {
          setUpsellItems([...validItems, { slug: upsellInfo.missing, qty: 1 }]);
        } else {
          setUpsellItems(validItems);
        }
      } else {
        // apply_discount: items stay the same, backend applies discount
        setUpsellItems(validItems);
      }
      setStep("upsell");
      setLoading(false);
      return;
    }
    // No upsell — submit directly
    await submitOrder(validItems, data);
  };

  const handleUpsellAccept = useCallback(async () => {
    if (upsellItems && formDataRef.current) {
      upsellAcceptedRef.current = true;
      await submitOrder(upsellItems, formDataRef.current);
    }
  }, [upsellItems, submitOrder]);

  const handleUpsellReject = useCallback(async () => {
    // Proceed with original items (no upsell)
    if (formDataRef.current) {
      await submitOrder(validItems, formDataRef.current);
    }
  }, [validItems, submitOrder]);

  const finish = (id?: string) => {
    clear();
    const finalId = id || orderId;
    const qs = upsellAcceptedRef.current ? `?id=${finalId}&upsell=1` : `?id=${finalId}`;
    router.push(`/confirmation${qs}`);
  };

  if (!isCheckoutOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-brun/50" onClick={closeCheckout} />
      <div className="relative bg-petal w-full max-w-[480px] max-h-[95vh] overflow-y-auto rounded-t-2xl md:rounded-2xl p-5">
        <button onClick={closeCheckout} className="absolute top-3 right-4 text-2xl text-brun">✕</button>

        {step === "form" && (
          <>
            <h3 className="font-display text-2xl text-profond mb-1">{Co("co.title")}</h3>
            <p className="text-sm text-gris mb-3">
              💳 {Co("co.cod")} · 🚚 24–48h
            </p>

            <div className="text-sm font-body text-brun mb-3 border-b border-brume pb-3">
              {validItems.length === 0 ? (
                <p className="text-sm text-gris py-2">{Co("co.errorGeneric")}</p>
              ) : (
                validItems.map((i) => {
                  const p = catalog[i.slug];
                  if (!p) return null;
                  return (
                    <div key={i.slug} className="flex items-center gap-3 py-1">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-brume shrink-0">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="flex-1">
                        {p.name} × {i.qty}
                      </span>
                      <span>{unitPrice(i.slug, i.qty, catalog)} MAD</span>
                    </div>
                  );
                })
              )}
              <div className="flex justify-between font-medium mt-1">
                <span>{t(lang, "total")}</span>
                <span>{subtotal} MAD</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 font-body">
              <input
                {...register("customer_name")}
                placeholder={Co("co.name")}
                className="w-full rounded-xl border border-brume px-3 py-3"
              />
              {formState.errors.customer_name && (
                <p className="text-red-600 text-xs">{formState.errors.customer_name.message}</p>
              )}

              <div>
                <input
                  {...register("phone")}
                  placeholder={Co("co.phone")}
                  className="w-full rounded-xl border border-brume px-3 py-3"
                />
                <p className="text-xs text-gris mt-1">{Co("co.phonePh")}</p>
              </div>
              {formState.errors.phone && (
                <p className="text-red-600 text-xs">{formState.errors.phone.message}</p>
              )}

              <input {...register("city")} placeholder={Co("co.city")} className="w-full rounded-xl border border-brume px-3 py-3" />

              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
                {loading ? "..." : `🌹 ${Co("co.submit")} — ${Co("co.cod")}`}
              </button>
              <p className="text-center text-xs text-gris">{Co("co.secure")}</p>
            </form>
          </>
        )}

        {step === "upsell" && upsellInfo.eligible && upsellItems && (
          <UpsellPopup
            info={upsellInfo}
            productName={
              upsellInfo.type === "add_missing"
                ? upsellInfo.missingName
                : catalog["collaglow"]?.name || "CollaGlow™"
            }
            productImage={
              upsellInfo.type === "add_missing"
                ? catalog[upsellInfo.missing]?.image || "/images/velvastretch.png"
                : catalog["kit-collagene"]?.image || "/kit-collagene-hero.png"
            }
            preDiscountTotal={preDiscountTotal}
            onAccept={handleUpsellAccept}
            onReject={handleUpsellReject}
          />
        )}

        {step === "error" && (
          <div className="py-8 text-center">
            <p className="font-body text-brun mb-4">{errorMsg}</p>
            <button onClick={() => setStep("form")} className="btn-outline">
              {Co("co.back")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
