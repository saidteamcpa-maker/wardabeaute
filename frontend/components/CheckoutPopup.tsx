"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/lib/cart";
import { createOrder, checkGeo } from "@/lib/api";
import { track } from "@/lib/pixels";
import { unitPrice } from "@/content/products";
import { useLang } from "@/components/LangProvider";
import { useCatalog } from "@/lib/catalog-context";
import { t } from "@/content/ui";
import { usePageOverride } from "@/lib/use-page-override";

type FormData = { customer_name: string; phone: string; city: string };

export function CheckoutPopup() {
  const { lang } = useLang();
  const catalog = useCatalog();
  const { items, isCheckoutOpen, closeCheckout, clear } = useCart();
  const router = useRouter();
  const ov = usePageOverride("checkout");
  const Co = (k: string) => (ov ? ov[lang]?.[k] || t(lang, k) : t(lang, k));
  const [step, setStep] = useState<"form" | "error">("form");
  const [errorMsg, setErrorMsg] = useState("");
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const idemRef = useRef<string>("");

  // Filter stale slugs (old localStorage like bundle-bck) to prevent client crash
  const validItems = useMemo(() => items.filter((i) => i && typeof i.slug === "string" && !!catalog[i.slug]), [items, catalog]);

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

  useEffect(() => {
    if (isCheckoutOpen) {
      track("InitiateCheckout", {
        value: subtotal,
        currency: "MAD",
        content_ids: validItems.map((i) => i.slug),
      });
    }
  }, [isCheckoutOpen, subtotal, validItems]);

  // Actual order submission
  const submitOrder = useCallback(
    async (orderItems: typeof validItems, formData: FormData) => {
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
    await submitOrder(validItems, data);
  };

  const finish = (id?: string) => {
    clear();
    const finalId = id || orderId;
    router.push(`/confirmation?id=${finalId}`);
  };

  if (!isCheckoutOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-brun/50 backdrop-blur-sm transition-opacity duration-300" onClick={closeCheckout} />
      <div className="relative bg-petal w-full max-w-[480px] max-h-[95vh] overflow-y-auto rounded-t-2xl md:rounded-2xl p-5 md:p-6 shadow-drawer">
        <button onClick={closeCheckout} className="absolute top-3 right-3 btn-ghost focus-visible:ring-2 focus-visible:ring-warda/30 focus-visible:outline-none">
          <X className="w-5 h-5" />
        </button>

        {step === "form" && (
          <>
            <h3 className="font-display text-2xl text-profond mb-1.5 tracking-tight">{Co("co.title")}</h3>
            <p className="text-sm text-gris mb-4 flex items-center gap-2">
              <span>💳 {Co("co.cod")}</span>
              <span className="w-1 h-1 rounded-full bg-gris/40" aria-hidden />
              <span>🚚 24–48h</span>
            </p>

            <div className="text-sm font-body text-brun mb-4 border-b border-brume/60 pb-4">
              {validItems.length === 0 ? (
                <p className="text-sm text-gris py-2">{Co("co.errorGeneric")}</p>
              ) : (
                validItems.map((i) => {
                  const p = catalog[i.slug];
                  if (!p) return null;
                  return (
                    <div key={i.slug} className="flex items-center gap-3 py-2">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-brume shrink-0 shadow-subtle">
                        <Image src={p.image} alt={p.name} fill sizes="48px" className="w-full h-full object-cover" />
                      </div>
                      <span className="flex-1 font-medium leading-tight">
                        {p.name} × {i.qty}
                      </span>
                      <span className="font-medium tabular-nums">{unitPrice(i.slug, i.qty, catalog)} MAD</span>
                    </div>
                  );
                })
              )}
              <div className="flex justify-between font-medium pt-3 mt-1 border-t border-brume/40">
                <span>{t(lang, "total")}</span>
                <span className="tabular-nums">{subtotal} MAD</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 font-body">
              <input
                {...register("customer_name")}
                placeholder={Co("co.name")}
                className="w-full input-field"
              />
              {formState.errors.customer_name && (
                <p className="text-rose-600 text-xs -mt-1">{formState.errors.customer_name.message}</p>
              )}

              <div>
                <input
                  {...register("phone")}
                  placeholder={Co("co.phone")}
                  className="w-full input-field"
                />
                <p className="text-xs text-gris mt-1.5 leading-relaxed">{Co("co.phonePh")}</p>
              </div>
              {formState.errors.phone && (
                <p className="text-rose-600 text-xs -mt-1">{formState.errors.phone.message}</p>
              )}

              <input {...register("city")} placeholder={Co("co.city")} className="w-full input-field" />
              {formState.errors.city && (
                <p className="text-rose-600 text-xs -mt-1">{formState.errors.city.message}</p>
              )}

              <button type="submit" disabled={loading} className="btn-primary btn-glow w-full disabled:opacity-60 mt-1">
                {loading ? "..." : `🌹 ${Co("co.submit")} — ${Co("co.cod")}`}
              </button>
              <p className="text-center text-xs text-gris leading-relaxed px-2">{Co("co.secure")}</p>
            </form>
          </>
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
