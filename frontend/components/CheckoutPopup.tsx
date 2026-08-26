"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "@/lib/cart";
import { createOrder, addUpsell, checkGeo } from "@/lib/api";
import { track } from "@/lib/pixels";
import { unitPrice, localize } from "@/content/products";
import { useLang } from "@/components/LangProvider";
import { useCatalog } from "@/lib/catalog-context";
import { t } from "@/content/ui";
import { usePageOverride } from "@/lib/use-page-override";
import { CO_COLLAGEN_DISCOUNT } from "@/lib/orders";

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

  const cartSlugs = items.map((i) => i.slug);
  const hasV = cartSlugs.includes("velvastretch");
  const hasC = cartSlugs.includes("collaglow");
  const bothPresent = hasV && hasC;
  const suggestedSlug: string | null = bothPresent
    ? null
    : hasV
      ? "collaglow"
      : hasC
        ? "velvastretch"
        : "collaglow";
  // Popup only offers to *complete* the kit (add the missing component). When both
  // are already in the cart the discount is auto-applied at checkout, so no popup.
  const showUpsell = (hasV || hasC) && !bothPresent;

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
              upsellDiscount: bothPresent ? (res.discount ?? CO_COLLAGEN_DISCOUNT) : 0,
            })
          );
      } catch {}
      track("Purchase", { value: res.total, currency: "MAD", content_ids: items.map((i) => i.slug), orderId: res.id });
      if (showUpsell) setStep("upsell");
      else finish(false);
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

  const finish = async (withUpsell: boolean) => {
    if (withUpsell) {
      await addUpsell(orderId).catch(() => {});
      try {
        const raw = sessionStorage.getItem("warda-last-order");
        if (raw) {
          const o = JSON.parse(raw);
          let total = o.total ?? 0;
          if (suggestedSlug) {
            const pp = catalog[suggestedSlug];
            o.items = [
              ...(o.items || []),
              { slug: suggestedSlug, name: pp.name, qty: 1, price: unitPrice(suggestedSlug, 1, catalog) },
            ];
            total += unitPrice(suggestedSlug, 1, catalog);
          }
          total -= CO_COLLAGEN_DISCOUNT;
          o.total = total;
          o.upsellDiscount = CO_COLLAGEN_DISCOUNT;
          sessionStorage.setItem("warda-last-order", JSON.stringify(o));
        }
      } catch {}
    }
    clear();
    router.push(`/confirmation?id=${orderId}${withUpsell ? "&upsell=1" : ""}`);
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

        {step === "upsell" && (
          <UpsellStep onFinish={finish} suggestedSlug={suggestedSlug} baseTotal={subtotal} discount={CO_COLLAGEN_DISCOUNT} />
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

function UpsellStep({
  onFinish,
  suggestedSlug,
  baseTotal,
  discount,
}: {
  onFinish: (withUpsell: boolean) => void;
  suggestedSlug: string | null;
  baseTotal: number;
  discount: number;
}) {
  const { lang } = useLang();
  const catalog = useCatalog();
  const ov = usePageOverride("checkout");
  const Co = (k: string) => (ov ? ov[lang]?.[k] || t(lang, k) : t(lang, k));
  const [sec, setSec] = useState(15);
  useEffect(() => {
    const timer = setInterval(() => {
      setSec((s) => {
        if (s <= 1) {
          clearInterval(timer);
          onFinish(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onFinish]);

  const p = suggestedSlug ? localize(catalog[suggestedSlug], lang) : null;
  const productPrice = p ? p.offers[0].price : 0;
  const newTotal = suggestedSlug ? baseTotal + productPrice - discount : baseTotal - discount;

  return (
    <div className="py-4 text-center">
      <p className="font-display text-2xl text-profond mb-1">🎁 Kit Collagène Inside &amp; Outside</p>
      <p className="font-body text-brun text-sm mb-3">
        {Co("co.upsellBody").split("+").map((part, i, arr) => (
          <span key={i}>
            {i > 0 && <span className="text-warda"> + </span>}
            {part}
          </span>
        ))}
      </p>

      {p ? (
        <div className="flex items-center gap-3 mb-3 text-left bg-petal rounded-2xl p-3">
          <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
          <div>
            <p className="font-display text-lg text-profond">{p.name}</p>
            <p className="text-xs text-gris">{lang === "ar" ? p.arSub : p.hero.sub}</p>
          </div>
        </div>
      ) : (
        <p className="font-body text-brun text-sm mb-3">
          {Co("co.upsellBoth").replace("{discount}", String(discount))}
        </p>
      )}

      <p className="text-2xl font-display text-champagne mb-1">
        {newTotal} MAD <span className="line-through text-gris text-base">{newTotal + discount} MAD</span>
      </p>
      <p className="text-xs text-gris mb-3">
        {Co("co.upsellSave").replace("{discount}", String(discount)).replace("{sec}", String(sec))}
      </p>

      <button onClick={() => onFinish(true)} className="btn-primary w-full mb-2">
        {p
          ? Co("co.upsellAdd").replace("{name}", p.name).replace("{discount}", String(discount))
          : Co("co.upsellApply").replace("{discount}", String(discount))}
      </button>
      <button onClick={() => onFinish(false)} className="text-sm text-gris underline w-full">
        {Co("co.upsellNo")}
      </button>
    </div>
  );
}
