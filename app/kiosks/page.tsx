"use client";

import { useMemo, useState } from "react";
import AppShell from "@/app/_components/AppShell";

type KioskLocation = {
  id: string;
  name: string;
  neighborhood: string;
  address: string;
  city: string;
  distanceKm: number;
  driveTimeMin: number;
  status: "AVAILABLE" | "BUSY" | "MAINTENANCE";
  hours: string;
  phone: string;
  paperLevel: number;
  tonerLevel: number;
  services: string[];
  coordinates: { x: number; y: number }; // SVG Map percentage coords
  lat: number;
  lng: number;
};

const KIOSK_LIST: KioskLocation[] = [
  {
    id: "KIOSK-YDE-001",
    name: "Buroia Kiosk - Carrefour Bastos",
    neighborhood: "Bastos",
    address: "Avenue de la Liberté, Yaoundé",
    city: "Yaoundé",
    distanceKm: 1.2,
    driveTimeMin: 4,
    status: "AVAILABLE",
    hours: "Lun - Sam: 07h00 - 20h00 · Dim: 08h00 - 18h00",
    phone: "+237 670 123 456",
    paperLevel: 85,
    tonerLevel: 92,
    services: ["Impression HD", "Scan CNI / Diplôme", "Paiement Mobile Money", "Récupération QR"],
    coordinates: { x: 55, y: 38 },
    lat: 3.8864,
    lng: 11.5167,
  },
  {
    id: "KIOSK-YDE-002",
    name: "Buroia Kiosk - Mvan Gare",
    neighborhood: "Mvan",
    address: "Carrefour Mvan, face Express Union, Yaoundé",
    city: "Yaoundé",
    distanceKm: 2.8,
    driveTimeMin: 8,
    status: "AVAILABLE",
    hours: "Lun - Sam: 06h30 - 21h00 · Dim: 07h30 - 19h00",
    phone: "+237 690 234 567",
    paperLevel: 64,
    tonerLevel: 78,
    services: ["Impression HD", "Scan Rapide", "MoMo / Om", "Paiement Cash"],
    coordinates: { x: 70, y: 72 },
    lat: 3.8421,
    lng: 11.5098,
  },
  {
    id: "KIOSK-YDE-003",
    name: "Buroia Kiosk - Mokolo Marché",
    neighborhood: "Mokolo",
    address: "Entrée Principale Marché Mokolo, Yaoundé",
    city: "Yaoundé",
    distanceKm: 3.5,
    driveTimeMin: 11,
    status: "MAINTENANCE",
    hours: "Lun - Sam: 07h30 - 18h30",
    phone: "+237 675 345 678",
    paperLevel: 12,
    tonerLevel: 15,
    services: ["Impression", "Scan"],
    coordinates: { x: 30, y: 45 },
    lat: 3.8712,
    lng: 11.4988,
  },
  {
    id: "KIOSK-YDE-004",
    name: "Buroia Kiosk - Biyem-Assi Acacias",
    neighborhood: "Biyem-Assi",
    address: "Rond-point Acacias, Yaoundé",
    city: "Yaoundé",
    distanceKm: 4.1,
    driveTimeMin: 14,
    status: "AVAILABLE",
    hours: "Lun - Sam: 07h00 - 20h00",
    phone: "+237 699 456 789",
    paperLevel: 90,
    tonerLevel: 88,
    services: ["Impression HD", "Scan CNI", "Paiement Carte / MoMo"],
    coordinates: { x: 25, y: 78 },
    lat: 3.8345,
    lng: 11.4876,
  },
  {
    id: "KIOSK-YDE-005",
    name: "Buroia Kiosk - Omnisports Stade",
    neighborhood: "Omnisports",
    address: "Avenue Ahmadou Ahidjo, Yaoundé",
    city: "Yaoundé",
    distanceKm: 5.0,
    driveTimeMin: 15,
    status: "AVAILABLE",
    hours: "Lun - Sam: 07h00 - 20h00",
    phone: "+237 671 567 890",
    paperLevel: 75,
    tonerLevel: 81,
    services: ["Impression HD", "Scan", "Paiement Mobile"],
    coordinates: { x: 80, y: 30 },
    lat: 3.8920,
    lng: 11.5312,
  },
];

export default function KiosksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKioskId, setSelectedKioskId] = useState<string>("KIOSK-YDE-001");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "AVAILABLE" | "NEARBY">("ALL");
  const [showNavDirections, setShowNavDirections] = useState(false);
  const [userAddress] = useState("Ma position · Bastos, Yaoundé");

  const selectedKiosk = useMemo(
    () => KIOSK_LIST.find((k) => k.id === selectedKioskId) || KIOSK_LIST[0],
    [selectedKioskId]
  );

  const filteredKiosks = useMemo(() => {
    return KIOSK_LIST.filter((kiosk) => {
      const matchesSearch =
        kiosk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kiosk.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kiosk.address.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filterStatus === "AVAILABLE") return kiosk.status === "AVAILABLE";
      if (filterStatus === "NEARBY") return kiosk.distanceKm <= 3.0;
      return true;
    });
  }, [searchQuery, filterStatus]);

  const openGoogleMaps = (kiosk: KioskLocation) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${kiosk.lat},${kiosk.lng}&travelmode=driving`;
    window.open(url, "_blank");
  };

  return (
    <AppShell activeTab="kiosks">
      <div className="space-y-6">
      {/* PAGE TITLE & BREADCRUMB */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
            <span>BUROIA</span>
            <span>/</span>
            <span>Bornes & Kiosques</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
            Trouver un kiosque à proximité
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Imprimez, scannez et récupérez vos documents dans la borne BUROIA la plus proche.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNavDirections(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800"
          >
            <span>🧭</span>
            <span>Obtenir l&apos;itinéraire</span>
          </button>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Chercher un quartier (ex. Bastos, Mvan, Mokolo...)"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          {/* Location Badge */}
          <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/80 px-3.5 py-2 text-xs font-semibold text-blue-800">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-600" />
            </span>
            <span>{userAddress}</span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setFilterStatus("ALL")}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
                filterStatus === "ALL"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Tous ({KIOSK_LIST.length})
            </button>
            <button
              onClick={() => setFilterStatus("AVAILABLE")}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
                filterStatus === "AVAILABLE"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              Disponibles ({KIOSK_LIST.filter((k) => k.status === "AVAILABLE").length})
            </button>
            <button
              onClick={() => setFilterStatus("NEARBY")}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
                filterStatus === "NEARBY"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              Proches &lt; 3km
            </button>
          </div>
        </div>
      </div>

      {/* MAIN SPLIT VIEW: MAP & LIST / DETAIL */}
      <div className="grid gap-6 lg:grid-cols-12">

        {/* LEFT COLUMN: INTERACTIVE MAP (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="relative h-[480px] w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 shadow-xl">

            {/* SVG MAP CANVAS VISUALIZER */}
            <svg className="h-full w-full object-cover" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                {/* Grid Pattern */}
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                </pattern>
                {/* Route Gradient */}
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>

              {/* Map Background Grid */}
              <rect width="100" height="100" fill="#0f172a" />
              <rect width="100" height="100" fill="url(#grid)" />

              {/* Main Roads / Rivers Simulation */}
              <path d="M 0 50 Q 30 40, 55 38 T 100 30" fill="none" stroke="#334155" strokeWidth="2.5" />
              <path d="M 55 38 L 70 72 L 80 100" fill="none" stroke="#334155" strokeWidth="2" />
              <path d="M 30 0 L 30 45 L 25 78" fill="none" stroke="#334155" strokeWidth="2" />
              <path d="M 55 38 L 80 30" fill="none" stroke="#334155" strokeWidth="1.8" />

              {/* DOTTED ROUTE PATH to Selected Kiosk */}
              {selectedKiosk && (
                <path
                  d={`M 50 50 Q ${ (50 + selectedKiosk.coordinates.x) / 2 - 5 } ${ (50 + selectedKiosk.coordinates.y) / 2 }, ${selectedKiosk.coordinates.x} ${selectedKiosk.coordinates.y}`}
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="1.5"
                  strokeDasharray="1.5, 1"
                  className="animate-pulse"
                />
              )}

              {/* USER LOCATION MARKER (Ma position) */}
              <g transform="translate(50, 50)">
                <circle r="4" fill="#3b82f6" fillOpacity="0.25" className="animate-ping" />
                <circle r="2.2" fill="#2563eb" stroke="#ffffff" strokeWidth="0.6" />
                <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="2.2" fontWeight="bold">
                  Ma position
                </text>
              </g>

              {/* KIOSK LOCATION PINS */}
              {filteredKiosks.map((kiosk) => {
                const isSelected = kiosk.id === selectedKiosk.id;
                const isAvailable = kiosk.status === "AVAILABLE";

                return (
                  <g
                    key={kiosk.id}
                    transform={`translate(${kiosk.coordinates.x}, ${kiosk.coordinates.y})`}
                    onClick={() => setSelectedKioskId(kiosk.id)}
                    className="cursor-pointer transition-transform duration-200 hover:scale-125"
                  >
                    {/* Pulsing selection ring */}
                    {isSelected && (
                      <circle r="4" fill="#3b82f6" fillOpacity="0.3" className="animate-ping" />
                    )}

                    {/* Pin Background */}
                    <circle
                      r={isSelected ? "3" : "2.2"}
                      fill={isAvailable ? (isSelected ? "#2563eb" : "#059669") : "#dc2626"}
                      stroke="#ffffff"
                      strokeWidth="0.6"
                      shadow-md="true"
                    />

                    {/* Icon inside pin */}
                    <text
                      x="0"
                      y="0.7"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={isSelected ? "2.2" : "1.7"}
                      fontWeight="bold"
                    >
                      🖨️
                    </text>

                    {/* Kiosk Name Tag on hover/selected */}
                    {isSelected && (
                      <g transform="translate(0, -4.5)">
                        <rect
                          x="-12"
                          y="-2.5"
                          width="24"
                          height="4"
                          rx="1"
                          fill="#0f172a"
                          stroke="#3b82f6"
                          strokeWidth="0.4"
                        />
                        <text x="0" y="0.2" textAnchor="middle" fill="#ffffff" fontSize="1.8" fontWeight="bold">
                          {kiosk.neighborhood} ({kiosk.driveTimeMin} min)
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* FLOATING ROUTE OVERLAY BADGE */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-900/90 px-4 py-3 text-white backdrop-blur shadow-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-lg">
                📍
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-300">Borne la plus proche</p>
                <p className="text-sm font-bold">{selectedKiosk.name}</p>
                <p className="text-xs text-slate-300">
                  <span className="font-semibold text-emerald-400">⚡ {selectedKiosk.driveTimeMin} min</span> ({selectedKiosk.distanceKm} km) · {selectedKiosk.address}
                </p>
              </div>
            </div>

            {/* MAP CONTROL BUTTONS */}
            <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
              <button
                onClick={() => setSelectedKioskId("KIOSK-YDE-001")}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/90 text-white shadow-lg backdrop-blur hover:bg-slate-800"
                title="Recentrer sur ma position"
              >
                🎯
              </button>
              <button
                onClick={() => openGoogleMaps(selectedKiosk)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500 bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                title="Ouvrir dans Google Maps"
              >
                🗺️
              </button>
            </div>
          </div>

          {/* SELECTED KIOSK ACTIONS BAR */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`inline-flex h-3 w-3 rounded-full ${selectedKiosk.status === "AVAILABLE" ? "bg-emerald-500" : "bg-red-500"}`} />
              <div>
                <span className="text-xs font-semibold text-slate-500">Borne sélectionnée</span>
                <h3 className="text-sm font-bold text-slate-900">{selectedKiosk.name}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openGoogleMaps(selectedKiosk)}
                className="rounded-xl bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-700/20 hover:bg-blue-800 transition"
              >
                Voir l&apos;itinéraire ({selectedKiosk.driveTimeMin} min)
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: KIOSK DETAILS & LIST (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">

          {/* SELECTED KIOSK CARD DETAILS (Mockup #8) */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                  selectedKiosk.status === "AVAILABLE"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>
                  <span className={`h-2 w-2 rounded-full ${selectedKiosk.status === "AVAILABLE" ? "bg-emerald-500" : "bg-amber-500"}`} />
                  {selectedKiosk.status === "AVAILABLE" ? "Disponible" : "En maintenance"}
                </span>

                <h2 className="mt-3 text-xl font-extrabold text-slate-900 leading-tight">
                  {selectedKiosk.name}
                </h2>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  📍 {selectedKiosk.address}
                </p>
              </div>

              <div className="text-right">
                <span className="text-lg font-black text-blue-700">{selectedKiosk.distanceKm} km</span>
                <p className="text-xs font-semibold text-emerald-600">{selectedKiosk.driveTimeMin} min en voiture</p>
              </div>
            </div>

            {/* MOCK PHOTO OF KIOSK MACHINE */}
            <div className="relative h-36 w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-900 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-slate-900/80" />
              <div className="relative z-10 flex items-center gap-4 text-white">
                <div className="flex h-16 w-12 flex-col items-center justify-between rounded-lg border-2 border-blue-400 bg-blue-950 p-2 shadow-inner">
                  <span className="h-2 w-6 rounded bg-blue-400 animate-pulse" />
                  <span className="text-xs font-bold text-blue-200">BUROIA</span>
                  <span className="h-4 w-8 rounded bg-slate-800 border border-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-300">Borne physique BUROIA</p>
                  <p className="text-sm font-semibold">Ecran tactile & Scanner automatique</p>
                  <p className="text-xs text-slate-300 mt-1">Impression N&W + Couleur HD</p>
                </div>
              </div>
            </div>

            {/* CONSUMABLES / HEALTH METRICS */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Papier</span>
                  <span className="font-bold text-slate-800">{selectedKiosk.paperLevel}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full ${selectedKiosk.paperLevel < 20 ? "bg-red-500" : "bg-emerald-500"}`}
                    style={{ width: `${selectedKiosk.paperLevel}%` }}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Toner</span>
                  <span className="font-bold text-slate-800">{selectedKiosk.tonerLevel}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full ${selectedKiosk.tonerLevel < 20 ? "bg-red-500" : "bg-emerald-500"}`}
                    style={{ width: `${selectedKiosk.tonerLevel}%` }}
                  />
                </div>
              </div>
            </div>

            {/* HOURS & CONTACT */}
            <div className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">🕒 Horaires d&apos;ouverture</span>
                <span className="font-bold text-slate-800">{selectedKiosk.hours}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">📞 Support borne</span>
                <a href={`tel:${selectedKiosk.phone}`} className="font-bold text-blue-700 hover:underline">
                  {selectedKiosk.phone}
                </a>
              </div>
            </div>

            {/* SERVICES AVAILABLE */}
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-bold text-slate-700 mb-2">Services disponibles sur cette borne :</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedKiosk.services.map((service) => (
                  <span
                    key={service}
                    className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-100"
                  >
                    ✓ {service}
                  </span>
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => openGoogleMaps(selectedKiosk)}
                className="w-full rounded-xl bg-blue-700 py-3 text-center text-xs font-bold text-white shadow-lg shadow-blue-700/20 hover:bg-blue-800 transition"
              >
                Obtenir l&apos;itinéraire
              </button>
              <a
                href={`tel:${selectedKiosk.phone}`}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 text-center text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Appeler
              </a>
            </div>
          </div>

          {/* NEARBY KIOSKS LIST */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 px-1">
              Toutes les bornes ({filteredKiosks.length})
            </h3>

            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {filteredKiosks.map((kiosk) => {
                const isSelected = kiosk.id === selectedKiosk.id;
                return (
                  <div
                    key={kiosk.id}
                    onClick={() => setSelectedKioskId(kiosk.id)}
                    className={`flex items-center justify-between rounded-2xl border p-3.5 cursor-pointer transition ${
                      isSelected
                        ? "border-blue-500 bg-blue-50/60 shadow-sm"
                        : "border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold ${
                        kiosk.status === "AVAILABLE" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        📍
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{kiosk.name}</h4>
                        <p className="text-[11px] text-slate-500">{kiosk.neighborhood} · {kiosk.address}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-extrabold text-blue-700">{kiosk.distanceKm} km</span>
                      <p className="text-[10px] text-emerald-600 font-semibold">{kiosk.driveTimeMin} min</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* NAVIGATION MODAL (Mockup #7) */}
      {showNavDirections && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          onClick={() => setShowNavDirections(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🗺️</span>
                <h3 className="text-base font-bold text-slate-900">Itinéraire vers le kiosque</h3>
              </div>
              <button
                onClick={() => setShowNavDirections(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
              >
                ×
              </button>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-700">Origine</span>
                <span className="text-xs font-bold text-slate-800">{userAddress}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-700">Destination</span>
                <span className="text-xs font-bold text-slate-800">{selectedKiosk.name}</span>
              </div>
              <div className="border-t border-blue-200/60 pt-2 flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-700">⏱️ Durée : {selectedKiosk.driveTimeMin} min</span>
                <span className="font-bold text-blue-800">📏 Distance : {selectedKiosk.distanceKm} km</span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-700 text-white font-bold text-[10px]">1</span>
                <p>Prenez la direction Nord sur Avenue de la Liberté vers Carrefour Bastos.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-700 text-white font-bold text-[10px]">2</span>
                <p>Au rond-point Bastos, la borne BUROIA se situe sur votre droite à côté du point d&apos;information.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => openGoogleMaps(selectedKiosk)}
                className="w-full rounded-xl bg-blue-700 py-3 text-center text-xs font-bold text-white shadow-lg shadow-blue-700/20 hover:bg-blue-800"
              >
                Ouvrir Google Maps
              </button>
              <button
                onClick={() => setShowNavDirections(false)}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 text-center text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AppShell>
  );
}
