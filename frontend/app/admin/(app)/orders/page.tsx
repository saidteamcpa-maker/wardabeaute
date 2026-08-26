"use client";

import { OrdersTable } from "@/components/admin/OrdersTable";

export default function OrdersPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-display text-profond mb-5">Commandes</h1>
      <OrdersTable />
    </div>
  );
}
