"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "@/lib/cart";
import { createOrder, addUpsell, checkGeo } from "@/lib/api";
import { track } from "@/lib/pixels";
import { products } from "@/content/products";

const schema = z.object({
  customer_name: z.string().min(2, "Nom requis"),
  phone: z.string().regex(/^0(5|6|7|8)[0-9]{8}$/, "Ex: 0612345678"),
  city: z.string().min(1, "Ville requise"),
  address: z.string().min(5, "Adresse requise"),
  postal: z.string().optional(),
});

type Form = z.infer<typeof schema>;

const CITIES = ["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", "Kénitra", "Oujda", "Autre"];

export function CheckoutPopup() {
  const { items, isCheckoutOpen, closeCheckout, clear } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<"form" | "upsell" | "error">("form");
  const [errorMsg, setErrorMsg] = useState("");
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState } = useForm<Form>({ resolver: zodResolver(schema) });
  const subtotal = items.reduce((s, i) => s + (products[i.slug].offers.find((o) => o.qty === i.qty)?.price || products[i.slug].price), 0);

  if (!isCheckoutOpen) return null;

  const onSubmit = async (data: Form) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const geo = await checkGeo();
      if (!geo.allowed) {
        setStep("error");
        setErrorMsg("Désolé, les commandes sont réservées au Maroc 🇲🇦.");
        setLoading(false);
        return;
      }
      const res = await createOrder({
        ...data,
        items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
        upsell: false,
      });
      setOrderId(res.id);
      track("Purchase", { value: res.total, currency: "MAD", content_ids: items.map((i) => i.slug) });
      setStep("upsell");
    } catch (e: any) {
      setStep("error");
      if (e?.message === "morocco_only") setErrorMsg("Désolé, les commandes sont réservées au Maroc 🇲🇦.");
      else if (e?.message === "invalid_phone") setErrorMsg("Numéro marocain invalide. Ex: 0612345678");
      else if (e?.message === "blocked") setErrorMsg("Accès non autorisé depuis ce réseau.");
      else setErrorMsg("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const finish = async (withUpsell: boolean) => {
    if (withUpsell) await addUpsell(orderId).catch(() => {});
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
            <h3 className="font-display text-2xl text-profond mb-1">Confirmer ma commande</h3>
            <p className="text-sm text-gris mb-3">💳 Paiement à la livraison · 🚚 24–48h</p>

            <div className="text-sm font-body text-brun mb-3 border-b border-brume pb-3">
              {items.map((i) => (
                <div key={i.slug} className="flex justify-between">
                  <span>{products[i.slug].name} × {i.qty}</span>
                  <span>{(products[i.slug].offers.find((o) => o.qty === i.qty)?.price || products[i.slug].price)} MAD</span>
                </div>
              ))}
              <div className="flex justify-between font-medium mt-1">
                <span>Total</span><span>{subtotal} MAD</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 font-body">
              <input {...register("customer_name")} placeholder="Nom complet" className="w-full rounded-xl border border-brume px-3 py-3" />
              {formState.errors.customer_name && <p className="text-red-600 text-xs">{formState.errors.customer_name.message}</p>}

              <div>
                <input {...register("phone")} placeholder="Téléphone" className="w-full rounded-xl border border-brume px-3 py-3" />
                <p className="text-xs text-gris mt-1">Ex: 0612345678</p>
              </div>
              {formState.errors.phone && <p className="text-red-600 text-xs">{formState.errors.phone.message}</p>}

              <select {...register("city")} className="w-full rounded-xl border border-brume px-3 py-3">
                <option value="">Ville</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>

              <input {...register("address")} placeholder="Adresse complète" className="w-full rounded-xl border border-brume px-3 py-3" />

              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
                {loading ? "..." : "🌹 Confirmer — Paiement à la livraison"}
              </button>
              <p className="text-center text-xs text-gris">🔒 Vos données sont protégées · ⚡ 47 personnes regardent</p>
            </form>
          </>
        )}

        {step === "upsell" && <UpsellStep onFinish={finish} />}

        {step === "error" && (
          <div className="py-8 text-center">
            <p className="font-body text-brun mb-4">{errorMsg}</p>
            <button onClick={() => setStep("form")} className="btn-outline">Retour</button>
          </div>
        )}
      </div>
    </div>
  );
}

function UpsellStep({ onFinish }: { onFinish: (withUpsell: boolean) => void }) {
  const [sec, setSec] = useState(15);
  useEffect(() => {
    const t = setInterval(() => {
      setSec((s) => {
        if (s <= 1) {
          clearInterval(t);
          onFinish(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [onFinish]);
  return (
    <div className="py-4 text-center">
      <p className="font-display text-2xl text-profond mb-2">🎁 Offre exclusive</p>
      <p className="font-body text-brun mb-1">Ajoutez le Mini Soin Warda pour seulement</p>
      <p className="text-3xl font-display text-champagne mb-3">99 MAD <span className="line-through text-gris text-base">149 MAD</span></p>
      <p className="text-xs text-gris mb-4">Cette offre expire dans {sec}s</p>
      <button onClick={() => onFinish(true)} className="btn-primary w-full mb-2">Ajouter + 99 MAD</button>
      <button onClick={() => onFinish(false)} className="text-sm text-gris underline w-full">Non merci</button>
    </div>
  );
}
