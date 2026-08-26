"use client";

import { useEffect, useState } from "react";

interface PixelConfig {
  metaPixelId: string;
  tiktokPixelId: string;
  gtmId: string;
  enabled: boolean;
}

export default function AdminPixels() {
  const [config, setConfig] = useState<PixelConfig>({
    metaPixelId: "",
    tiktokPixelId: "",
    gtmId: "",
    enabled: true,
  });
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/pixels")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: PixelConfig) => {
        setConfig(d);
        setLoaded(true);
      })
      .catch(() => setStatus({ kind: "err", msg: "Impossible de charger la configuration." }));
  }, []);

  async function save() {
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/pixels", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error();
      const d: PixelConfig = await res.json();
      setConfig(d);
      setStatus({ kind: "ok", msg: "Configuration enregistrée. Les pixels seront mis à jour au prochain chargement." });
    } catch {
      setStatus({ kind: "err", msg: "Échec de l'enregistrement." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-display text-profond mb-1">Pixels & Tag</h1>
      <p className="text-sm text-gris mb-5">
        Configurez le Meta (Facebook) Pixel, le TikTok Pixel et Google Tag Manager. Les valeurs sont
        appliquées sur tout le storefront et ne nécessitent pas de redémarrage.
      </p>

      {!loaded ? (
        <p className="text-sm text-gris">Chargement…</p>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl border border-profond/10 bg-white p-5">
            <label className="flex items-center justify-between">
              <span>
                <span className="font-medium text-profond">Activer le suivi</span>
                <span className="block text-xs text-gris">Désactive tous les pixels et le tag Google.</span>
              </span>
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => setConfig((c) => ({ ...c, enabled: e.target.checked }))}
                className="h-5 w-5 accent-warda"
              />
            </label>
          </div>

          <Field
            label="Meta (Facebook) Pixel ID"
            value={config.metaPixelId}
            onChange={(v) => setConfig((c) => ({ ...c, metaPixelId: v }))}
            placeholder="123456789012345"
            hint="ID numérique du pixel Facebook."
          />
          <Field
            label="TikTok Pixel ID"
            value={config.tiktokPixelId}
            onChange={(v) => setConfig((c) => ({ ...c, tiktokPixelId: v }))}
            placeholder="CWZ9ABCD1234"
            hint="ID de votre TikTok Pixel."
          />
          <Field
            label="Google Tag Manager ID"
            value={config.gtmId}
            onChange={(v) => setConfig((c) => ({ ...c, gtmId: v }))}
            placeholder="GTM-XXXXXXX"
            hint="Identifiant GTM (ou GA4 via GTM)."
          />

          <div className="flex items-center gap-3">
            <button
              onClick={save}
              disabled={busy}
              className="rounded-lg bg-warda px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {busy ? "Enregistrement…" : "Enregistrer"}
            </button>
            {status && (
              <span className={`text-sm ${status.kind === "ok" ? "text-emerald-700" : "text-rose-700"}`}>
                {status.msg}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-profond/10 bg-white p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-profond">Débogage des pixels</h3>
          <a
            href="/?pixeltest=1"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-warda underline"
          >
            Ouvrir en plein écran ↗
          </a>
        </div>
        <p className="text-sm text-gris mb-3">
          Aperçu en direct du storefront : déclenche des événements de test (PageView, ViewContent,
          AddToCart, InitiateCheckout, Purchase) et indique quel réseau les a bien reçus.
        </p>
        <iframe
          src="/?pixeltest=1"
          title="Débogage pixels"
          className="w-full h-[560px] rounded-xl border border-profond/10 bg-brume/30"
        />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="block rounded-2xl border border-profond/10 bg-white p-5">
      <span className="text-sm font-medium text-profond">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-lg border border-profond/15 px-3 py-2 text-sm outline-none focus:border-warda"
      />
      {hint ? <span className="mt-1 block text-xs text-gris">{hint}</span> : null}
    </label>
  );
}
