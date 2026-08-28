"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { STATUS_LABELS, STATUS_ORDER, SOURCE_LABELS, type AdminOrder } from "@/lib/admin-types";
import { statusBadge } from "@/components/admin/OrdersTable";

const STEPS = [
  { key: "created", label: "Order Created" },
  { key: "confirmed", label: "Confirmation" },
  { key: "preparing", label: "Preparation" },
  { key: "shipped", label: "Shipment" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

function stepIndex(status: string): number {
  switch (status) {
    case "confirmed":
      return 1;
    case "preparing":
      return 2;
    case "shipped":
      return 3;
    case "out_for_delivery":
      return 4;
    case "delivered":
      return 5;
    default:
      return 0;
  }
}

export function OrderDrawer({
  reference,
  onClose,
  onChanged,
}: {
  reference: string;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusSelect, setStatusSelect] = useState("");
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState("");
  const [noteSaving, setNoteSaving] = useState(false);
  const [externalId, setExternalId] = useState("");
  const [savingExternal, setSavingExternal] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/orders/${reference}`);
    if (res.ok) {
      const json = await res.json();
      setOrder(json);
      setStatusSelect(json.status);
      setExternalId(json.externalId ? String(json.externalId) : "");
    }
    setLoading(false);
  }, [reference]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async () => {
    if (!order || statusSelect === order.status) return;
    setSaving(true);
    await fetch(`/api/admin/orders/${reference}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: statusSelect }),
    });
    setSaving(false);
    await load();
    onChanged();
  };

  const addNote = async () => {
    if (!note.trim()) return;
    setNoteSaving(true);
    await fetch(`/api/admin/orders/${reference}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });
    setNote("");
    setNoteSaving(false);
    await load();
    onChanged();
  };

  const saveExternalId = async () => {
    if (!externalId.trim()) return;
    setSavingExternal(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.wardabeaute.com";
    await fetch(`${apiUrl}/api/marketplace/orders/${reference}/external`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ externalId: Number(externalId) }),
    });
    setSavingExternal(false);
    await load();
    onChanged();
  };

  const syncMarketplace = async () => {
    if (!order?.externalId) return;
    setSyncing(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.wardabeaute.com";
    await fetch(`${apiUrl}/api/marketplace/orders/${order.externalId}/sync/${reference}`, { method: "POST" });
    setSyncing(false);
    await load();
    onChanged();
  };

  const subtotal = order ? order.items.reduce((s, i) => s + i.unitPrice * i.qty, 0) : 0;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <div className="absolute inset-0 bg-brun/50" onClick={onClose} />
      <div className="drawer-panel">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl text-profond">
            {loading ? "Loading…" : order?.reference}
          </h2>
          <button onClick={onClose} className="btn-ghost"><X className="w-5 h-5" /></button>
        </div>

        {order && (
          <div className="space-y-5">
            {/* Status + actions */}
            <div className="bg-petal/40 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                {statusBadge(order.status)}
                <span className="text-sm text-gris">{new Date(order.createdAt).toLocaleString("fr-FR")}</span>
              </div>
              <div className="flex gap-2">
                <select
                  value={statusSelect}
                  onChange={(e) => setStatusSelect(e.target.value)}
                  className="flex-1 input-field"
                >
                  {STATUS_ORDER.map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
                <button
                  onClick={updateStatus}
                  disabled={saving || statusSelect === order.status}
                  className="btn-primary px-4 disabled:opacity-50"
                >
                  {saving ? "…" : "Apply"}
                </button>
              </div>
            </div>

            {/* Timeline */}
            {order.status !== "cancelled" && order.status !== "returned" ? (
              <div className="flex items-start">
                {STEPS.map((step, idx) => {
                  const done = idx <= stepIndex(order.status);
                  return (
                    <div key={step.key} className="flex-1 text-center">
                      <div
                        className={`mx-auto w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                          done ? "bg-emerald-500 text-white" : "bg-brume text-gris"
                        }`}
                      >
                        {done ? "✓" : idx + 1}
                      </div>
                      <div className="text-[10px] mt-1 text-gris leading-tight">{step.label}</div>
                      {idx < STEPS.length - 1 && <div className="h-0.5 bg-brume" />}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-sm font-medium text-rose-600 bg-rose-50 rounded-xl py-3">
                Order {order.status === "cancelled" ? "cancelled" : "returned"}
              </div>
            )}

            {/* Customer */}
            <Section title="Customer">
              <Row label="Name" value={order.customerName} />
              <Row label="Phone" value={order.phone} />
              <Row label="City" value={order.city} />
              <Row label="Address" value={order.address ?? "—"} />
              {order.notes && <Row label="Customer Note" value={order.notes} />}
            </Section>

            {/* Order */}
            <Section title="Order">
              {order.items.map((i) => (
                <div key={i.id} className="flex justify-between py-1 text-sm">
                  <span>
                    {i.name} × {i.qty}
                    {i.sku ? <span className="block text-xs text-gris">SKU: {i.sku}</span> : null}
                  </span>
                  <span className="text-gris">{i.unitPrice * i.qty} MAD</span>
                </div>
              ))}
              <div className="border-t border-brume my-2" />
              <Row label="Subtotal" value={`${subtotal} MAD`} />
              {order.discount > 0 && <Row label="Discount" value={`−${order.discount} MAD`} />}
              <Row label="Total" value={`${order.total} MAD`} bold />
            </Section>

            {/* COD */}
            <Section title="Payment (COD)">
              <Row label="Method" value="Cash on Delivery" />
              <Row label="Status" value={order.paymentStatus === "paid" ? "Paid" : order.paymentStatus === "refunded" ? "Refunded" : "Unpaid"} />
            </Section>

            {/* Source */}
            <Section title="Source">
              <Row label="Source" value={SOURCE_LABELS[order.source ?? ""] ?? order.source ?? "—"} />
              {order.utmCampaign && <Row label="Campaign" value={order.utmCampaign} />}
              {order.utmMedium && <Row label="Medium" value={order.utmMedium} />}
              {order.referrer && <Row label="Referrer" value={order.referrer} />}
              <Row label="Device" value={order.device ?? "—"} />
            </Section>

            {/* Marketplace */}
            <Section title="Marketplace (SpaceSeller)">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    value={externalId}
                    onChange={(e) => setExternalId(e.target.value)}
                    placeholder="Marketplace order ID (e.g. 278669)"
                    className="flex-1 input-field"
                  />
                  <button onClick={saveExternalId} disabled={savingExternal || !externalId.trim()} className="btn-primary px-4 disabled:opacity-50">
                    {savingExternal ? "…" : "Link"}
                  </button>
                </div>
                {order.externalId && (
                  <div className="text-xs text-gris space-y-1">
                    <Row label="Linked ID" value={String(order.externalId)} />
                    {order.externalStatus && <Row label="Ext. Status" value={order.externalStatus} />}
                    {order.externalDeliveryStatus && <Row label="Ext. Delivery" value={order.externalDeliveryStatus} />}
                    {order.trackingNumber && <Row label="Tracking" value={order.trackingNumber} />}
                    {order.lastSyncedAt && <Row label="Last Sync" value={new Date(order.lastSyncedAt).toLocaleString("fr-FR")} />}
                  </div>
                )}
                <button onClick={syncMarketplace} disabled={syncing || !order.externalId} className="btn-outline w-full disabled:opacity-50">
                  {syncing ? "Syncing…" : "Sync status from SpaceSeller (auto every 5m)"}
                </button>
                <p className="text-xs text-gris">Auto-sync runs every 5m for linked orders. Manual sync forces immediate check.</p>
              </div>
            </Section>

            {/* Notes / history */}
            <Section title="Internal Notes & History">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add an internal note…"
                className="w-full input-field mb-2"
                rows={3}
              />
              <button
                onClick={addNote}
                disabled={noteSaving || !note.trim()}
                className="btn-outline w-full disabled:opacity-50"
              >
                {noteSaving ? "…" : "Add Note"}
              </button>
              <div className="mt-3 space-y-2">
                {order.activities.length === 0 && <p className="text-xs text-gris">No activity.</p>}
                {order.activities.map((a) => (
                  <div key={a.id} className="text-xs border-l-2 border-warda pl-2">
                    <div className="text-profond">{a.message}</div>
                    <div className="text-gris">
                      {a.adminUser ?? "system"} · {new Date(a.createdAt).toLocaleString("en-US")}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-profond mb-2 uppercase tracking-wide">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gris">{label}</span>
      <span className={bold ? "font-semibold text-profond" : "text-profond"}>{value}</span>
    </div>
  );
}
