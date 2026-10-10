"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/app/_components/AppShell";

type ChatMessage = {
  id: string;
  sender: "USER" | "AI";
  text: string;
};

export default function AssistantPage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // STEP 1 STATE: AI REDACTION
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      sender: "AI",
      text: "Bonjour ! Décrivez votre démarche ou votre besoin en langage simple. Je vous aide à rédiger et préparer votre document.",
    },
    {
      id: "m2",
      sender: "USER",
      text: "Je veux une lettre de demande d'emploi.",
    },
    {
      id: "m3",
      sender: "AI",
      text: "Parfait ! J'ai rédigé votre lettre de demande d'emploi. Vous pouvez la relire et la modifier à droite.",
    },
  ]);

  const [documentContent, setDocumentContent] = useState({
    title: "Lettre de demande d'emploi",
    date: "Yaoundé, le 12 mai 2026",
    subject: "Objet : Candidature au poste de Développeur Web",
    recipient: "Madame, Monsieur le Directeur,",
    body: "Je me permets de vous adresser ma candidature au poste de Développeur Web au sein de votre entreprise. Passionné par les nouvelles technologies et doté d'une solide expérience en développement logiciel, je suis convaincu de pouvoir apporter une contribution significative à votre équipe.\n\nVeuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.",
    signature: "Demandeur",
  });

  useEffect(() => {
    let isMounted = true;
    fetch("/api/auth/session", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.user?.name) {
          const userName = data.user.name;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === "m1"
                ? {
                    ...msg,
                    text: `Bonjour ${userName} ! Décrivez votre démarche ou votre besoin en langage simple. Je vous aide à rédiger et préparer votre document.`,
                  }
                : msg
            )
          );
          setDocumentContent((prev) => ({
            ...prev,
            signature: userName,
          }));
        }
      })
      .catch((err) => {
        console.warn("Could not load user in assistant:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);
  const [isEditingDoc, setIsEditingDoc] = useState(false);

  // STEP 2 STATE: UPLOADS
  const [uploads, setUploads] = useState<{ [key: string]: boolean }>({
    cni: true,
    photo: true,
    cv: false,
    diploma: false,
  });

  // STEP 3 STATE: PAYMENT
  const [paymentMode, setPaymentMode] = useState<"MOMO" | "CARD" | "PAYPAL">("MOMO");
  const [momoProvider, setMomoProvider] = useState<"MTN" | "ORANGE">("MTN");
  const [momoPhone, setMomoPhone] = useState("670000000");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "USER",
      text: chatInput.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "AI",
        text: "J'ai bien mis à jour le brouillon de votre document selon vos indications.",
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 700);
  };

  const handleFileUpload = (key: string) => {
    setUploads((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AppShell activeTab="assistant">
      <div className="space-y-6">
        {/* PAGE TITLE & STEPPER HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
              <span>BUROIA</span>
              <span>/</span>
              <span>Assistant IA & Documents</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
              Assistant de création de document
            </h1>
          </div>

          {/* STEPPER PILLS */}
          <div className="flex items-center gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <StepPill number={1} label="Rédaction" active={currentStep === 1} completed={currentStep > 1} onClick={() => setCurrentStep(1)} />
            <span className="text-slate-300">→</span>
            <StepPill number={2} label="Pièces" active={currentStep === 2} completed={currentStep > 2} onClick={() => setCurrentStep(2)} />
            <span className="text-slate-300">→</span>
            <StepPill number={3} label="Paiement" active={currentStep === 3} completed={currentStep > 3} onClick={() => setCurrentStep(3)} />
            <span className="text-slate-300">→</span>
            <StepPill number={4} label="Téléchargement" active={currentStep === 4} completed={currentStep === 4} onClick={() => setCurrentStep(4)} />
          </div>
        </div>

        {/* STEP 1: RÉDACTION (CHAT & PREVIEW) */}
        {currentStep === 1 && (
          <div className="grid gap-6 lg:grid-cols-12">
            {/* LEFT: AI CHAT */}
            <div className="lg:col-span-6 flex flex-col h-[560px] rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-700 text-white font-extrabold text-base shadow-md shadow-blue-700/20">
                  🤖
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Assistant BUROIA IA</h3>
                  <p className="text-xs text-slate-500">Posez vos questions ou décrivez votre besoin</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "USER" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                        msg.sender === "USER"
                          ? "bg-blue-700 text-white rounded-br-none"
                          : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-5 py-2 flex flex-wrap gap-2 border-t border-slate-100 bg-white">
                <button
                  onClick={() => setChatInput("Oui, pour un poste de Développeur Web")}
                  className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition"
                >
                  Oui, un poste précis
                </button>
                <button
                  onClick={() => setChatInput("Non, modèle général")}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  Non, modèle général
                </button>
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                />
                <button
                  type="submit"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-700 text-white font-bold shadow-md shadow-blue-700/20 hover:bg-blue-800 transition"
                >
                  ➔
                </button>
              </form>
            </div>

            {/* RIGHT: LIVE DOCUMENT PREVIEW */}
            <div className="lg:col-span-6 flex flex-col h-[560px] rounded-3xl border border-slate-200 bg-white shadow-md p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Aperçu du document</span>
                  <h3 className="text-base font-bold text-slate-900">{documentContent.title}</h3>
                </div>
                <button
                  onClick={() => setIsEditingDoc(!isEditingDoc)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  {isEditingDoc ? "✓ Sauvegarder" : "✏️ Modifier"}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-amber-50/30 p-6 text-xs text-slate-800 font-serif leading-relaxed space-y-4 shadow-inner">
                <div className="text-right font-semibold text-slate-600">
                  {documentContent.date}
                </div>
                <div className="font-bold text-slate-900">
                  {documentContent.subject}
                </div>
                <div className="font-semibold">{documentContent.recipient}</div>

                {isEditingDoc ? (
                  <textarea
                    value={documentContent.body}
                    onChange={(e) => setDocumentContent({ ...documentContent, body: e.target.value })}
                    className="w-full h-44 rounded-xl border border-blue-300 bg-white p-3 text-xs font-serif leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                ) : (
                  <p className="whitespace-pre-line text-slate-700">
                    {documentContent.body}
                  </p>
                )}

                <div className="pt-4 text-right font-bold text-slate-900 font-sans">
                  {documentContent.signature}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="rounded-xl bg-blue-700 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-700/20 hover:bg-blue-800 transition flex items-center gap-2"
                >
                  <span>Suivant : Pièces justificatives</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PIÈCES JUSTIFICATIVES */}
        {currentStep === 2 && (
          <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-md space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900">Pièces justificatives requises</h2>
              <p className="text-xs text-slate-500 mt-1">
                Ajoutez les documents demandés pour compléter votre dossier administratif.
              </p>
            </div>

            <div className="space-y-4">
              <UploadItem
                title="Pièce d'identité (CNI)"
                subtitle="PDF, JPG, PNG · max 5 Mo"
                uploaded={uploads.cni}
                onToggle={() => handleFileUpload("cni")}
              />
              <UploadItem
                title="Photo d'identité récente"
                subtitle="PDF, JPG, PNG · max 5 Mo"
                uploaded={uploads.photo}
                onToggle={() => handleFileUpload("photo")}
              />
              <UploadItem
                title="Curriculum Vitae (CV)"
                subtitle="PDF, DOCX · max 5 Mo"
                uploaded={uploads.cv}
                onToggle={() => handleFileUpload("cv")}
              />
              <UploadItem
                title="Diplôme ou Attestation"
                subtitle="PDF, JPG, PNG · max 5 Mo"
                uploaded={uploads.diploma}
                onToggle={() => handleFileUpload("diploma")}
              />
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-6">
              <button
                onClick={() => setCurrentStep(1)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                ← Retour
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="rounded-xl bg-blue-700 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-700/20 hover:bg-blue-800"
              >
                Suivant : Paiement →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PAIEMENT EN LIGNE */}
        {currentStep === 3 && (
          <div className="max-w-2xl mx-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-md space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900">Paiement en ligne</h2>
              <p className="text-xs text-slate-500 mt-1">
                Choisissez votre mode de paiement pour finaliser votre démarche.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white text-lg font-bold">
                  📄
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{documentContent.title}</h3>
                  <p className="text-xs text-blue-700 font-medium">Service de rédaction assistée par IA</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-slate-900">5 000 FCFA</span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Mode de paiement</p>

              <div
                onClick={() => setPaymentMode("MOMO")}
                className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition ${
                  paymentMode === "MOMO" ? "border-blue-600 bg-blue-50/40" : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input type="radio" checked={paymentMode === "MOMO"} readOnly className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Mobile Money (MTN / Orange)</p>
                    <p className="text-[11px] text-slate-500">Paiement instantané par téléphone</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-yellow-400 px-2 py-0.5 text-[10px] font-black text-black">MTN MoMo</span>
                  <span className="rounded bg-orange-600 px-2 py-0.5 text-[10px] font-black text-white">OM</span>
                </div>
              </div>

              {paymentMode === "MOMO" && (
                <div className="pl-6 space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setMomoProvider("MTN")}
                      className={`flex-1 rounded-xl py-2 text-xs font-bold border transition ${
                        momoProvider === "MTN" ? "bg-yellow-400 text-black border-yellow-500" : "bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      MTN Mobile Money
                    </button>
                    <button
                      type="button"
                      onClick={() => setMomoProvider("ORANGE")}
                      className={`flex-1 rounded-xl py-2 text-xs font-bold border transition ${
                        momoProvider === "ORANGE" ? "bg-orange-600 text-white border-orange-700" : "bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      Orange Money
                    </button>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Numéro de téléphone MoMo</label>
                    <input
                      type="text"
                      value={momoPhone}
                      onChange={(e) => setMomoPhone(e.target.value)}
                      className="w-full mt-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>
              )}

              <div
                onClick={() => setPaymentMode("CARD")}
                className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition ${
                  paymentMode === "CARD" ? "border-blue-600 bg-blue-50/40" : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input type="radio" checked={paymentMode === "CARD"} readOnly className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Carte bancaire</p>
                    <p className="text-[11px] text-slate-500">VISA, Mastercard</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400">💳 VISA</span>
              </div>

              <div
                onClick={() => setPaymentMode("PAYPAL")}
                className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition ${
                  paymentMode === "PAYPAL" ? "border-blue-600 bg-blue-50/40" : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input type="radio" checked={paymentMode === "PAYPAL"} readOnly className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">PayPal</p>
                    <p className="text-[11px] text-slate-500">Paiement international sécurisé</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-800">PayPal</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-6">
              <button
                onClick={() => setCurrentStep(2)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                ← Retour
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="rounded-xl bg-blue-700 px-7 py-3 text-xs font-bold text-white shadow-lg shadow-blue-700/20 hover:bg-blue-800"
              >
                Payer 5 000 FCFA
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: TÉLÉCHARGEMENT & CONFIRMATION */}
        {currentStep === 4 && (
          <div className="max-w-2xl mx-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-xl text-center space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-4xl shadow-inner">
              ✓
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">Votre document est prêt !</h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Votre lettre a été générée avec succès et le règlement a été validé.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-left text-xs space-y-3">
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-semibold">Service</span>
                <span className="font-bold text-slate-900">{documentContent.title}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-semibold">Montant payé</span>
                <span className="font-bold text-emerald-600">5 000 FCFA (Validé)</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500 font-semibold">Date</span>
                <span className="font-semibold text-slate-700">{documentContent.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Statut</span>
                <span className="font-bold text-emerald-700">🟢 Prêt à imprimer</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 pt-2">
              <Link
                href="/documents"
                className="rounded-2xl bg-blue-700 py-3.5 text-xs font-bold text-white shadow-xl shadow-blue-700/20 hover:bg-blue-800 transition"
              >
                📥 Voir mes documents
              </Link>

              <Link
                href="/kiosks"
                className="rounded-2xl border border-blue-600 bg-blue-50 py-3.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
              >
                📍 Localiser une borne proche
              </Link>
            </div>

            <div className="pt-2">
              <Link
                href="/dashboard"
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 hover:underline"
              >
                ← Retourner au tableau de bord
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function StepPill({
  number,
  label,
  active,
  completed,
  onClick,
}: {
  number: number;
  label: string;
  active: boolean;
  completed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition whitespace-nowrap ${
        active
          ? "bg-blue-700 text-white shadow-md shadow-blue-700/20"
          : completed
          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          : "bg-slate-50 text-slate-500 hover:bg-slate-100"
      }`}
    >
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
          active ? "bg-white text-blue-700" : completed ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
        }`}
      >
        {completed ? "✓" : number}
      </span>
      <span>{label}</span>
    </button>
  );
}

function UploadItem({
  title,
  subtitle,
  uploaded,
  onToggle,
}: {
  title: string;
  subtitle: string;
  uploaded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold ${
          uploaded ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
        }`}>
          {uploaded ? "📄" : "📁"}
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900">{title}</h4>
          <p className="text-[11px] text-slate-500">{subtitle}</p>
        </div>
      </div>

      <button
        onClick={onToggle}
        className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
          uploaded
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
            : "bg-blue-700 text-white shadow-md shadow-blue-700/20 hover:bg-blue-800"
        }`}
      >
        {uploaded ? "✓ Téléversé" : "Téléverser"}
      </button>
    </div>
  );
}
