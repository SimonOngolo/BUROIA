"use client";

import Link from "next/link";
import { useState } from "react";
import AppShell from "@/app/_components/AppShell";

type RequestItem = {
  id: string;
  title: string;
  category: string;
  createdDate: string;
  status: "IN_PROGRESS" | "READY" | "PAYMENT_PENDING" | "COMPLETED";
  step: string;
  amount: string;
};

const DEMANDES_LIST: RequestItem[] = [
  {
    id: "REQ-2026-089",
    title: "Lettre de demande d'emploi",
    category: "Rédaction assistée par IA",
    createdDate: "12 mai 2026 à 14:10",
    status: "IN_PROGRESS",
    step: "Étape 1/4 : Validation de la rédaction",
    amount: "5 000 FCFA",
  },
  {
    id: "REQ-2026-084",
    title: "Attestation de scolarité",
    category: "Traitement de dossier",
    createdDate: "10 mai 2026 à 09:15",
    status: "READY",
    step: "Étape 4/4 : Document prêt à récupérer en borne",
    amount: "2 500 FCFA",
  },
  {
    id: "REQ-2026-078",
    title: "CV professionnel (Modèle Cadre)",
    category: "Génération de document",
    createdDate: "08 mai 2026 à 16:45",
    status: "COMPLETED",
    step: "Terminé · Imprimé à Buroia Kiosk Bastos",
    amount: "5 000 FCFA",
  },
  {
    id: "REQ-2026-071",
    title: "Demande de stage académique",
    category: "Rédaction assistée",
    createdDate: "02 mai 2026 à 18:30",
    status: "PAYMENT_PENDING",
    step: "Étape 3/4 : En attente de paiement Mobile Money",
    amount: "3 500 FCFA",
  },
];

export default function DemandesPage() {
  const [activeFilter, setActiveFilter] = useState<"ALL" | "IN_PROGRESS" | "READY">("ALL");

  const filtered = DEMANDES_LIST.filter((item) => {
    if (activeFilter === "IN_PROGRESS") return item.status === "IN_PROGRESS" || item.status === "PAYMENT_PENDING";
    if (activeFilter === "READY") return item.status === "READY";
    return true;
  });

  return (
    <AppShell activeTab="demandes">
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
              <span>BUROIA</span>
              <span>/</span>
              <span>Mes Demandes</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
              Historique & suivi des demandes
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Suivez l&apos;avancement étape par étape de toutes vos demandes administratives.
            </p>
          </div>

          <Link
            href="/assistant"
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-700 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-700/20 hover:bg-blue-800 transition"
          >
            <span>✨ Nouvelle demande</span>
          </Link>
        </div>

        {/* FILTER BUTTONS */}
        <div className="flex items-center gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <button
            onClick={() => setActiveFilter("ALL")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeFilter === "ALL" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Toutes ({DEMANDES_LIST.length})
          </button>
          <button
            onClick={() => setActiveFilter("IN_PROGRESS")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeFilter === "IN_PROGRESS" ? "bg-amber-600 text-white" : "bg-amber-50 text-amber-700 hover:bg-amber-100"
            }`}
          >
            En cours ({DEMANDES_LIST.filter((d) => d.status === "IN_PROGRESS" || d.status === "PAYMENT_PENDING").length})
          </button>
          <button
            onClick={() => setActiveFilter("READY")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeFilter === "READY" ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            Prêtes à récupérer ({DEMANDES_LIST.filter((d) => d.status === "READY").length})
          </button>
        </div>

        {/* DEMANDES CARDS LIST */}
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4 md:flex-row md:items-center md:justify-between hover:border-blue-300 transition"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 text-xl font-bold shadow-sm">
                  📋
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                    <span className="text-xs font-semibold text-slate-400">({item.id})</span>
                  </div>
                  <p className="text-xs text-slate-500">{item.category} · Créée le {item.createdDate}</p>
                  <p className="text-xs font-bold text-blue-700">{item.step}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-6 border-t border-slate-100 pt-3 md:border-t-0 md:pt-0">
                <div className="text-left md:text-right">
                  <span className="text-base font-black text-slate-900">{item.amount}</span>
                  <div className="mt-1">
                    <StatusTag status={item.status} />
                  </div>
                </div>

                <Link
                  href="/assistant"
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition"
                >
                  Continuer →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function StatusTag({ status }: { status: RequestItem["status"] }) {
  if (status === "IN_PROGRESS") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
        🟡 En rédaction
      </span>
    );
  }
  if (status === "READY") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
        🟢 Prêt (Borne)
      </span>
    );
  }
  if (status === "PAYMENT_PENDING") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-bold text-red-700 border border-red-200">
        🔴 Paiement requis
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 border border-slate-200">
      ⚪ Terminé
    </span>
  );
}
