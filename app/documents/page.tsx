"use client";

import Link from "next/link";
import { useState } from "react";
import AppShell from "@/app/_components/AppShell";

type UserDocument = {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  kioskStatus: "READY" | "PRINTED" | "PENDING";
  fileUrl: string;
};

const INITIAL_DOCS: UserDocument[] = [
  {
    id: "DOC-001",
    name: "Lettre_Demande_Emploi.pdf",
    type: "Document PDF",
    size: "245 Ko",
    date: "12 mai 2026 · 14:32",
    kioskStatus: "READY",
    fileUrl: "#",
  },
  {
    id: "DOC-002",
    name: "Attestation_Scolarite_Officielle.pdf",
    type: "Document PDF",
    size: "512 Ko",
    date: "10 mai 2026 · 09:15",
    kioskStatus: "READY",
    fileUrl: "#",
  },
  {
    id: "DOC-003",
    name: "CV_Professionnel_Cadre_2026.pdf",
    type: "Document PDF",
    size: "1.2 Mo",
    date: "08 mai 2026 · 16:45",
    kioskStatus: "PRINTED",
    fileUrl: "#",
  },
  {
    id: "DOC-004",
    name: "Copie_CNI_Certifiee.pdf",
    type: "Scan HD",
    size: "890 Ko",
    date: "05 mai 2026 · 11:20",
    kioskStatus: "PRINTED",
    fileUrl: "#",
  },
];

export default function DocumentsPage() {
  const [filter, setFilter] = useState<"ALL" | "READY" | "PRINTED">("ALL");

  const filteredDocs = INITIAL_DOCS.filter((doc) => {
    if (filter === "READY") return doc.kioskStatus === "READY";
    if (filter === "PRINTED") return doc.kioskStatus === "PRINTED";
    return true;
  });

  return (
    <AppShell activeTab="documents">
      <div className="space-y-6">
        {/* TITLE & HEADER */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
              <span>BUROIA</span>
              <span>/</span>
              <span>Mes Documents</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
              Bibliothèque de documents
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Gérez vos fichiers rédigés, scannés et prêts pour impression dans les kiosques.
            </p>
          </div>

          <Link
            href="/assistant"
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-700 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-700/20 hover:bg-blue-800 transition"
          >
            <span>✨ Nouveau document</span>
          </Link>
        </div>

        {/* FILTER TABS & SEARCH */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("ALL")}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                filter === "ALL" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Tous les documents ({INITIAL_DOCS.length})
            </button>
            <button
              onClick={() => setFilter("READY")}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                filter === "READY" ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              Prêts en borne ({INITIAL_DOCS.filter((d) => d.kioskStatus === "READY").length})
            </button>
            <button
              onClick={() => setFilter("PRINTED")}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                filter === "PRINTED" ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              Déjà imprimés
            </button>
          </div>

          <Link
            href="/kiosks"
            className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
          >
            <span>📍</span>
            <span>Trouver une borne d&apos;impression</span>
          </Link>
        </div>

        {/* DOCUMENTS GRID */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 hover:border-blue-300 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 font-bold text-xl shadow-sm">
                    📄
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 truncate max-w-[220px]">{doc.name}</h3>
                    <p className="text-xs text-slate-400">{doc.type} · {doc.size}</p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    doc.kioskStatus === "READY"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  {doc.kioskStatus === "READY" ? "🟢 Prêt en borne" : "✓ Imprimé"}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Ajouté le {doc.date}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Téléchargement de ${doc.name}...`)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    📥 Télécharger
                  </button>
                  <Link
                    href="/kiosks"
                    className="rounded-xl bg-blue-700 px-3 py-1.5 font-bold text-white shadow-md shadow-blue-700/20 hover:bg-blue-800 transition"
                  >
                    🖨️ Imprimer
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
