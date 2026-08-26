"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Save } from "lucide-react";
import type { SiteContentData } from "@/lib/page-schema";

const NAV_KEYS: { key: string; label: string }[] = [
  { key: "nav.notreHistoire", label: "Our Story" },
  { key: "nav.products", label: "Our Products" },
  { key: "nav.contact", label: "Contact Us" },
  { key: "nav.whatsapp", label: "WhatsApp" },
  { key: "nav.email", label: "Email" },
  { key: "nav.instagram", label: "Instagram" },
  { key: "nav.tiktok", label: "TikTok" },
  { key: "nav.retour", label: "Return Policy" },
  { key: "nav.suivi", label: "Order Tracking" },
  { key: "nav.livraison", label: "Shipping" },
  { key: "nav.conditions", label: "Terms & Conditions" },
];

function empty(): SiteContentData {
  return { header: { nav: {} }, footer: { social: {} }, announcement: {} };
}

export default function SharedEditor() {
  const [site, setSite] = useState<SiteContentData>(empty());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/site")
      .then((r) => r.json())
      .then((d) => {
        setSite({ ...empty(), ...(d.site || {}) });
        setLoading(false);
      });
  }, []);

  function setNav(key: string, lang: "fr" | "ar", value: string) {
    setSite((s) => ({
      ...s,
      header: {
        ...s.header,
        nav: { ...(s.header.nav || {}), [key]: { ...(s.header.nav?.[key] || {}), [lang]: value } },
      },
    }));
  }
  function setAnn(lang: "fr" | "ar", value: string) {
    setSite((s) => ({ ...s, announcement: { ...s.announcement, text: { ...(s.announcement.text || {}), [lang]: value } } }));
  }
  function setFooterText(field: "description" | "copyright", lang: "fr" | "ar", value: string) {
    setSite((s) => ({
      ...s,
      footer: { ...s.footer, [field]: { ...((s.footer[field] as any) || {}), [lang]: value } },
    }));
  }
  function setFooter(field: "email" | "phone", value: string) {
    setSite((s) => ({ ...s, footer: { ...s.footer, [field]: value } }));
  }
  function setSocial(field: string, value: string) {
    setSite((s) => ({ ...s, footer: { ...s.footer, social: { ...(s.footer.social || {}), [field]: value } } }));
  }

  async function save() {
    setSaving(true);
    const r = await fetch("/api/admin/site", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(site),
    });
    setSaving(false);
    if (r.ok) {
      setMsg("Saved ✅");
      setTimeout(() => setMsg(null), 2500);
    }
  }

  if (loading) return <div className="font-body text-gris p-8">Loading…</div>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-display text-profond">Header, footer & announcement</h1>
          <p className="text-sm text-gris font-body">Global content shared across the entire site.</p>
        </div>
        <div className="flex gap-2">
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn-outline min-h-0 px-3 py-2 text-sm inline-flex items-center gap-1">
            <Eye className="w-4 h-4" /> View site
          </a>
          <button onClick={save} disabled={saving} className="btn-primary min-h-0 px-4 py-2 text-sm inline-flex items-center gap-1">
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>
      {msg && <div className="mb-3 rounded-xl bg-emerald-50 text-emerald-700 px-3 py-2 text-sm font-body">{msg}</div>}

      <Section title="Announcement bar">
        <LangInput label="Text" fr={site.announcement.text?.fr || ""} ar={site.announcement.text?.ar || ""} onFr={(v) => setAnn("fr", v)} onAr={(v) => setAnn("ar", v)} />
      </Section>

      <Section title="Logo">
        <input
          value={site.header.logoUrl || ""}
          onChange={(e) => setSite((s) => ({ ...s, header: { ...s.header, logoUrl: e.target.value } }))}
          placeholder="/header-logo.png"
          className="w-full rounded-xl border border-brume px-3 py-2 font-body text-sm"
        />
      </Section>

      <Section title="Menu labels">
        {NAV_KEYS.map((n) => (
          <div key={n.key} className="mb-2">
            <p className="text-sm text-gris font-body mb-1">{n.label} <span className="font-mono text-xs">({n.key})</span></p>
            <div className="grid grid-cols-2 gap-2">
              <input
                value={site.header.nav?.[n.key]?.fr || ""}
                onChange={(e) => setNav(n.key, "fr", e.target.value)}
                placeholder="FR"
                className="rounded-xl border border-brume px-3 py-2 font-body text-sm"
              />
              <input
                value={site.header.nav?.[n.key]?.ar || ""}
                onChange={(e) => setNav(n.key, "ar", e.target.value)}
                placeholder="Darija"
                dir="rtl"
                className="rounded-xl border border-brume px-3 py-2 font-body text-sm"
              />
            </div>
          </div>
        ))}
      </Section>

      <Section title="Footer">
        <LangInput label="Brand description" fr={site.footer.description?.fr || ""} ar={site.footer.description?.ar || ""} onFr={(v) => setFooterText("description", "fr", v)} onAr={(v) => setFooterText("description", "ar", v)} textarea />
        <LangInput label="Copyright" fr={site.footer.copyright?.fr || ""} ar={site.footer.copyright?.ar || ""} onFr={(v) => setFooterText("copyright", "fr", v)} onAr={(v) => setFooterText("copyright", "ar", v)} />
        <div className="grid grid-cols-2 gap-2 mt-2">
          <input value={site.footer.email || ""} onChange={(e) => setFooter("email", e.target.value)} placeholder="Email" className="rounded-xl border border-brume px-3 py-2 font-body text-sm" />
          <input value={site.footer.phone || ""} onChange={(e) => setFooter("phone", e.target.value)} placeholder="Phone" className="rounded-xl border border-brume px-3 py-2 font-body text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <input value={site.footer.social?.whatsapp || ""} onChange={(e) => setSocial("whatsapp", e.target.value)} placeholder="WhatsApp (number)" className="rounded-xl border border-brume px-3 py-2 font-body text-sm" />
          <input value={site.footer.social?.instagram || ""} onChange={(e) => setSocial("instagram", e.target.value)} placeholder="Instagram URL" className="rounded-xl border border-brume px-3 py-2 font-body text-sm" />
          <input value={site.footer.social?.tiktok || ""} onChange={(e) => setSocial("tiktok", e.target.value)} placeholder="TikTok URL" className="rounded-xl border border-brume px-3 py-2 font-body text-sm" />
          <input value={site.footer.social?.facebook || ""} onChange={(e) => setSocial("facebook", e.target.value)} placeholder="Facebook URL" className="rounded-xl border border-brume px-3 py-2 font-body text-sm" />
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-brume bg-white p-4 mb-4">
      <h2 className="font-display text-lg text-profond mb-3">{title}</h2>
      {children}
    </div>
  );
}

function LangInput({
  label,
  fr,
  ar,
  onFr,
  onAr,
  textarea,
}: {
  label: string;
  fr: string;
  ar: string;
  onFr: (v: string) => void;
  onAr: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <div className="mb-3">
      <p className="text-sm text-gris font-body mb-1">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {textarea ? (
          <>
            <textarea value={fr} onChange={(e) => onFr(e.target.value)} rows={2} className="rounded-xl border border-brume px-3 py-2 font-body text-sm" />
            <textarea value={ar} onChange={(e) => onAr(e.target.value)} rows={2} dir="rtl" className="rounded-xl border border-brume px-3 py-2 font-body text-sm" />
          </>
        ) : (
          <>
            <input value={fr} onChange={(e) => onFr(e.target.value)} className="rounded-xl border border-brume px-3 py-2 font-body text-sm" />
            <input value={ar} onChange={(e) => onAr(e.target.value)} dir="rtl" className="rounded-xl border border-brume px-3 py-2 font-body text-sm" />
          </>
        )}
      </div>
    </div>
  );
}
