"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

export type NavTabId = "dashboard" | "assistant" | "documents" | "demandes" | "kiosks" | "payments" | "profile";

type SessionUser = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
};

function getInitials(name?: string): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function AppShell({
  children,
  activeTab,
}: {
  children: ReactNode;
  activeTab?: NavTabId;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/auth/session", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.user) {
          setCurrentUser(data.user);
        }
      })
      .catch((err) => {
        console.warn("Could not load user session:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleLogout(e?: React.SyntheticEvent) {
    if (e) e.preventDefault();
    setLoggingOut(true);
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (err) {
      console.warn("Logout fetch failed:", err);
    } finally {
      window.location.href = "/login";
    }
  }

  const displayName = currentUser?.name || "Chargement...";
  const displayEmail = currentUser?.email || "";
  const initials = getInitials(currentUser?.name);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* MOBILE BACKDROP */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100">
          <Link href="/dashboard" className="flex items-center gap-2 text-2xl font-black text-blue-700 tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-700 text-white font-extrabold text-lg shadow-md shadow-blue-700/20">
              B
            </span>
            <span>BUROIA<span className="text-blue-400">.</span></span>
          </Link>
          <button
            type="button"
            className="md:hidden text-slate-500 hover:text-slate-700"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Fermer le menu"
          >
            ✕
          </button>
        </div>

        {/* Navigation - Top-level pages */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          <NavItem href="/dashboard" icon="◫" label="Tableau de bord" active={activeTab === "dashboard"} />
          <NavItem href="/assistant" icon="🤖" label="Assistant IA" active={activeTab === "assistant"} />
          <NavItem href="/documents" icon="📄" label="Mes documents" active={activeTab === "documents"} />
          <NavItem href="/demandes" icon="📋" label="Mes demandes" active={activeTab === "demandes"} />
          <NavItem href="/kiosks" icon="📍" label="Bornes & Kiosques" active={activeTab === "kiosks"} />
          <NavItem href="/payments" icon="💳" label="Paiements" active={activeTab === "payments"} />
          <NavItem href="/profile" icon="👤" label="Profil" active={activeTab === "profile"} />
        </nav>

        {/* Ops Link & Logout */}
        <div className="border-t border-slate-100 p-3 space-y-1">
          <NavItem href="/operations" icon="⚙️" label="Centre Opérations" />
          <form action="/api/logout" method="post" onSubmit={handleLogout}>
            <button
              type="submit"
              disabled={loggingOut}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
            >
              <span className="text-base">🚪</span>
              <span>{loggingOut ? "Déconnexion..." : "Déconnexion"}</span>
            </button>
          </form>
        </div>

        {/* User Card */}
        <div className="border-t border-slate-200 p-4 bg-slate-50/70">
          <Link href="/profile" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white shadow-sm text-sm">
              {initials}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-bold text-slate-900 group-hover:text-blue-700">
                {displayName}
              </p>
              <p className="truncate text-xs text-slate-500">
                {displayEmail}
              </p>
            </div>
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT CONTAINER */}
      <div className="flex flex-1 flex-col md:pl-64">
        {/* TOPBAR */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Ouvrir le menu"
            >
              ☰
            </button>
            <Link href="/" className="md:hidden flex items-center gap-2 font-black text-blue-700">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-white font-bold text-sm">
                B
              </span>
            </Link>
            <h1 className="text-lg font-bold text-slate-900">Espace BUROIA</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Rechercher un document, kiosque..."
                className="w-64 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            <Link
              href="/demandes"
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
              aria-label="Notifications"
            >
              🔔
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-600" />
            </Link>

            <Link href="/profile" className="flex items-center gap-2 border-l border-slate-200 pl-4 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                {initials}
              </div>
              <span className="hidden text-sm font-semibold text-slate-700 md:inline group-hover:text-blue-700">
                {displayName}
              </span>
            </Link>
          </div>
        </header>

        {/* CONTENT VIEW */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-blue-50 text-blue-700 font-bold"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
