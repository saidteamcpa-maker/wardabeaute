"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Megaphone,
  Settings,
  LogOut,
  Flower2,
  Calculator,
  Radio,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Aperçu", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingBag },
  { href: "/admin/products", label: "Produits", icon: Package },
  { href: "/admin/customers", label: "Clients", icon: Users },
  { href: "/admin/analytics", label: "Analytiques", icon: BarChart3 },
  { href: "/admin/campaigns", label: "Campagnes", icon: Megaphone },
  { href: "/admin/profit", label: "Simulateur", icon: Calculator },
  { href: "/admin/pixels", label: "Pixels & Tag", icon: Radio },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
];

export function AdminShell({ username, children }: { username: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex bg-brume/30">
      <aside className="w-60 shrink-0 bg-profond text-white flex flex-col">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10">
          <Flower2 className="w-6 h-6 text-warda" />
          <span className="font-display text-xl">Warda Admin</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                  active ? "bg-warda text-white" : "text-white/70 hover:bg-white/10"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <div className="px-3 py-1 text-xs text-white/50 truncate">{username}</div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/10 transition"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-auto">{children}</main>
    </div>
  );
}
