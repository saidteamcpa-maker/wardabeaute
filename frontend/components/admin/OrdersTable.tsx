"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { STATUS_LABELS, STATUS_ORDER, SOURCE_LABELS, type AdminOrder } from "@/lib/admin-types";
import { OrderDrawer } from "@/components/admin/OrderDrawer";

const STATUS_BADGE: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  pending_confirmation: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  preparing: "bg-indigo-100 text-indigo-700",
  shipped: "bg-cyan-100 text-cyan-700",
  out_for_delivery: "bg-violet-100 text-violet-700",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-rose-100 text-rose-700",
  returned: "bg-red-100 text-red-700",
};

export function statusBadge(status: string) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[status] ?? "bg-gray-100 text-gray-700"}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

const SOURCES = ["direct", "facebook", "instagram", "tiktok", "google", "snapchat", "youtube", "other"];

export function OrdersTable() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [data, setData] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (debounced) params.set("search", debounced);
    if (status) params.set("status", status);
    if (source) params.set("source", source);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    params.set("sort", sort);
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));
    try {
      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const json = await res.json();
      setData(json.data ?? []);
      setTotal(json.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [debounced, status, source, dateFrom, dateTo, sort, page, pageSize, router]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search (ID, name, phone, city)…"
          className="flex-1 min-w-[220px] input-field"
        />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="input-field"
        >
          <option value="">All statuses</option>
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
        <select
          value={source}
          onChange={(e) => { setSource(e.target.value); setPage(1); }}
          className="input-field"
        >
          <option value="">All sources</option>
          {SOURCES.map((s) => (
            <option key={s} value={s}>{SOURCE_LABELS[s] ?? s}</option>
          ))}
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
          className="input-field"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
          className="input-field"
        />
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="input-field"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="highest">Highest amount</option>
          <option value="lowest">Lowest amount</option>
        </select>
        <button
          onClick={() => {
            const p = new URLSearchParams();
            if (status) p.set("status", status);
            if (debounced) p.set("search", debounced);
            window.open(`/api/admin/orders/export?${p.toString()}`, "_blank");
          }}
          className="btn-sm"
        >
          ⬇ Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-brume overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gris border-b border-brume bg-petal/30">
              <tr>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">City</th>
                <th className="px-4 py-3 font-medium">Products</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gris">Loading…</td>
                </tr>
              )}
              {!loading && data.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gris">No orders found.</td>
                </tr>
              )}
              {!loading &&
                data.map((o) => (
                  <tr
                    key={o.id}
                    onClick={() => setSelected(o.reference)}
                    className="border-b border-brume/60 cursor-pointer hover:bg-petal/30 transition"
                  >
                    <td className="px-4 py-3 font-medium text-profond">{o.reference}</td>
                    <td className="px-4 py-3 text-gris">{new Date(o.createdAt).toLocaleString("fr-FR")}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-profond">{o.customerName}</div>
                      <div className="text-xs text-gris">{o.phone}</div>
                    </td>
                    <td className="px-4 py-3">{o.city}</td>
                    <td className="px-4 py-3 text-gris">
                      {o.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}
                    </td>
                    <td className="px-4 py-3 font-medium text-profond">{o.total} MAD</td>
                    <td className="px-4 py-3 text-gris">{SOURCE_LABELS[o.source ?? ""] ?? o.source ?? "—"}</td>
                    <td className="px-4 py-3">{statusBadge(o.status)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm text-gris">
        <div>
          {total} order(s) · page {page} / {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="btn-sm disabled:opacity-40"
          >
            Previous
          </button>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="input-field px-2 py-1.5"
          >
            {[10, 20, 50, 100].map((s) => (
              <option key={s} value={s}>{s} / page</option>
            ))}
          </select>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="btn-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {selected && (
        <OrderDrawer reference={selected} onClose={() => setSelected(null)} onChanged={load} />
      )}
    </div>
  );
}
