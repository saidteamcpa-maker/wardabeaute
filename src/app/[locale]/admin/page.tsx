'use client';

import { useEffect, useState, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { CATALOG, BUNDLE, formatMAD } from '@/lib/data/catalog';

type OrderRow = {
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  products: { nameFr: string; qty: number; price: number }[];
  total: number;
  status: string;
  createdAt: string;
};

type Stats = {
  today: { revenue: number; orders: number };
  week: { revenue: number; orders: number };
  month: { revenue: number; orders: number };
  all: { revenue: number; orders: number };
};

type Customer = {
  phone: string;
  name: string;
  city: string;
  orders: number;
  spent: number;
  tier: 'Rose' | 'Fleur' | 'Or';
  last: string;
};

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function AdminDashboard() {
  const t = useTranslations('Admin');
  const locale = useLocale();
  const [tab, setTab] = useState<'orders' | 'stats' | 'stock' | 'customers'>('orders');
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [stock, setStock] = useState<Record<string, number>>({});

  const loadOrders = useCallback(async () => {
    const q = new URLSearchParams({ search, status: statusFilter });
    const res = await fetch(`/api/admin/orders?${q}`);
    if (res.ok) {
      const json = await res.json();
      setOrders(json.orders);
    }
    setLoading(false);
  }, [search, statusFilter]);

  const loadStats = useCallback(async () => {
    const res = await fetch('/api/admin/stats');
    if (res.ok) setStats(await res.json());
  }, []);

  const loadCustomers = useCallback(async () => {
    const res = await fetch('/api/admin/customers');
    if (res.ok) setCustomers((await res.json()).customers);
  }, []);

  useEffect(() => {
    if (tab === 'orders') loadOrders();
    if (tab === 'stats') loadStats();
    if (tab === 'customers') loadCustomers();
    if (tab === 'stock') {
      const init: Record<string, number> = {};
      [...CATALOG, { ...BUNDLE, price: BUNDLE.price } as any].forEach((p) => (init[p.sku] = 50));
      setStock(init);
    }
  }, [tab, loadOrders, loadStats, loadCustomers]);

  const updateStatus = async (orderNumber: string, status: string) => {
    const res = await fetch(`/api/admin/orders/${orderNumber}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      toast.success('Mis à jour');
      loadOrders();
    } else {
      toast.error('Erreur');
    }
  };

  const saveStock = async (sku: string) => {
    const res = await fetch('/api/admin/stock', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku, stock: stock[sku] }),
    });
    if (res.ok) toast.success('Stock enregistré');
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {(['orders', 'stats', 'stock', 'customers'] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              tab === k ? 'bg-warda text-white' : 'bg-white text-warda'
            }`}
          >
            {t(k)}
          </button>
        ))}
      </div>

      {tab === 'orders' && (
        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('search')}
              className="input-wb max-w-xs"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-wb max-w-[160px]"
            >
              <option value="all">{t('status')}: Tous</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <p>Chargement…</p>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.orderNumber} className="card-wb p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-semibold">#{o.orderNumber}</span>
                      <span className="ml-2 text-sm text-ink/60">{o.customerName} · {o.phone}</span>
                      <span className="ml-2 rounded-full bg-petal px-2 py-0.5 text-xs">{o.status}</span>
                    </div>
                    <span className="font-semibold text-warda">{formatMAD(o.total, locale)}</span>
                  </div>
                  <p className="mt-1 text-sm text-ink/70">{o.city} — {o.address}</p>
                  <ul className="mt-2 text-sm text-ink/70">
                    {o.products.map((p, i) => (
                      <li key={i}>{p.nameFr} × {p.qty}</li>
                    ))}
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {STATUSES.filter((s) => s !== o.status).map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(o.orderNumber, s)}
                        className="rounded-full bg-profond px-3 py-1 text-xs font-medium text-white hover:bg-warda"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="text-ink/60">Aucune commande.</p>}
            </div>
          )}
        </div>
      )}

      {tab === 'stats' && stats && (
        <div>
          <div className="grid gap-4 sm:grid-cols-3">
            {(['today', 'week', 'month'] as const).map((k) => (
              <div key={k} className="card-wb p-5">
                <p className="text-sm text-ink/60">{t(k)}</p>
                <p className="mt-1 font-display text-3xl font-bold text-warda">
                  {formatMAD(stats[k].revenue, locale)}
                </p>
                <p className="text-sm text-ink/60">{stats[k].orders} commandes</p>
              </div>
            ))}
          </div>
          <div className="card-wb mt-4 p-5">
            <p className="text-sm text-ink/60">Total</p>
            <p className="font-display text-3xl font-bold text-profond">
              {formatMAD(stats.all.revenue, locale)} · {stats.all.orders} commandes
            </p>
          </div>
        </div>
      )}

      {tab === 'stock' && (
        <div className="card-wb p-5">
          <div className="space-y-3">
            {[...CATALOG, BUNDLE].map((p) => (
              <div key={p.sku} className="flex items-center justify-between gap-3 border-b border-petal pb-3">
                <span className="font-medium">{p.nameFr}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={stock[p.sku] ?? 0}
                    onChange={(e) => setStock((s) => ({ ...s, [p.sku]: Number(e.target.value) }))}
                    className="input-wb w-24"
                  />
                  <button onClick={() => saveStock(p.sku)} className="btn-secondary px-4 py-2">
                    OK
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'customers' && (
        <div className="card-wb overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-petal/40 text-left">
              <tr>
                <th className="p-3">Cliente</th>
                <th className="p-3">Téléphone</th>
                <th className="p-3">Ville</th>
                <th className="p-3">Cmd</th>
                <th className="p-3">Dépensé</th>
                <th className="p-3">Club Warda</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.phone} className="border-t border-petal">
                  <td className="p-3 font-medium text-profond">{c.name}</td>
                  <td className="p-3">{c.phone}</td>
                  <td className="p-3">{c.city}</td>
                  <td className="p-3">{c.orders}</td>
                  <td className="p-3">{formatMAD(c.spent, locale)}</td>
                  <td className="p-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        c.tier === 'Or'
                          ? 'bg-gold text-white'
                          : c.tier === 'Fleur'
                          ? 'bg-warda text-white'
                          : 'bg-petal text-profond'
                      }`}
                    >
                      {c.tier}
                    </span>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-ink/60">
                    Aucune cliente pour l'instant.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
