"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

  // Fresh idempotency key each time the checkout is opened. A double-click on
  // "Commander" reuses the same key (so it won't create a duplicate order), but
  // a brand-new checkout gets a brand-new key (a new order).
  useEffect(() => {
    if (isCheckoutOpen) {
      idemRef.current =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `idem-${Date.now()}-${Math.random().toString(36).slice(2)}`;
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

  const { register, handleSubmit, formState } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const subtotal = items.reduce((s, i) => s + unitPrice(i.slug, i.qty, catalog), 0);

  useEffect(() => {
    if (isCheckoutOpen) {
      track("InitiateCheckout", {
        value: subtotal,
        currency: "MAD",
        content_ids: items.map((i) => i.slug),
      });
    }
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const onSubmit = async (data: z.infer<typeof schema>) => {
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
        ...data,
        items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
        upsell: false,
        idempotency_key: idemRef.current,
      });
      setOrderId(res.id);
      try {
        sessionStorage.setItem(
          "warda-last-order",
          JSON.stringify({
            id: res.id,
            customer_name: data.customer_name,
            phone: data.phone,
            city: data.city,
            items: items.map((i) => ({
              slug: i.slug,
              name: catalog[i.slug].name,
              qty: i.qty,
              price: unitPrice(i.slug, i.qty, catalog),
            })),
            total: res.total,
            upsellDiscount: 0,
          })
        );
      } catch {}
      track("Purchase", { value: res.total, currency: "MAD", content_ids: items.map((i) => i.slug), orderId: res.id });
      finish();
    } catch (e: any) {
      setStep("error");
      if (e?.message === "morocco_only") setErrorMsg(Co("co.errorMorocco"));
      else if (e?.message === "invalid_phone") setErrorMsg(Co("co.errorPhone"));
      else if (e?.message === "blocked") setErrorMsg(Co("co.errorBlocked"));
      else setErrorMsg(Co("co.errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  const finish = () => {
    clear();
    router.push(`/confirmation?id=${orderId}`);
  };

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
              {items.map((i) => (
                <div key={i.slug} className="flex items-center gap-3 py-1">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-brume shrink-0">
                    <img
                      src={catalog[i.slug].image}
                      alt={catalog[i.slug].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="flex-1">
                    {catalog[i.slug].name} × {i.qty}
                  </span>
                  <span>
                    {unitPrice(i.slug, i.qty, catalog)} MAD
                  </span>
                </div>
              ))}
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
