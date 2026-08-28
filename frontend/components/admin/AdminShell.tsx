"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
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
  Store,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/admin/profit", label: "Profit Simulator", icon: Calculator },
  { href: "/admin/store-pages", label: "Store Pages", icon: Store },
  { href: "/admin/pixels", label: "Pixels & Tags", icon: Radio },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const STORAGE_KEY = "warda-sidebar-collapsed";

export function AdminShell({ username, children }: { username: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v !== null) setCollapsed(v === "true");
  }, []);

  // Prevent horizontal scrollbar caused by the off-canvas mobile drawer / tooltips
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.overflowX;
    root.style.overflowX = "hidden";
    return () => {
      root.style.overflowX = prev;
    };
  }, []);

  const toggle = () => {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex bg-brume/30">
      {/* Sidebar: fixed drawer on mobile, static collapsible on desktop */}
      <aside
        className={cn(
          "bg-profond text-white flex flex-col z-50 transition-all duration-200 ease-in-out",
          "fixed inset-y-0 left-0 w-60",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          collapsed ? "md:w-16" : "md:w-60",
          "md:static"
        )}
      >
        {/* Logo + toggle */}
        <div
          className={cn(
            "h-16 flex items-center border-b border-white/10 shrink-0",
            collapsed ? "justify-center px-2" : "gap-2 px-3"
          )}
        >
          <Flower2 className="w-6 h-6 text-warda shrink-0" />
          {!collapsed && <span className="font-display text-xl flex-1 truncate">Warda Admin</span>}
          <button
            onClick={toggle}
            title={collapsed ? "Expand menu" : "Collapse menu"}
            aria-label={collapsed ? "Expand menu" : "Collapse menu"}
            className="shrink-0 flex items-center justify-center w-9 h-9 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-hide">
          {NAV.map((item) => {
            const active =
              pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition",
                  collapsed ? "justify-center" : "justify-start",
                  active ? "bg-warda text-white" : "text-white/70 hover:bg-white/10"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {collapsed && (
                  <span className="pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 whitespace-nowrap rounded-lg bg-black px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer: user + logout + collapse toggle */}
        <div className="p-3 border-t border-white/10 space-y-1">
          {!collapsed && (
            <div className="px-3 py-1 text-xs text-white/50 truncate">{username}</div>
          )}
          <button
            onClick={logout}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/10 transition",
              collapsed ? "justify-center" : "justify-start"
            )}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center h-14 px-4 bg-profond text-white shrink-0">
          <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="p-1">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-display ml-3 text-lg">Warda Admin</span>
        </div>

        <main className="flex-1 min-w-0 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
