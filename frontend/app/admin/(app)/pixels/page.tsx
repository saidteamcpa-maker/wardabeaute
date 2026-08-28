"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

interface Pixel {
  id: string;
  pixelId: string;
  type: string;
  label: string;
  enabled: boolean;
}

interface PixelsData {
  pixels: Pixel[];
  globalEnabled: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  meta: "Meta (Facebook)",
  tiktok: "TikTok",
  gtm: "Google Tag Manager",
};

const TYPE_PLACEHOLDERS: Record<string, string> = {
  meta: "123456789012345",
  tiktok: "CWZ9ABCD1234",
  gtm: "GTM-XXXXXXX",
};

export default function AdminPixels() {
  const [data, setData] = useState<PixelsData>({ pixels: [], globalEnabled: true });
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  // Add form state
  const [addingType, setAddingType] = useState<string | null>(null);
  const [newPixelId, setNewPixelId] = useState("");
  const [newLabel, setNewLabel] = useState("");

  async function load() {
    try {
      const res = await fetch("/api/admin/pixels");
      if (res.ok) {
        const d: PixelsData = await res.json();
        setData(d);
      }
    } catch { /* ignore */ }
    setLoaded(true);
  }

  useEffect(() => { load(); }, []);

  function flash(kind: "ok" | "err", msg: string) {
    setStatus({ kind, msg });
    setTimeout(() => setStatus(null), 3000);
  }

  // ---------- Global toggle ----------
  async function toggleGlobal() {
    const next = !data.globalEnabled;
    setData((d) => ({ ...d, globalEnabled: next }));
    try {
      const res = await fetch("/api/admin/pixels/global", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: next }),
      });
      if (!res.ok) throw new Error();
      flash("ok", next ? "Tracking enabled" : "Tracking disabled");
    } catch {
      setData((d) => ({ ...d, globalEnabled: !next }));
      flash("err", "Update failed.");
    }
  }

  // ---------- Per-pixel toggle ----------
  async function togglePixel(pixel: Pixel) {
    const next = !pixel.enabled;
    setData((d) => ({
      ...d,
      pixels: d.pixels.map((p) => (p.id === pixel.id ? { ...p, enabled: next } : p)),
    }));
    try {
      const res = await fetch(`/api/admin/pixels/${pixel.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: next }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setData((d) => ({
        ...d,
        pixels: d.pixels.map((p) => (p.id === pixel.id ? { ...p, enabled: !next } : p)),
      }));
      flash("err", "Update failed.");
    }
  }

  // ---------- Delete ----------
  async function remove(pixel: Pixel) {
    if (!confirm(`Delete "${pixel.label}" (${pixel.pixelId})?`)) return;
    setData((d) => ({ ...d, pixels: d.pixels.filter((p) => p.id !== pixel.id) }));
    try {
      const res = await fetch(`/api/admin/pixels/${pixel.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      flash("ok", "Pixel deleted.");
    } catch {
      setData((d) => ({ ...d, pixels: [...d.pixels, pixel] }));
      flash("err", "Deletion failed.");
    }
  }

  // ---------- Add ----------
  function startAdd(type: string) {
    setAddingType(type);
    setNewPixelId("");
    setNewLabel("");
  }

  async function submitAdd() {
    if (!addingType || !newPixelId.trim()) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/pixels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pixelId: newPixelId.trim(),
          type: addingType,
          label: newLabel.trim() || `${TYPE_LABELS[addingType]} Pixel`,
        }),
      });
      if (!res.ok) throw new Error();
      const pixel: Pixel = await res.json();
      setData((d) => ({ ...d, pixels: [...d.pixels, pixel] }));
      setAddingType(null);
      setNewPixelId("");
      setNewLabel("");
      flash("ok", "Pixel added.");
    } catch {
      flash("err", "Addition failed.");
    } finally {
      setBusy(false);
    }
  }

  // ---------- Grouped pixels ----------
  const grouped = ["meta", "tiktok", "gtm"].map((type) => ({
    type,
    label: TYPE_LABELS[type],
    pixels: data.pixels.filter((p) => p.type === type),
  }));

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-display text-profond mb-1">Pixels & Tag</h1>
      <p className="text-sm text-gris mb-5">
        Manage your Meta, TikTok, and Google Tag Manager pixels. You can add multiple
        per type, enable/disable them individually, or remove them.
      </p>

      {status && (
        <div
          className={`mb-4 rounded-xl px-4 py-2 text-sm ${
            status.kind === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
          }`}
        >
          {status.msg}
        </div>
      )}

      {!loaded ? (
        <p className="text-sm text-gris">Loading…</p>
      ) : (
        <div className="space-y-6">
          {/* Global toggle */}
          <div className="rounded-2xl border border-profond/10 bg-white p-5">
            <label className="flex items-center justify-between cursor-pointer">
              <span>
                <span className="font-medium text-profond">Enable tracking</span>
                <span className="block text-xs text-gris">
                  Disables all pixels on the storefront.
                </span>
              </span>
              <button onClick={toggleGlobal} className="shrink-0">
                {data.globalEnabled ? (
                  <ToggleRight className="w-10 h-10 text-warda" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-gris" />
                )}
              </button>
            </label>
          </div>

          {/* Grouped pixels */}
          {grouped.map((group) => (
            <div key={group.type} className="rounded-2xl border border-profond/10 bg-white p-5">
              <h3 className="font-display text-profond text-lg mb-3">{group.label}</h3>

              {group.pixels.length === 0 ? (
                <p className="text-sm text-gris mb-3">No pixels configured.</p>
              ) : (
                <div className="space-y-2 mb-3">
                  {group.pixels.map((pixel) => (
                    <div
                      key={pixel.id}
                      className="flex items-center gap-3 rounded-xl border border-profond/10 px-4 py-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-profond text-sm truncate">{pixel.label}</p>
                        <p className="text-xs text-gris font-mono truncate">{pixel.pixelId}</p>
                      </div>
                      <button onClick={() => togglePixel(pixel)} className="shrink-0" title={pixel.enabled ? "Disable" : "Enable"}>
                        {pixel.enabled ? (
                          <ToggleRight className="w-8 h-8 text-warda" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-gris" />
                        )}
                      </button>
                      <button
                        onClick={() => remove(pixel)}
                        className="shrink-0 p-1 rounded-lg text-gris hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add form */}
              {addingType === group.type ? (
                <div className="rounded-xl border border-warda/30 bg-petal/30 p-4 space-y-2">
                  <input
                    value={newPixelId}
                    onChange={(e) => setNewPixelId(e.target.value)}
                    placeholder={`Pixel ID (${TYPE_PLACEHOLDERS[group.type]})`}
                    className="w-full input-field"
                  />
                  <input
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Label (optional)"
                    className="w-full input-field"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={submitAdd}
                      disabled={busy || !newPixelId.trim()}
                      className="rounded-lg bg-warda px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                      {busy ? "Adding…" : "Add"}
                    </button>
                    <button
                      onClick={() => setAddingType(null)}
                      className="rounded-lg px-4 py-2 text-sm text-gris hover:text-profond"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => startAdd(group.type)}
                  className="flex items-center gap-2 text-sm text-warda hover:text-profond transition"
                >
                  <Plus className="w-4 h-4" />
                  Add a {group.label} pixel
                </button>
              )}
            </div>
          ))}

          {/* Debug */}
          <div className="rounded-2xl border border-profond/10 bg-white p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-profond">Pixel debugging</h3>
              <a
                href="/?pixeltest=1"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-warda underline"
              >
                Open full screen ↗
              </a>
            </div>
            <p className="text-sm text-gris mb-3">
              Live storefront preview: fires test events and shows which
              network received them.
            </p>
            <iframe
              src="/?pixeltest=1"
              title="Pixel debugging"
              className="w-full h-[560px] rounded-xl border border-profond/10 bg-brume/30"
            />
          </div>
        </div>
      )}
    </div>
  );
}
