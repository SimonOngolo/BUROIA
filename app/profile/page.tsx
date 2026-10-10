"use client";

import { useEffect, useState } from "react";
import AppShell from "@/app/_components/AppShell";

function getInitials(name?: string): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function UserProfilePage() {
  const [profile, setProfile] = useState({
    fullName: "Chargement...",
    email: "Chargement...",
    phone: "+237 670 000 000",
    city: "Yaoundé",
    neighborhood: "Bastos",
  });
  const [savedNotice, setSavedNotice] = useState("");

  useEffect(() => {
    let isMounted = true;
    fetch("/api/auth/session", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.user) {
          setProfile((prev) => ({
            ...prev,
            fullName: data.user.name || "Utilisateur BUROIA",
            email: data.user.email || "",
          }));
        }
      })
      .catch((err) => {
        console.warn("Could not load user profile:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice("Modifications enregistrées avec succès !");
    setTimeout(() => setSavedNotice(""), 3000);
  };

  return (
    <AppShell activeTab="profile">
      <div className="max-w-4xl space-y-6">
        {/* HEADER */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
            <span>BUROIA</span>
            <span>/</span>
            <span>Profil & Paramètres</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
            Mon profil utilisateur
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Gérez vos informations personnelles, préférences et sécurité.
          </p>
        </div>

        {savedNotice && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 flex items-center justify-between">
            <span>{savedNotice}</span>
            <button onClick={() => setSavedNotice("")}>×</button>
          </div>
        )}

        {/* USER HEADER CARD */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-700 text-white font-black text-2xl shadow-lg shadow-blue-700/20">
            {getInitials(profile.fullName)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{profile.fullName}</h2>
            <p className="text-xs text-slate-500">{profile.email} · Compte vérifié</p>
            <span className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700 border border-blue-100">
              Compte Citoyen BUROIA
            </span>
          </div>
        </div>

        {/* EDIT PROFILE FORM */}
        <form onSubmit={handleSave} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Informations personnelles
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-slate-700">Nom complet</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full mt-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Adresse e-mail</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full mt-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Téléphone (Mobile Money)</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full mt-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Ville de résidence</label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="w-full mt-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="rounded-xl bg-blue-700 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-700/20 hover:bg-blue-800 transition"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
