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
      <h1 className="text-2xl font-display text-profond mb-4">Paramètres</h1>

      <div className="bg-white rounded-2xl border border-brume p-4 sm:p-5 mb-4">
        <h3 className="font-display text-profond mb-2">Session</h3>
        <p className="text-sm text-gris mb-3">Déconnectez la session administrateur active.</p>
        <button
          onClick={logout}
          disabled={busy}
          className="px-4 py-2 rounded-full bg-rose-600 text-white text-sm font-medium disabled:opacity-50"
        >
          {busy ? "Déconnexion…" : "Se déconnecter"}
        </button>
        {done && <p className="text-sm text-emerald-700 mt-2">Déconnecté.</p>}
      </div>

      <div className="bg-white rounded-2xl border border-brume p-4 sm:p-5">
        <h3 className="font-display text-profond mb-2">Sécurité des identifiants</h3>
        <p className="text-sm text-gris mb-2">
          L&apos;accès administrateur est protégé par <code>ADMIN_USERNAME</code> / <code>ADMIN_PASSWORD</code> définis dans{" "}
          <code>frontend/.env.local</code>.
        </p>
        <ol className="list-decimal list-inside text-sm text-gris space-y-1">
          <li>Ouvrez <code>frontend/.env.local</code>.</li>
          <li>Modifiez <code>ADMIN_PASSWORD</code> par un mot de passe fort.</li>
          <li>Redémarrez le serveur (<code>npm run dev</code>) pour appliquer.</li>
        </ol>
        <p className="text-xs text-rose-700 mt-3">
          ⚠️ Les identifiants par défaut (<code>admin</code> / <code>warda-admin-change-me</code>) sont à usage de démonstration et doivent être changés avant toute mise en production.
        </p>
      </div>
    </div>
  );
}
