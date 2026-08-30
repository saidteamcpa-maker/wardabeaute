"use client";

import { useMemo, useState } from "react";
import { useLang } from "@/components/LangProvider";
import { useCatalog } from "@/lib/catalog-context";
import { unitPrice } from "@/content/products";
import { useCart } from "@/lib/cart";
import { createOrder } from "@/lib/api";
import { track } from "@/lib/pixels";
import { Reveal } from "@/components/ui/Reveal";
import { IconBadge } from "@/components/ui/IconBadge";
import { ShieldCheck, Truck, CreditCard, Leaf } from "lucide-react";

type Lang = "fr" | "ar";

interface OrderFormBlockProps {
  slug: string;
  eyebrow?: string;
  h2?: string;
  badges?: string[];
  lang?: Lang;
  whatsappNumber?: string;
}

const PHONE_RE = /^0[5-7][0-9]{8}$/;

export function OrderFormBlock({
  slug,
  eyebrow,
  h2,
  badges,
  lang: propLang,
  whatsappNumber = "212600000000",
}: OrderFormBlockProps) {
  const { lang: ctxLang } = useLang();
  const lang = propLang ?? ctxLang;
  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";
  const catalog = useCatalog();
  const product = catalog[slug];
  const offers: { qty: number; price: number; save?: number }[] = product?.offers ?? [];
  const selectedTier = useCart((s) => s.selectedTier[slug]);
  const setTier = useCart((s) => s.setTier);
  const add = useCart((s) => s.add);

  const activeQty = selectedTier ?? offers[0]?.qty ?? 1;
  const activePrice = unitPrice(slug, activeQty, catalog);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const whatsappText = useMemo(() => {
    const pName = product?.name ?? slug;
    return encodeURIComponent(`Hi, I want to order ${pName} (${activeQty} pcs)`);
  }, [product?.name, slug, activeQty]);

  const waHref = `https://wa.me/${whatsappNumber}?text=${whatsappText}`;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) errs.name = lang === "ar" ? "الاسم ضروري" : "Nom requis (min. 2 caractères)";
    if (!PHONE_RE.test(phone.trim())) errs.phone = lang === "ar" ? "رقم مغربي غير صالح — مثال: 0612345678" : "Numéro invalide — ex: 0612345678 (0[5-7]XXXXXXXX)";
    if (!city.trim()) errs.city = lang === "ar" ? "المدينة ضرورية" : "Ville requise";
    if (!address.trim()) errs.address = lang === "ar" ? "العنوان ضروري" : "Adresse requise";
    if (honeypot.trim()) errs.honeypot = "spam";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;
    if (honeypot) return;

    setLoading(true);
    try {
      setTier(slug, activeQty);
      add({ slug, qty: activeQty });

      const idempotency_key =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `ord-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      const res = await createOrder({
        customer_name: name.trim(),
        phone: phone.trim(),
        city: city.trim(),
        items: [{ slug, qty: activeQty }],
        upsell: false,
        idempotency_key,
        // address is not in CreateOrderPayload type but backend accepts it
        ...(address.trim() ? { address: address.trim() } : {}),
      } as unknown as Parameters<typeof createOrder>[0]);

      track("Purchase", { value: (res as unknown as { total: number }).total ?? activePrice, currency: "MAD", content_ids: [slug], orderId: (res as unknown as { id: string }).id });
      setSuccess(
        lang === "ar"
          ? "شكراً! سنتصل بك قريباً لتأكيد الطلب — الخلاص عند الاستلام."
          : "Merci ! Nous vous appelons très bientôt pour confirmer — paiement à la livraison."
      );
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg === "invalid_phone") setError(lang === "ar" ? "رقم غير صالح" : "Numéro invalide");
      else if (msg === "morocco_only") setError(lang === "ar" ? "الطلبات للمغرب فقط 🇲🇦" : "Commandes réservées au Maroc 🇲🇦");
      else setError(lang === "ar" ? "حدث خطأ — حاولي مرة أخرى" : "Une erreur est survenue — réessayez.");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <section dir={dir} id="order" className="section bg-white scroll-mt-6">
      <div className="container-page">
        <Reveal>
          {eyebrow && <p className="text-champagne text-sm font-body uppercase tracking-wide mb-2 text-center">{eyebrow}</p>}
          {h2 && <h2 className={`text-3xl md:text-4xl leading-snug text-profond mb-2 text-center ${lang === "ar" ? "font-arabic" : ""}`}>{h2}</h2>}
          <p className="font-body text-gris text-sm text-center mb-6">
            {lang === "ar" ? "املئي الاستمارة — الدفع عند الاستلام" : "Remplis le formulaire — paiement à la livraison"}
          </p>
        </Reveal>

        <div className="max-w-xl mx-auto">
          <Reveal>
            <div role="radiogroup" aria-label={lang === "ar" ? "اختر العرض" : "Choisis ton offre"} className="flex flex-col gap-2 mb-6">
              {offers.slice(0, 3).map((o: { qty: number; price: number; save?: number }) => {
                const isActive = activeQty === o.qty;
                const savings = o.save ?? (o.qty > 1 ? Math.max(0, product.price * o.qty - o.price) : 0);
                return (
                  <button
                    key={o.qty}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => setTier(slug, o.qty)}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:ring-warda/30 focus-visible:outline-none ${
                      isActive ? "border-profond bg-profond text-white shadow-elevated" : "border-brume bg-white text-brun hover:border-warda/40"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full border-2 grid place-items-center shrink-0 ${isActive ? "border-white bg-white" : "border-brume bg-white"}`}
                      aria-hidden="true"
                    >
                      {isActive && <span className="w-2.5 h-2.5 rounded-full bg-profond" />}
                    </span>
                    <span className="flex-1 font-body text-sm">
                      <span className="font-medium">{o.qty === 1 ? (lang === "ar" ? "وحدة واحدة" : "1 pièce") : lang === "ar" ? `${o.qty} قطع` : `${o.qty} pièces`}</span>
                      {savings > 0 && <span className={`block text-xs ${isActive ? "text-white/80" : "text-champagne"}`}>{lang === "ar" ? `توفير ${savings} MAD` : `-${savings} MAD`}</span>}
                    </span>
                    <span className="text-right">
                      <span className="font-medium font-body text-sm">{o.price} MAD</span>
                      <span className={`block text-xs ${isActive ? "text-white/70" : "text-gris"}`}>{o.qty} × {o.price} MAD</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <form onSubmit={handleSubmit} className="space-y-4 font-body" noValidate>
              <div className="absolute left-[-5000px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="order-name" className="block text-sm font-medium text-profond mb-1.5">
                  {lang === "ar" ? "الاسم الكامل" : "Nom complet"}
                </label>
                <input
                  id="order-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === "ar" ? "مثال: سميرة بنعلي" : "Ex: Samira Benali"}
                  className="w-full input-field"
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={fieldErrors.name ? "err-name" : undefined}
                />
                {fieldErrors.name && (
                  <p id="err-name" className="text-rose-600 text-xs mt-1">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="order-phone" className="block text-sm font-medium text-profond mb-1.5">
                  {lang === "ar" ? "الهاتف" : "Téléphone"}
                </label>
                <input
                  id="order-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06XXXXXXXX"
                  className="w-full input-field"
                  aria-invalid={!!fieldErrors.phone}
                  aria-describedby={fieldErrors.phone ? "err-phone" : undefined}
                />
                <p className="text-xs text-gris mt-1">{lang === "ar" ? "مثال: 0612345678" : "Format: 0[5-7]XXXXXXXX — ex: 0612345678"}</p>
                {fieldErrors.phone && (
                  <p id="err-phone" className="text-rose-600 text-xs mt-1">
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="order-city" className="block text-sm font-medium text-profond mb-1.5">
                    {lang === "ar" ? "المدينة" : "Ville"}
                  </label>
                  <input
                    id="order-city"
                    type="text"
                    autoComplete="address-level2"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={lang === "ar" ? "الدار البيضاء" : "Casablanca"}
                    className="w-full input-field"
                    aria-invalid={!!fieldErrors.city}
                    aria-describedby={fieldErrors.city ? "err-city" : undefined}
                  />
                  {fieldErrors.city && (
                    <p id="err-city" className="text-rose-600 text-xs mt-1">
                      {fieldErrors.city}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="order-address" className="block text-sm font-medium text-profond mb-1.5">
                    {lang === "ar" ? "العنوان" : "Adresse"}
                  </label>
                  <input
                    id="order-address"
                    type="text"
                    autoComplete="street-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={lang === "ar" ? "الحي، الزنقة..." : "Rue, quartier..."}
                    className="w-full input-field"
                    aria-invalid={!!fieldErrors.address}
                    aria-describedby={fieldErrors.address ? "err-address" : undefined}
                  />
                  {fieldErrors.address && (
                    <p id="err-address" className="text-rose-600 text-xs mt-1">
                      {fieldErrors.address}
                    </p>
                  )}
                </div>
              </div>

              {error && (
                <div role="alert" className="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div role="status" className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 text-sm">
                  {success}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary btn-glow w-full text-base disabled:opacity-60">
                {loading ? (lang === "ar" ? "جاري الإرسال..." : "Envoi...") : lang === "ar" ? `اطلبي الآن — ${activePrice} MAD` : `Commander — ${activePrice} MAD`}
              </button>

              <p className="text-center text-xs text-gris">
                {lang === "ar" ? "🔒 بياناتك محمية · الخلاص عند الاستلام" : "🔒 Données protégées · Paiement à la livraison · Livraison 24–48h"}
              </p>
            </form>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-6">
              {badges && badges.length > 0 ? (
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {badges.map((b, i) => (
                    <span key={i} className="badge-pill text-xs">
                      {b}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  {[
                    { icon: Leaf, label: lang === "ar" ? "طبيعي 100%" : "100% Naturel" },
                    { icon: ShieldCheck, label: lang === "ar" ? "مجرّب" : "Testé" },
                    { icon: Truck, label: "24–48h" },
                    { icon: CreditCard, label: lang === "ar" ? "عند الاستلام" : "COD" },
                  ].map(({ icon: Icon, label }, i) => (
                    <div key={i} className="rounded-xl bg-petal/60 border border-brume/60 px-3 py-3 flex flex-col items-center gap-1.5 text-center">
                      <IconBadge icon={Icon} tone="warda" size="sm" />
                      <span className="text-xs font-body text-brun">{label}</span>
                    </div>
                  ))}
                </div>
              )}

              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-full border border-[#25D366] text-[#25D366] font-body font-medium py-3 hover:bg-[#25D366] hover:text-white transition-colors duration-250"
              >
                <span aria-hidden="true">💬</span>
                {lang === "ar" ? "اطلبي عبر واتساب" : "Commander via WhatsApp"}
              </a>
              <p className="text-center text-[11px] text-gris mt-2 break-all">{waHref}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
