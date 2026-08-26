"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/pixels";

interface Row {
  name: string;
  meta: boolean;
  tiktok: boolean;
  gtm: boolean;
  payload: Record<string, unknown>;
}

function Badge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs ${ok ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
      {label}
    </span>
  );
}

export function PixelDebug() {
  const [show, setShow] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [fired, setFired] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("pixeltest")) setShow(true);
  }, []);

  const run = () => {
    const events: { name: string; data: Record<string, unknown> }[] = [
      { name: "PageView", data: { page: "/pixeltest" } },
      { name: "ViewContent", data: { content_ids: ["velvastretch"], content_type: "product", value: 280, currency: "MAD" } },
      { name: "AddToCart", data: { content_ids: ["velvastretch"], value: 280, currency: "MAD" } },
      { name: "InitiateCheckout", data: { value: 280, currency: "MAD", content_ids: ["velvastretch"] } },
      { name: "Purchase", data: { value: 100, currency: "MAD", content_ids: ["velvastretch"], orderId: "TEST-123" } },
    ];
    const out: Row[] = [];
    for (const e of events) {
      const dlBefore = (window as any).dataLayer?.length || 0;
      track(e.name, e.data);
      const dlAfter = (window as any).dataLayer?.length || 0;
      out.push({
        name: e.name,
        meta: !!((window as any).fbq),
        tiktok: !!((window as any).ttq),
        gtm: dlAfter > dlBefore,
        payload: e.data,
      });
    }
    setRows(out);
    setFired(true);
  };

  const close = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("pixeltest");
    window.history.replaceState({}, "", url.toString());
    setShow(false);
  };

  if (!show) return null;

  const metaLoaded = !!((window as any).fbq);
  const ttLoaded = !!((window as any).ttq);
  const gtmLoaded = Array.isArray((window as any).dataLayer);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-brun/40 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl p-5 max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-display text-xl text-profond">Test des pixels</h3>
          <button onClick={close} className="text-2xl text-brun leading-none">✕</button>
        </div>

        <div className="flex flex-wrap gap-2 mb-3 text-sm">
          <Badge ok={metaLoaded} label={`Meta ${metaLoaded ? "chargé" : "non chargé"}`} />
          <Badge ok={ttLoaded} label={`TikTok ${ttLoaded ? "chargé" : "non chargé"}`} />
          <Badge ok={gtmLoaded} label={`GTM ${gtmLoaded ? "chargé" : "non chargé"}`} />
        </div>

        <button
          onClick={run}
          className="mb-3 rounded-lg bg-warda px-4 py-2 text-sm font-medium text-white"
        >
          {fired ? "Rejouer les événements" : "Déclencher les événements de test"}
        </button>

        {rows.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brume text-left text-gris">
                <th className="py-2">Événement</th>
                <th className="text-center">Meta</th>
                <th className="text-center">TikTok</th>
                <th className="text-center">GTM</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-brume/50">
                  <td className="py-1.5 font-medium text-profond">{r.name}</td>
                  <td className="text-center">{r.meta ? "✅" : "—"}</td>
                  <td className="text-center">{r.tiktok ? "✅" : "—"}</td>
                  <td className="text-center">{r.gtm ? "✅" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <p className="text-xs text-gris mt-3">
          Les événements de test sont envoyés aux pixels réellement chargés. Vérifiez-les dans Meta Events
          Manager, TikTok Events Manager et l&apos;aperçu GTM.
        </p>
      </div>
    </div>
  );
}
