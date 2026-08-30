"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, Save, UploadCloud, ArrowUp, ArrowDown, Power } from "lucide-react";
import { schemaFor, schemaForImagesOnly, KNOWN_PAGES, type BlockDef } from "@/lib/page-schema";

type Lang = "fr" | "ar";
type Rec = Record<string, string>;
interface PageData {
  fr: Rec;
  ar: Rec;
  _meta?: { order?: string[]; disabled?: string[] };
}
interface Seo {
  seoTitle?: string;
  seoDescription?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  indexable?: boolean;
}
interface PagePayload {
  content: PageData;
  seo: Seo;
  status: string;
  title: string;
  versions: { id: string; version: number; label?: string; createdAt: string }[];
}

export default function PageEditor({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const schema = useMemo(() => schemaForImagesOnly(slug), [slug]);
  const known = KNOWN_PAGES.find((p) => p.slug === slug);
  const previewRoute = known?.route || `/p/${slug}`;

  const [data, setData] = useState<PageData>({ fr: {}, ar: {}, _meta: {} });
  const [seo, setSeo] = useState<Seo>({});
  const [status, setStatus] = useState("published");
  const [title, setTitle] = useState(slug);
  const [versions, setVersions] = useState<PagePayload["versions"]>([]);
  const [activeLang, setActiveLang] = useState<Lang>("fr");
  const [tab, setTab] = useState<"content" | "seo" | "versions" | "settings">("content");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadTargetRef = useRef<{ key: string; lang: Lang } | null>(null);

  async function load() {
    setLoading(true);
    const r = await fetch(`/api/admin/pages/${slug}`);
    const d = await r.json();
    if (d.page) {
      setData(d.page.content || { fr: {}, ar: {}, _meta: {} });
      setSeo(d.page.seo || {});
      setStatus(d.page.status);
      setTitle(d.page.title);
      setVersions(d.page.versions || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [slug]);

  const savedOrder = (data._meta?.order || []).filter((k) => schema.blocks.some((b) => b.key === k));
  const savedSet = new Set(savedOrder);
  const orderedBlocks = [
    ...savedOrder.map((k) => schema.blocks.find((b) => b.key === k)!),
    ...schema.blocks.filter((b) => !savedSet.has(b.key)),
  ] as BlockDef[];
  const disabled = (data._meta?.disabled || []).filter((k) => schema.blocks.some((b) => b.key === k));

  const dirtyRef = useRef(false);
  const [dirty, setDirty] = useState(true);
  function markDirty() {
    dirtyRef.current = true;
    setDirty(true);
  }

  function setField(lang: Lang, key: string, value: string) {
    setData((d) => ({ ...d, [lang]: { ...d[lang], [key]: value } }));
    markDirty();
  }

  function toggleDisable(key: string) {
    setData((d) => {
      const dis = new Set(d._meta?.disabled || []);
      if (dis.has(key)) dis.delete(key);
      else dis.add(key);
      return { ...d, _meta: { ...d._meta, disabled: [...dis] } };
    });
    markDirty();
  }

  function move(key: string, dir: -1 | 1) {
    setData((d) => {
      const o = orderedBlocks.map((b) => b.key);
      const i = o.indexOf(key);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= o.length) return d;
      [o[i], o[j]] = [o[j], o[i]];
      return { ...d, _meta: { ...d._meta, order: o } };
    });
    markDirty();
  }

  async function uploadImage(file: File, lang: Lang, key: string) {
    if (file.size > 8 * 1024 * 1024) {
      setError(`Fichier ${(file.size / 1024 / 1024).toFixed(1)} Mo trop volumineux (8 Mo max)`);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/admin/upload", { method: "POST", body: fd, credentials: "include" });
      const d = await r.json().catch(() => ({} as any));
      if (!r.ok) {
        const detail = (d as any).error || r.statusText || "erreur inconnue";
        setError(r.status === 401 ? `Non autorisé — reconnectez-vous: ${detail}` : `Upload failed (${r.status}): ${detail}`);
      } else if ((d as any).url) setField(lang, key, (d as any).url);
      else setError((d as any).error || "Upload failed: réponse invalide");
    } catch (e: any) {
      setError("Upload failed: " + (e?.message || "network error"));
    } finally {
      setSaving(false);
    }
  }
  function pickImage(key: string) {
    uploadTargetRef.current = { key, lang: activeLang };
    fileRef.current?.click();
  }

  function buildPayload(): { data: PageData; seo: Seo; title: string } {
    const dis = new Set(disabled);
    const fr: Rec = { ...data.fr };
    const ar: Rec = { ...data.ar };
    dis.forEach((k) => {
      fr[k] = "";
      ar[k] = "";
    });
    return { data: { fr, ar, _meta: { order: orderedBlocks.map((b) => b.key), disabled: [...disabled] } }, seo, title };
  }

  async function saveDraft(silent = false) {
    setSaving(true);
    setError(null);
    const payload = buildPayload();
    const r = await fetch(`/api/admin/pages/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "draft", ...payload }),
    });
    setSaving(false);
    if (r.ok) {
      dirtyRef.current = false;
      setDirty(false);
      const d = await r.json();
      setVersions(d.page.versions || []);
      setLastSaved(new Date().toLocaleTimeString("fr-FR"));
      if (!silent) setMsg("Draft saved");
    } else {
      setError("Save failed");
    }
  }

  async function publish() {
    if (!confirm("Publish this version live?")) return;
    setSaving(true);
    setError(null);
    const payload = buildPayload();
    const r = await fetch(`/api/admin/pages/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "publish", ...payload }),
    });
    setSaving(false);
    if (r.ok) {
      dirtyRef.current = false;
      setDirty(false);
      const d = await r.json();
      setStatus("published");
      setVersions(d.page.versions || []);
      setMsg("Page published ✅");
    } else {
      setError("Publish failed");
    }
  }

  async function restore(versionId: string) {
    if (!confirm("Restore this version (it will be published)?")) return;
    setSaving(true);
    const r = await fetch(`/api/admin/pages/${slug}/versions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ versionId }),
    });
    setSaving(false);
    if (r.ok) {
      await load();
      setMsg("Version restored");
    }
  }

  async function setPageStatus(s: string) {
    setSaving(true);
    const r = await fetch(`/api/admin/pages/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "status", status: s }),
    });
    setSaving(false);
    if (r.ok) {
      setStatus(s);
      setMsg(`Status: ${s}`);
    }
  }

  // autosave brouillon
  useEffect(() => {
    if (!dirty) return;
    const t = setTimeout(() => saveDraft(true), 1400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, data, seo, status, title]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (msg) {
      const t = setTimeout(() => setMsg(null), 2500);
      return () => clearTimeout(t);
    }
  }, [msg]);

  const requiredMissing = schema.blocks.filter(
    (b) => b.required && (!data.fr[b.key] || !data.ar[b.key])
  );
  const hasRequiredFields = schema.blocks.some((b) => b.required);

  if (loading) {
    return <div className="font-body text-gris p-8">Loading…</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/store-pages" className="text-gris hover:text-warda">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-display text-profond">{title}</h1>
            <p className="text-xs text-gris font-mono">/{slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`${previewRoute}?preview=1`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline min-h-0 px-3 py-2 text-sm inline-flex items-center gap-1"
          >
            <Eye className="w-4 h-4" /> Preview
          </a>
          <button
            onClick={() => saveDraft()}
            disabled={saving}
            className="btn-outline min-h-0 px-3 py-2 text-sm inline-flex items-center gap-1"
          >
            <Save className="w-4 h-4" /> Draft
          </button>
          <button
            onClick={publish}
            disabled={saving}
            className="btn-primary min-h-0 px-4 py-2 text-sm"
          >
            Publish
          </button>
        </div>
      </div>

      {msg && <div className="mb-3 rounded-xl bg-emerald-50 text-emerald-700 px-3 py-2 text-sm font-body">{msg}</div>}
      {error && <div className="mb-3 rounded-xl bg-rose-50 text-rose-700 px-3 py-2 text-sm font-body">{error}</div>}
      {dirty && <div className="mb-3 text-xs text-amber-600 font-body">Unsaved changes… (auto-saving)</div>}
      {lastSaved && !dirty && <div className="mb-3 text-xs text-gris font-body">Last draft: {lastSaved}</div>}
      {hasRequiredFields && requiredMissing.length > 0 && (
        <div className="mb-3 rounded-xl bg-amber-50 text-amber-800 px-3 py-2 text-sm font-body">
          ⚠ Missing required fields (FR or AR): {requiredMissing.map((b) => b.label).join(", ")}
        </div>
      )}

      {/* Always-mounted hidden file input — must be outside tab conditional so fileRef is always valid */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          const f = e.target.files?.[0];
          const target = uploadTargetRef.current;
          if (f && target) uploadImage(f, target.lang, target.key);
          uploadTargetRef.current = null;
          e.target.value = "";
        }}
      />

      <div className="flex gap-2 mb-4 border-b border-brume">
        {(["content", "versions"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2 text-sm font-body capitalize ${
              tab === t ? "border-b-2 border-warda text-profond" : "text-gris"
            }`}
          >
            {t === "content" ? "Images" : "Versions"}
          </button>
        ))}
      </div>

      {tab === "content" && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gris font-body">Editing language:</span>
          {(["fr", "ar"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setActiveLang(l)}
              className={`px-3 py-1 rounded-full text-sm font-body border ${
                activeLang === l ? "bg-profond text-petal border-profond" : "border-brume"
              }`}
            >
              {l === "fr" ? "French" : "Darija"}
            </button>
          ))}
        </div>
      )}

      {tab === "content" && (
        <div className="space-y-4">
          {orderedBlocks.map((b) => {
            const isDisabled = disabled.includes(b.key);
            return (
              <div
                key={b.key}
                className={`rounded-2xl border p-4 ${isDisabled ? "border-brume/50 bg-petal/30 opacity-70" : "border-brume bg-white"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="font-body text-sm text-profond font-medium">{b.label}</label>
                  <div className="flex items-center gap-1">
                    <button onClick={() => move(b.key, -1)} className="p-1 text-gris hover:text-warda" title="Move up">
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button onClick={() => move(b.key, 1)} className="p-1 text-gris hover:text-warda" title="Move down">
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleDisable(b.key)}
                      className={`p-1 ${isDisabled ? "text-rose-500" : "text-gris hover:text-warda"}`}
                      title={isDisabled ? "Enable" : "Disable"}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <Field
                  block={b}
                  value={data[activeLang][b.key] || ""}
                  dir={activeLang === "ar" ? "rtl" : "ltr"}
                  onChange={(v) => setField(activeLang, b.key, v)}
                  onPickImage={pickImage}
                  uploading={saving}
                />
                {activeLang === "ar" && (
                  <p className="text-xs text-gris mt-1 font-body">FR: {(data.fr[b.key] || "").slice(0, 80) || "—"}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === "seo" && (
        <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
          <Input label="SEO Title" value={seo.seoTitle || ""} onChange={(v) => { setSeo({ ...seo, seoTitle: v }); markDirty(); }} />
          <Input label="Canonical URL" value={seo.canonical || ""} onChange={(v) => { setSeo({ ...seo, canonical: v }); markDirty(); }} />
          <TextArea label="SEO Description" value={seo.seoDescription || ""} onChange={(v) => { setSeo({ ...seo, seoDescription: v }); markDirty(); }} />
          <Input label="OG Image URL" value={seo.ogImage || ""} onChange={(v) => { setSeo({ ...seo, ogImage: v }); markDirty(); }} />
          <Input label="OG Title" value={seo.ogTitle || ""} onChange={(v) => { setSeo({ ...seo, ogTitle: v }); markDirty(); }} />
          <TextArea label="OG Description" value={seo.ogDescription || ""} onChange={(v) => { setSeo({ ...seo, ogDescription: v }); markDirty(); }} />
          <label className="flex items-center gap-2 font-body text-sm text-brun md:col-span-2">
            <input
              type="checkbox"
              checked={seo.indexable !== false}
              onChange={(e) => { setSeo({ ...seo, indexable: e.target.checked }); markDirty(); }}
            />
            Page indexable by Google (otherwise noindex)
          </label>
        </div>
      )}

      {tab === "versions" && (
        <div className="space-y-2 max-w-2xl">
          {versions.length === 0 && <p className="text-gris font-body text-sm">No published versions yet.</p>}
          {versions.map((v) => (
            <div key={v.id} className="flex items-center justify-between rounded-xl border border-brume bg-white px-4 py-3">
              <div>
                <p className="font-body text-profond">{v.label || `v${v.version}`}</p>
                <p className="text-xs text-gris">{new Date(v.createdAt).toLocaleString("fr-FR")}</p>
              </div>
              <button onClick={() => restore(v.id)} className="btn-outline min-h-0 px-3 py-1.5 text-sm">
                Restore
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "settings" && (
        <div className="space-y-4 max-w-lg">
          <div>
            <p className="text-sm text-gris font-body mb-1">Status</p>
            <div className="flex gap-2">
              {(["published", "draft", "disabled"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setPageStatus(s)}
                  className={`px-3 py-2 rounded-xl text-sm font-body border ${
                    status === s ? "bg-profond text-petal border-profond" : "border-brume"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <Input label="Page title (admin)" value={title} onChange={(v) => { setTitle(v); markDirty(); }} />
          <p className="text-xs text-gris font-body">Slug: <span className="font-mono">/{slug}</span> (not editable)</p>
        </div>
      )}
    </div>
  );
}

function Field({
  block,
  value,
  dir,
  onChange,
  onPickImage,
  uploading,
}: {
  block: BlockDef;
  value: string;
  dir: "ltr" | "rtl";
  onChange: (v: string) => void;
  onPickImage: (key: string) => void;
  uploading: boolean;
}) {
  if (block.kind === "textarea") {
    return (
      <textarea
        value={value}
        dir={dir}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-xl border border-brume px-3 py-2 font-body text-sm"
      />
    );
  }
  if (block.kind === "image") {
    return (
      <div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/uploads/... or URL"
          className="w-full rounded-xl border border-brume px-3 py-2 font-body text-sm mb-2"
        />
        {value && <img src={value} alt="" className="h-20 rounded-lg object-contain mb-2 border border-brume" />}
        <button
          type="button"
          onClick={() => onPickImage(block.key)}
          disabled={uploading}
          className="btn-outline min-h-0 px-3 py-1.5 text-sm inline-flex items-center gap-1"
        >
          <UploadCloud className="w-4 h-4" /> {uploading ? "Uploading…" : "Upload"}
        </button>
      </div>
    );
  }
  return (
    <input
      value={value}
      dir={dir}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-brume px-3 py-2 font-body text-sm"
    />
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm text-gris font-body mb-1">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-brume px-3 py-2 font-body text-sm" />
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm text-gris font-body mb-1">{label}</label>
      <textarea value={value} rows={2} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-brume px-3 py-2 font-body text-sm" />
    </div>
  );
}
