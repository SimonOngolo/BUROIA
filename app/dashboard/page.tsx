"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/app/_components/AppShell";

type UserRequest = {
  id: string;
  title: string;
  category: string;
  date: string;
  status: "IN_PROGRESS" | "READY" | "PAYMENT_PENDING" | "COMPLETED";
  amount: string;
};

const RECENT_REQUESTS: UserRequest[] = [
  {
    id: "REQ-2026-089",
    title: "Lettre de demande d'emploi",
    category: "Rédaction assistée par IA",
    date: "12 mai 2026",
    status: "IN_PROGRESS",
    amount: "5 000 FCFA",
  },
  {
    id: "REQ-2026-084",
    title: "Attestation de scolarité",
    category: "Traitement de dossier",
    date: "10 mai 2026",
    status: "READY",
    amount: "2 500 FCFA",
  },
  {
    id: "REQ-2026-078",
    title: "CV professionnel (Modèle Cadre)",
    category: "Génération de document",
    date: "08 mai 2026",
    status: "COMPLETED",
    amount: "5 000 FCFA",
  },
  {
    id: "REQ-2026-071",
    title: "Demande de stage académique",
    category: "Rédaction assistée",
    date: "02 mai 2026",
    status: "PAYMENT_PENDING",
    amount: "3 500 FCFA",
  },
];

export default function UserDashboardPage() {
  const [greetingName, setGreetingName] = useState("");

  useEffect(() => {
    fetch("/api/auth/session", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user?.name) {
          setGreetingName(data.user.name);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <AppShell activeTab="dashboard">
      <div className="space-y-8">
        {/* GREETING & HEADER */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
              Bonjour {greetingName ? `${greetingName} ` : ""}👋
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Voici un aperçu de votre activité et de vos documents administratifs.
            </p>
          </div>

          <Link
            href="/assistant"
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-blue-700/20 transition hover:bg-blue-800"
          >
            <span>✨</span>
            <span>Créer un nouveau document</span>
          </Link>
        </div>

        {/* STATS CARDS GRID */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Mes Demandes */}
          <Link href="/demandes" className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2 hover:border-blue-300 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mes demandes</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 text-lg">
                📄
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900">3</span>
              <span className="text-xs font-bold text-emerald-600">2 en cours</span>
            </div>
            <p className="text-[11px] text-slate-400">Demandes actives en traitement</p>
          </Link>

          {/* Documents disponibles */}
          <Link href="/documents" className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2 hover:border-blue-300 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Documents prêts</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 text-lg">
                📂
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900">5</span>
              <span className="text-xs font-bold text-blue-600">Prêts en borne</span>
            </div>
            <p className="text-[11px] text-slate-400">Disponibles dans vos bornes</p>
          </Link>

          {/* Bornes proches */}
          <Link href="/kiosks" className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2 hover:border-blue-300 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Borne proche</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 text-lg">
                📍
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">1,2 km</span>
              <span className="text-xs font-bold text-indigo-600">Bastos</span>
            </div>
            <p className="text-[11px] text-slate-400">Carrefour Bastos (4 min)</p>
          </Link>

          {/* Total Dépensé */}
          <Link href="/payments" className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2 hover:border-blue-300 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total dépensé</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 text-lg">
                💳
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">12 500 FCFA</span>
            </div>
            <p className="text-[11px] text-slate-400">Factures & services BUROIA</p>
          </Link>
        </div>

        {/* AI ASSISTANT PROMPT BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white shadow-xl">
          <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-blue-100 backdrop-blur">
                <span>🤖</span>
                <span>Assistant BUROIA IA</span>
              </div>
              <h2 className="text-xl font-extrabold sm:text-2xl">
                Besoin d&apos;aide pour une démarche administrative ?
              </h2>
              <p className="text-sm text-blue-100">
                Discutez avec l&apos;assistant pour rédiger une lettre, formater un CV ou préparer les pièces de votre dossier.
              </p>
            </div>

            <Link
              href="/assistant"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-blue-700 shadow-lg transition hover:bg-blue-50 whitespace-nowrap"
            >
              <span>Ouvrir l&apos;assistant IA</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* RECENT REQUESTS TABLE SECTION */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Dernières demandes</h2>
              <p className="text-xs text-slate-500">Suivi en temps réel de vos rédactions et impressions</p>
            </div>

            <Link
              href="/demandes"
              className="text-xs font-bold text-blue-700 hover:text-blue-800 hover:underline"
            >
              Voir tout →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-400 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Document</th>
                  <th className="py-3 px-4">Catégorie</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Montant</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {RECENT_REQUESTS.map((request) => (
                  <tr key={request.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 font-bold text-base">
                        📄
                      </span>
                      <div>
                        <p>{request.title}</p>
                        <p className="text-[11px] font-medium text-slate-400">{request.id}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs">{request.category}</td>
                    <td className="py-3.5 px-4 text-xs font-medium">{request.date}</td>
                    <td className="py-3.5 px-4 text-xs font-bold text-slate-900">{request.amount}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href="/assistant"
                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-blue-700 transition"
                      >
                        Voir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StatusBadge({ status }: { status: UserRequest["status"] }) {
  if (status === "IN_PROGRESS") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
        Rédaction
      </span>
    );
  }
  if (status === "READY") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Prêt (Borne)
      </span>
    );
  }
  if (status === "PAYMENT_PENDING") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 border border-red-200">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        Paiement requis
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 border border-slate-200">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
      Terminé
    </span>
  );
}
