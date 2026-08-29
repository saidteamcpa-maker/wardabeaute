"use client";

import { useEffect, useRef, useState } from "react";
import { UploadCloud, Copy } from "lucide-react";
import { useAnalytics } from "@/lib/useAnalytics";
import { formatMAD, formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

interface ProdRow {
  slug: string;
  name: string;
  price: number;
  oldPrice: number | null;
  sku: string | null;
  image: string | null;
  active: boolean;
  stockCount: number | null;
  badge: string | null;
  shortDescription: string | null;
  offers: string | null;
  isBundle: boolean;
  managed?: boolean;
}

export default function AdminProductsEditor() {
  const [products, setProducts] = useState<ProdRow[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const [search, setSearch] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const { data } = useAnalytics("30d");
  const perf = data?.products || [];

  async function load(term?: string) {
    const q = (term ?? search).trim();
    const url = q ? `/api/admin/products?q=${encodeURIComponent(q)}` : "/api/admin/products";
    const res = await fetch(url);
    if (res.ok) setProducts(await res.json());
  }
  useEffect(() => { load(); }, []);

  function openEdit(p: ProdRow) {
    setCreating(false);
    setEditing(p.slug);
    setForm({
      slug: p.slug,
      name: p.name,
      price: p.price,
      oldPrice: p.oldPrice ?? "",
      sku: p.sku ?? "",
      image: p.image ?? "",
      active: p.active,
      stockCount: p.stockCount ?? "",
      badge: p.badge ?? "",
      shortDescription: p.shortDescription ?? "",
      isBundle: p.isBundle,
      offers: p.offers ? JSON.stringify(JSON.parse(p.offers), null, 2) : "[]",
    });
    setMsg("");
  }

  function setField(k: string, v: any) {
    setForm((f: any) => ({ ...f, [k]: v }));
  }

  function openCreate() {
    setEditing("__new__");
    setCreating(true);
    setForm({
      slug: "",
      name: "",
      price: "",
      oldPrice: "",
      sku: "",
      image: "",
      active: true,
      stockCount: "",
      badge: "",
      shortDescription: "",
      isBundle: false,
      offers: "[]",
    });
    setMsg("");
  }

  async function uploadImage(file: File) {
    setUploading(true);
    setMsg("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const d = await r.json().catch(() => ({} as any));
      if (!r.ok) {
        setMsg(`Upload failed (${r.status}): ${d.error || r.statusText}`);
      } else if (d.url) {
        setField("image", d.url);
        setMsg("Image uploadée ✓ — n'oubliez pas de cliquer « Save »");
      } else {
        setMsg("Upload failed: " + (d.error || "réponse invalide"));
      }
    } catch (e: any) {
      setMsg("Upload failed: " + (e?.message || "network error"));
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    setMsg("");
    if (creating && !String(form.slug || "").trim()) {
      setSaving(false);
      setMsg("Error: a unique slug is required to create a product.");
      return;
    }
    const payload = {
      ...form,
      price: Number(form.price),
      oldPrice: form.oldPrice === "" ? null : Number(form.oldPrice),
      stockCount: form.stockCount === "" ? null : Number(form.stockCount),
      sku: form.sku ? String(form.sku).trim() : null,
    };
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      setMsg(creating ? "Product created ✓" : "Saved ✓");
      setCreating(false);
      setEditing(null);
      await load();
    } else {
      const j = await res.json().catch(() => ({}));
      if (j.detail === "sku_not_unique") setMsg(j.message || "This SKU is already in use. Please choose a different SKU.");
      else setMsg("Error: " + (j.detail || res.status));
    }
  }

  async function reset(slug: string) {
    if (!confirm("Reset to catalog defaults?")) return;
    const res = await fetch(`/api/admin/products/${slug}`, { method: "DELETE" });
    if (res.ok) { setMsg("Reset ✓"); await load(); }
  }

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-display text-profond">Products</h1>
        <span className="text-xs text-gris">Prices &amp; offers editable. SKU is unique per product.</span>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); load(e.target.value); }}
          placeholder="Search by name or SKU…"
          className="w-full sm:w-72 input-field"
        />
        <button onClick={openCreate} className="btn-primary ml-auto">+ Add product</button>
      </div>

      {msg && <p className="text-sm text-emerald-700 mb-3">{msg}</p>}

      <div className="bg-white rounded-2xl border border-brume overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gris border-b border-brume">
              <th className="py-2 px-4 font-medium">Product</th>
              <th className="py-2 px-4 font-medium text-right">Price</th>
                  <th className="py-2 px-4 font-medium text-right">Old price</th>
                  <th className="py-2 px-4 font-medium text-right">SKU</th>
                  <th className="py-2 px-4 font-medium text-center">Active</th>
              <th className="py-2 px-4 font-medium text-right">Sold</th>
              <th className="py-2 px-4 font-medium text-right">Revenue</th>
              <th className="py-2 px-4 font-medium text-right">Orders</th>
              <th className="py-2 px-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const perfRow = perf.find((x: any) => x.slug === p.slug);
              return (
                <tr key={p.slug} className="border-b border-brume/50">
                  <td className="py-2 px-4">
                    <div className="font-medium text-profond">{p.name}</div>
                    <div className="text-xs text-gris">{p.slug}{p.isBundle ? " · bundle" : ""}</div>
                  </td>
                  <td className="py-2 px-4 text-right">{formatMAD(p.price)}</td>
                  <td className="py-2 px-4 text-right text-gris">{p.oldPrice ? formatMAD(p.oldPrice) : "—"}</td>
                  <td className="py-2 px-4 text-right text-gris">
                    {p.sku ? (
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(p.sku as string)}
                        className="inline-flex items-center gap-1 hover:text-profond"
                        title="Copy SKU"
                      >
                        {p.sku}
                        <Copy className="w-3 h-3" />
                      </button>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-2 px-4 text-center">{p.active ? "✅" : "⛔"}</td>
                  <td className="py-2 px-4 text-right">{perfRow ? formatNumber(perfRow.units) : "—"}</td>
                  <td className="py-2 px-4 text-right">{perfRow ? formatMAD(perfRow.revenue) : "—"}</td>
                  <td className="py-2 px-4 text-right">{perfRow ? formatNumber(perfRow.orders) : "—"}</td>
                  <td className="py-2 px-4 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(p)} className="text-warda underline mr-3">Edit</button>
                    {p.managed && (
                      <button onClick={() => reset(p.slug)} className="text-gris underline">Reset</button>
                    )}
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr><td colSpan={8} className="py-3 px-4 text-gris">Loading…</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && form && (
        <div className="bg-white rounded-2xl border border-brume p-4 sm:p-5 mt-4">
          <h3 className="font-display text-profond mb-3">{creating ? "New product" : <>Edit — {form.name}</>}</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {creating && (
              <label className="text-sm sm:col-span-2">Slug (unique product id, e.g. fitgum-coffee)
                <input type="text" value={form.slug} onChange={(e) => setField("slug", e.target.value)} className="w-full input-field mt-1" placeholder="e.g. fitgum-coffee" />
              </label>
            )}
            <label className="text-sm">Price (MAD)
              <input type="number" value={form.price} onChange={(e) => setField("price", e.target.value)} className="w-full input-field mt-1" />
            </label>
            <label className="text-sm">Old price (MAD, optional)
              <input type="number" value={form.oldPrice} onChange={(e) => setField("oldPrice", e.target.value)} className="w-full input-field mt-1" />
            </label>
            <label className="text-sm">SKU (optional, unique)
              <input type="text" autoCapitalize="none" spellCheck={false} value={form.sku} onChange={(e) => setField("sku", e.target.value)} className="w-full input-field mt-1" placeholder="e.g. wb-velva-001" />
              <span className="block mt-1 text-xs text-gris">A unique identifier used to identify and manage this product.</span>
            </label>
            <label className="text-sm sm:col-span-2">Product image
              <div className="flex items-center gap-3 mt-1">
                <input value={form.image} onChange={(e) => setField("image", e.target.value)} className="w-full input-field" placeholder="/products/... or URL" />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="btn-outline min-h-0 px-3 py-2 text-sm inline-flex items-center gap-1 whitespace-nowrap"
                >
                  <UploadCloud className="w-4 h-4" /> {uploading ? "Uploading…" : "Upload"}
                </button>
              </div>
              {form.image && (
                <img src={form.image} alt="" className="h-24 rounded-lg object-contain mt-2 border border-brume" />
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) await uploadImage(f);
                  e.target.value = "";
                }}
              />
            </label>
            <label className="text-sm">Badge
              <input value={form.badge} onChange={(e) => setField("badge", e.target.value)} className="w-full input-field mt-1" />
            </label>
            <label className="text-sm">Stock
              <input type="number" value={form.stockCount} onChange={(e) => setField("stockCount", e.target.value)} className="w-full input-field mt-1" />
            </label>
            <label className="text-sm flex items-center gap-2 mt-6">
              <input type="checkbox" checked={form.active} onChange={(e) => setField("active", e.target.checked)} /> Active (visible on storefront)
            </label>
            <label className="text-sm sm:col-span-2">Offers (JSON format: list of objects with qty / price)
              <textarea value={form.offers} onChange={(e) => setField("offers", e.target.value)} rows={4} className="w-full input-field mt-1 font-mono text-xs" />
            </label>
            <label className="text-sm sm:col-span-2">Short description
              <textarea value={form.shortDescription} onChange={(e) => setField("shortDescription", e.target.value)} rows={2} className="w-full input-field mt-1" />
            </label>
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">
              {saving ? "…" : "Save"}
            </button>
            <button onClick={() => setEditing(null)} className="btn-outline">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
