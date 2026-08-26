"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminSettings() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function logout() {
    setBusy(true);
    await fetch("/api/admin/logout", { method: "POST" });
    setDone(true);
    setBusy(false);
    router.push("/admin/login");
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-display text-profond mb-4">Settings</h1>

      <div className="bg-white rounded-2xl border border-brume p-4 sm:p-5 mb-4">
        <h3 className="font-display text-profond mb-2">Session</h3>
        <p className="text-sm text-gris mb-3">Log out the active admin session.</p>
        <button
          onClick={logout}
          disabled={busy}
          className="px-4 py-2 rounded-full bg-rose-600 text-white text-sm font-medium disabled:opacity-50"
        >
          {busy ? "Logging out…" : "Log out"}
        </button>
        {done && <p className="text-sm text-emerald-700 mt-2">Logged out.</p>}
      </div>

      <div className="bg-white rounded-2xl border border-brume p-4 sm:p-5">
        <h3 className="font-display text-profond mb-2">Credentials security</h3>
        <p className="text-sm text-gris mb-2">
          Admin access is protected by <code>ADMIN_USERNAME</code> / <code>ADMIN_PASSWORD</code> set in{" "}
          <code>frontend/.env.local</code>.
        </p>
        <ol className="list-decimal list-inside text-sm text-gris space-y-1">
          <li>Open <code>frontend/.env.local</code>.</li>
          <li>Change <code>ADMIN_PASSWORD</code> to a strong password.</li>
          <li>Restart the server (<code>npm run dev</code>) to apply.</li>
        </ol>
        <p className="text-xs text-rose-700 mt-3">
          ⚠️ The default credentials (<code>admin</code> / <code>warda-admin-change-me</code>) are for demonstration purposes only and must be changed before going to production.
        </p>
      </div>
    </div>
  );
}
