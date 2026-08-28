"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PageMeta {
  slug: string;
  name: string;
  type: string;
  route: string;
  status: string;
  publishedAt: string | null;
  updatedAt: string | null;
  hasDraft: boolean;
  languages: { fr: { filled: number; required: number }; ar: { filled: number; required: number } };
}

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "home", label: "Home" },
  { key: "product", label: "Products" },
  { key: "kit", label: "Kit" },
  { key: "collection", label: "Collection" },
  { key: "story", label: "Story" },
  { key: "faq", label: "FAQ" },
  { key: "contact", label: "Contact" },
  { key: "policy", label: "Legal" },
  { key: "custom", label: "Custom" },
];

const STATUS_STYLE: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-700",
  draft: "bg-amber-100 text-amber-700",
  disabled: "bg-rose-100 text-rose-700",
};

export default function StorePagesList() {
  const router = useRouter();
  const [pages, setPages] = useState<PageMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [newSlug, setNewSlug] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    const r = await fetch("/api/admin/pages");
    const d = await r.json();
    setPages(d.pages || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = pages.filter((p) =>
    filter === "all"
      ? true
      : filter === "policy"
      ? p.type === "policy"
      : p.type === filter
  );

  async function createCustom(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    const r = await fetch("/api/admin/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: newSlug, title: newTitle }),
    });
    setCreating(false);
    if (r.ok) {
      setNewSlug("");
      setNewTitle("");
      load();
    } else {
      const d = await r.json();
      alert(d.error || "Error");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display text-profond">Site pages</h1>
          <p className="text-sm text-gris font-body">Control page content without touching the code.</p>
        </div>
        <Link
          href="/admin/store-pages/shared"
          className="btn-outline min-h-0 px-4 py-2 text-sm"
        >
          Header / Footer
        </Link>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-body border transition-colors duration-200 ${
              filter === f.key ? "bg-profond text-petal border-profond" : "border-brume text-brun hover:border-warda"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((p) => (
          <div key={p.slug} className="rounded-2xl border border-brume bg-white p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-display text-lg text-profond">{p.name}</p>
                <p className="text-xs text-gris font-mono">/{p.slug}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-body ${STATUS_STYLE[p.status] || ""}`}>
                {p.status}
                {p.hasDraft && <span className="ml-1">· draft</span>}
              </span>
            </div>
            <div className="flex gap-3 text-xs text-gris font-body">
              <span title="French">FR {p.languages.fr.filled}/{p.languages.fr.required}</span>
              <span title="Darija">AR {p.languages.ar.filled}/{p.languages.ar.required}</span>
            </div>
            <div className="flex gap-2 mt-auto">
              <Link
                href={`/admin/store-pages/${p.slug}`}
                className="btn-primary min-h-0 px-4 py-2 text-sm flex-1 text-center"
              >
                Edit
              </Link>
              <a
                href={`${p.route}?preview=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline min-h-0 px-4 py-2 text-sm"
              >
                Preview
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-brume bg-petal/40 p-5">
        <h2 className="font-display text-lg text-profond mb-3">Create a custom page</h2>
        <form onSubmit={createCustom} className="flex gap-2 flex-wrap items-end">
          <div>
            <label className="block text-xs text-gris mb-1">Slug (e.g. ramadan-offer)</label>
            <input
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              className="input-field"
              placeholder="ramadan-offer"
            />
          </div>
          <div>
            <label className="block text-xs text-gris mb-1">Title</label>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="input-field"
              placeholder="Ramadan Offer"
            />
          </div>
          <button type="submit" disabled={creating} className="btn-primary min-h-0 px-4 py-2 text-sm">
            {creating ? "..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}
