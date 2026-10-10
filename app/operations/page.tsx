"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import "./operations.css";

type Kiosk = {
  id: string;
  location: string;
  status: "ONLINE" | "DEGRADED" | "OFFLINE";
  transactions: number;
  revenue: number;
  paper: number;
  toner: number;
  uptime: number;
};

type Incident = {
  id: string;
  recordId?: string;
  kiosk: string;
  title: string;
  severity: "P1" | "P2" | "P3" | "P4";
  age: string;
  status: "OPEN" | "IN_PROGRESS";
};

const initialKiosks: Kiosk[] = [
  { id: "YDE-001", location: "Bastos · Yaoundé", status: "ONLINE", transactions: 47, revenue: 186500, paper: 72, toner: 61, uptime: 99.4 },
  { id: "YDE-002", location: "Mvan · Yaoundé", status: "ONLINE", transactions: 51, revenue: 214000, paper: 12, toner: 58, uptime: 98.8 },
  { id: "YDE-003", location: "Mokolo · Yaoundé", status: "DEGRADED", transactions: 30, revenue: 126500, paper: 48, toner: 9, uptime: 94.2 },
];

const checklistItems = [
  "Inspection physique et sécurité",
  "Alimentation et UPS",
  "Connexion Internet",
  "Test imprimante et papier",
  "Test scanner",
  "Vérification du paiement",
  "Synchronisation serveur",
];

const navItems = [
  { label: "Vue d’ensemble", icon: "◫" },
  { label: "Kiosques", icon: "⌖" },
  { label: "Incidents", icon: "△" },
  { label: "Checklists", icon: "☑" },
  { label: "Rapports", icon: "▤" },
];

const money = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

export default function OperationsPage() {
  const [kiosks, setKiosks] = useState(initialKiosks);
  const [dataMode, setDataMode] = useState<"demo" | "connected">("demo");
  const [canManageKiosks, setCanManageKiosks] = useState(false);
  const [activeNav, setActiveNav] = useState("Vue d’ensemble");
  const [filter, setFilter] = useState("Tous");
  const [completedChecks, setCompletedChecks] = useState([0, 1, 2, 3, 4]);
  const [incidents, setIncidents] = useState<Incident[]>([
    { id: "INC-0248", kiosk: "YDE-003", title: "Toner presque épuisé", severity: "P2", age: "12 min", status: "OPEN" },
    { id: "INC-0247", kiosk: "YDE-002", title: "Niveau de papier bas", severity: "P3", age: "38 min", status: "OPEN" },
    { id: "INC-0246", kiosk: "YDE-001", title: "Contrôle qualité impression", severity: "P4", age: "1 h", status: "IN_PROGRESS" },
  ]);
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [incidentTitle, setIncidentTitle] = useState("");
  const [incidentKiosk, setIncidentKiosk] = useState("YDE-001");
  const [incidentSeverity, setIncidentSeverity] = useState<Incident["severity"]>("P3");
  const [incidentType, setIncidentType] = useState("OTHER");
  const [showKioskForm, setShowKioskForm] = useState(false);
  const [kioskCode, setKioskCode] = useState("");
  const [kioskLocation, setKioskLocation] = useState("");
  const [notice, setNotice] = useState("");

  const visibleKiosks = useMemo(
    () => kiosks.filter((kiosk) => filter === "Tous" || kiosk.status === filter.toUpperCase()),
    [filter, kiosks],
  );

  const openIncidents = incidents.filter((incident) => incident.status === "OPEN").length;
  const totalTransactions = kiosks.reduce((total, kiosk) => total + kiosk.transactions, 0);
  const totalRevenue = kiosks.reduce((total, kiosk) => total + kiosk.revenue, 0);
  const onlineCount = kiosks.filter((kiosk) => kiosk.status === "ONLINE").length;

  useEffect(() => {
    let cancelled = false;
    async function loadOperationsData() {
      try {
        const sessionResponse = await fetch("/api/auth/session", { cache: "no-store" });
        if (!sessionResponse.ok) return;
        const sessionData = await sessionResponse.json();
        const [kiosksResponse, incidentsResponse] = await Promise.all([
          fetch("/api/operations/kiosks", { cache: "no-store" }),
          fetch("/api/operations/incidents", { cache: "no-store" }),
        ]);
        if (!kiosksResponse.ok || !incidentsResponse.ok) return;
        const [kiosksData, incidentsData] = await Promise.all([kiosksResponse.json(), incidentsResponse.json()]);
        if (cancelled) return;

        const loadedKiosks = kiosksData.kiosks.map((kiosk: Record<string, unknown>) => {
          const consumables = kiosk.consumables as Record<string, number> | undefined;
          const status = typeof kiosk.status === "string" ? kiosk.status : "OFFLINE";
          return {
            id: String(kiosk.code),
            location: String(kiosk.location),
            status: status === "ONLINE" || status === "BUSY" ? "ONLINE" : status === "DEGRADED" || status === "ERROR" ? "DEGRADED" : "OFFLINE",
            transactions: Number(kiosk.transactionsToday ?? 0),
            revenue: Number(kiosk.revenueToday ?? 0),
            paper: Number(consumables?.paperPercent ?? 0),
            toner: Number(consumables?.tonerPercent ?? 0),
            uptime: Number(kiosk.uptimePercent ?? 0),
        } satisfies Kiosk;
        });
        setKiosks(loadedKiosks);
        if (loadedKiosks.length > 0) setIncidentKiosk((current) => loadedKiosks.some((kiosk: Kiosk) => kiosk.id === current) ? current : loadedKiosks[0].id);
        setIncidents(incidentsData.incidents
          .filter((incident: Record<string, unknown>) => !["CLOSED", "RESOLVED"].includes(String(incident.status)))
          .map((incident: Record<string, unknown>) => {
            const detectedAt = new Date(String(incident.detectedAt ?? Date.now())).getTime();
            const elapsedMinutes = Math.max(0, Math.floor((Date.now() - detectedAt) / 60000));
            return {
              id: String(incident.incidentNumber),
              recordId: String(incident._id),
              kiosk: String(incident.kioskId),
              title: String(incident.description),
              severity: incident.severity as Incident["severity"],
              age: elapsedMinutes < 60 ? `${elapsedMinutes} min` : `${Math.floor(elapsedMinutes / 60)} h`,
              status: ["LOGGED", "CLASSIFIED"].includes(String(incident.status)) ? "OPEN" : "IN_PROGRESS",
            } satisfies Incident;
          }));
        setCanManageKiosks(["SUPER_ADMIN", "OPERATIONS_MANAGER", "KIOSK_MANAGER"].includes(sessionData.user.role));
        setDataMode("connected");
      } catch {
        if (!cancelled) setNotice("Connexion aux données opérationnelles indisponible. Affichage de la démo.");
      }
    }
    void loadOperationsData();
    return () => { cancelled = true; };
  }, []);

  function toggleChecklist(index: number) {
    setCompletedChecks((current) => current.includes(index)
      ? current.filter((item) => item !== index)
      : [...current, index]);
  }

  async function createIncident(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = incidentTitle.trim();
    if (!title) return;
    if (dataMode === "connected") {
      try {
        const response = await fetch("/api/operations/incidents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: incidentType, severity: incidentSeverity, kioskId: incidentKiosk, description: title }),
        });
        const result = await response.json();
        if (!response.ok) {
          setNotice(result.message || "Impossible d’enregistrer l’incident.");
          return;
        }
        setIncidents((current) => [{
          id: result.incident.incidentNumber,
          recordId: result.incident._id,
          kiosk: result.incident.kioskId,
          title: result.incident.description,
          severity: result.incident.severity,
          age: "À l’instant",
          status: "OPEN",
        }, ...current]);
      } catch {
        setNotice("Impossible de contacter le service des incidents.");
        return;
      }
    } else {
      setIncidents((current) => [{
        id: `INC-${String(249 + current.length - 3).padStart(4, "0")}`,
        kiosk: incidentKiosk,
        title,
        severity: incidentSeverity,
        age: "À l’instant",
        status: "OPEN",
      }, ...current]);
    }
    setIncidentTitle("");
    setShowIncidentForm(false);
    setActiveNav("Incidents");
    setNotice("Incident enregistré dans le centre de contrôle.");
  }

  async function acknowledgeIncident(id: string) {
    const incident = incidents.find((item) => item.id === id);
    if (!incident) return;
    if (dataMode === "connected" && incident.recordId) {
      try {
        const response = await fetch(`/api/operations/incidents/${incident.recordId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "ASSIGNED" }),
        });
        const result = await response.json();
        if (!response.ok) {
          setNotice(result.message || "Impossible de prendre en charge l’incident.");
          return;
        }
      } catch {
        setNotice("Impossible de contacter le service des incidents.");
        return;
      }
    }
    setIncidents((current) => current.map((incident) => incident.id === id
      ? { ...incident, status: "IN_PROGRESS" }
      : incident));
    setNotice(`${id} pris en charge.`);
  }

  async function createKiosk(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const response = await fetch("/api/operations/kiosks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: kioskCode, location: kioskLocation }),
      });
      const result = await response.json();
      if (!response.ok) {
        setNotice(result.message || "Impossible d’enregistrer le kiosque.");
        return;
      }
      const record = result.kiosk;
      setKiosks((current) => [...current, {
        id: record.code,
        location: record.location,
        status: "OFFLINE",
        transactions: 0,
        revenue: 0,
        paper: 100,
        toner: 100,
        uptime: 0,
      }]);
      setIncidentKiosk(record.code);
      setKioskCode("");
      setKioskLocation("");
      setShowKioskForm(false);
      setNotice("Kiosque enregistré dans MongoDB.");
    } catch {
      setNotice("Impossible de contacter le service des kiosques.");
    }
  }

  function downloadReport() {
    const rows = [
      ["Kiosque", "Emplacement", "Statut", "Transactions", "Chiffre d'affaires (FCFA)", "Papier (%)", "Toner (%)"],
      ...kiosks.map((kiosk) => [kiosk.id, kiosk.location, kiosk.status, String(kiosk.transactions), String(kiosk.revenue), String(kiosk.paper), String(kiosk.toner)]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(";")).join("\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "buroia-rapport-operations-demo.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("Rapport CSV téléchargé.");
  }

  const moduleContent = activeNav === "Kiosques" ? (
    <section className="ops-panel ops-module-panel">
      <div className="ops-panel-heading"><div><h2>Réseau pilote · Yaoundé</h2><p>État, activité et consommables des kiosques BUROIA</p></div><span className="ops-priority-count">{onlineCount} en ligne</span></div>
      <div className="ops-filter-row">{["Tous", "Online", "Degraded", "Offline"].map((option) => <button key={option} className={filter === option ? "ops-filter active" : "ops-filter"} onClick={() => setFilter(option)}>{option === "Online" ? "En ligne" : option === "Degraded" ? "Dégradé" : option === "Offline" ? "Hors ligne" : "Tous"}</button>)}</div>
      <div className="ops-kiosk-list">{visibleKiosks.map((kiosk) => <KioskRow key={kiosk.id} kiosk={kiosk} />)}{visibleKiosks.length === 0 && <div className="ops-empty-state">Aucun kiosque dans cet état.</div>}</div>
    </section>
  ) : activeNav === "Incidents" ? (
    <section className="ops-panel ops-module-panel">
      <div className="ops-panel-heading"><div><h2>Registre des incidents</h2><p>Détection, prise en charge et suivi des opérations</p></div><span className="ops-priority-count">{openIncidents} ouverts</span></div>
      <div className="ops-incident-table"><div className="ops-table-head"><span>INCIDENT</span><span>KIOSQUE</span><span>PRIORITÉ</span><span>ÂGE</span><span>ÉTAT</span><span>ACTION</span></div>{incidents.map((incident) => <div className="ops-table-row" key={incident.id}><div><strong>{incident.title}</strong><small>{incident.id}</small></div><span>{incident.kiosk}</span><span className={`ops-severity-label ${incident.severity.toLowerCase()}`}>{incident.severity}</span><span>{incident.age}</span><span className={`ops-incident-status ${incident.status.toLowerCase()}`}>{incident.status === "OPEN" ? "Ouvert" : "En cours"}</span>{incident.status === "OPEN" ? <button onClick={() => acknowledgeIncident(incident.id)}>Prendre en charge</button> : <span className="ops-assigned">Équipe opérations</span>}</div>)}{incidents.length === 0 && <div className="ops-empty-state">Aucun incident enregistré.</div>}</div>
    </section>
  ) : activeNav === "Checklists" ? (
    <section className="ops-panel ops-module-panel ops-full-checklist">
      <div className="ops-panel-heading"><div><h2>Ouverture du kiosque YDE-001</h2><p>Checklist quotidienne · Quart du matin · 7 octobre 2026</p></div><span className="ops-check-progress">{completedChecks.length}/{checklistItems.length} terminés</span></div>
      <div className="ops-progress-track"><span style={{ width: `${completedChecks.length / checklistItems.length * 100}%` }} /></div>
      <div className="ops-check-list">{checklistItems.map((item, index) => <label key={item} className="ops-check-item"><input type="checkbox" checked={completedChecks.includes(index)} onChange={() => toggleChecklist(index)} /><span className="ops-custom-check">✓</span><span className={completedChecks.includes(index) ? "checked" : ""}>{item}</span><small>{completedChecks.includes(index) ? "Validé" : "En attente"}</small></label>)}</div>
    </section>
  ) : (
    <section className="ops-panel ops-module-panel">
      <div className="ops-panel-heading"><div><h2>Rapport opérationnel quotidien</h2><p>Réseau pilote de Yaoundé · 7 octobre 2026</p></div><button className="ops-button primary" onClick={downloadReport}>↓ Télécharger CSV</button></div>
      <div className="ops-report-grid"><div><small>Transactions</small><strong>{totalTransactions}</strong><span>sur 3 kiosques</span></div><div><small>Chiffre d’affaires</small><strong>{money.format(totalRevenue)} FCFA</strong><span>avant rapprochement</span></div><div><small>Disponibilité moyenne</small><strong>{(kiosks.reduce((sum, kiosk) => sum + kiosk.uptime, 0) / kiosks.length).toFixed(1)} %</strong><span>temps de fonctionnement</span></div><div><small>Incidents ouverts</small><strong>{openIncidents}</strong><span>à traiter aujourd’hui</span></div></div>
      <p className="ops-report-note">Les chiffres affichés sont des données de démonstration. Les rapports réels nécessiteront la connexion aux services de caisse, de paiement et de supervision des kiosques.</p>
    </section>
  );

  return (
    <main className="ops-shell min-h-screen text-slate-900">
      <aside className="ops-sidebar">
        <Link href="/" className="ops-brand">BUROIA<span>.</span></Link>
        <div className="ops-workspace-label">ESPACE DE TRAVAIL</div>
        <div className="ops-workspace"><span className="ops-workspace-mark">B</span><span><strong>BUROIA</strong><small>Opérations · Pilote</small></span><span className="ops-chevron">⌄</span></div>
        <div className="ops-section-label">CENTRE DE CONTRÔLE</div>
        <nav className="ops-nav" aria-label="Navigation opérations">
          {navItems.map((item) => (
            <button key={item.label} onClick={() => setActiveNav(item.label)} className={activeNav === item.label ? "ops-nav-item active" : "ops-nav-item"}>
              <span className="ops-nav-icon">{item.icon}</span>{item.label}
              {item.label === "Incidents" && openIncidents > 0 && <span className="ops-nav-count">{openIncidents}</span>}
            </button>
          ))}
        </nav>
        <div className="ops-section-label ops-modules-label">AUTRES MODULES</div>
        <div className="ops-module-item"><span className="ops-module-dot compliance-dot" />Conformité <span className="ops-soon">À venir</span></div>
        <div className="ops-module-item"><span className="ops-module-dot crm-dot" />CRM & ventes <span className="ops-soon">À venir</span></div>
        <div className="ops-sidebar-bottom">
          <div className="ops-demo-badge"><span />{dataMode === "connected" ? "DONNÉES MONGODB CONNECTÉES" : "DONNÉES DE DÉMONSTRATION"}</div>
          <Link href="/" className="ops-back-link">← Retour au site BUROIA</Link>
          <div className="ops-user"><div className="ops-avatar">AO</div><span><strong>Admin opérations</strong><small>Équipe BUROIA</small></span><span className="ops-chevron">···</span></div>
        </div>
      </aside>

      <section className="ops-main">
        <header className="ops-topbar">
          <div className="ops-breadcrumb">BUROIA <span>/</span> Opérations <span>/</span> <strong>{activeNav}</strong></div>
          <div className="ops-topbar-actions"><span className="ops-live"><i />{dataMode === "connected" ? "Session sécurisée" : "Aperçu de démonstration"}</span><button className="ops-icon-button" aria-label="Notifications">♧<b>{openIncidents}</b></button><div className="ops-avatar top-avatar">AO</div></div>
        </header>

        <div className="ops-content">
          <div className="ops-page-heading">
            <div><div className="ops-eyebrow">MERCREDI 7 OCTOBRE 2026 <span>·</span> YAOUNDÉ</div><h1>{activeNav === "Vue d’ensemble" ? "Centre des opérations" : activeNav}</h1><p>Suivez l’activité de vos kiosques et coordonnez les opérations du jour.</p></div>
            <div className="ops-heading-actions">{canManageKiosks && dataMode === "connected" && <button className="ops-button secondary" onClick={() => setShowKioskForm(true)}><span>＋</span> Ajouter un kiosque</button>}<button className="ops-button secondary" onClick={downloadReport}><span>↓</span> Exporter le rapport</button><button className="ops-button primary" onClick={() => setShowIncidentForm(true)}><span>＋</span> Déclarer un incident</button></div>
          </div>

          {notice && <div className="ops-toast" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Fermer">×</button></div>}

          <div className="ops-kpi-grid">
            <MetricCard label="Kiosques en ligne" value={`${onlineCount} / ${kiosks.length}`} trend={`${kiosks.filter((kiosk) => kiosk.status === "DEGRADED").length} kiosque(s) dégradé(s)`} icon="⌖" tone="blue" />
            <MetricCard label="Transactions aujourd’hui" value={String(totalTransactions)} trend={dataMode === "connected" ? "Depuis les kiosques enregistrés" : "+12,8 % vs hier · démo"} icon="↗" tone="green" />
            <MetricCard label="Chiffre d’affaires" value={`${money.format(totalRevenue)} FCFA`} trend={dataMode === "connected" ? "Cumul enregistré aujourd’hui" : "+8,4 % vs hier · démo"} icon="₣" tone="violet" />
            <MetricCard label="Incidents ouverts" value={String(openIncidents)} trend="1 priorité élevée" icon="△" tone="orange" />
          </div>

          {activeNav === "Vue d’ensemble" ? <>
          <div className="ops-primary-grid">
            <section className="ops-panel kiosk-panel">
              <div className="ops-panel-heading"><div><h2>État des kiosques</h2><p>Vue illustrative du réseau pilote</p></div><button className="ops-text-button" onClick={() => setActiveNav("Kiosques")}>Voir les kiosques <span>→</span></button></div>
              <div className="ops-filter-row">
                {["Tous", "Online", "Degraded", "Offline"].map((option) => <button key={option} className={filter === option ? "ops-filter active" : "ops-filter"} onClick={() => setFilter(option)}>{option === "Online" ? "En ligne" : option === "Degraded" ? "Dégradé" : option === "Offline" ? "Hors ligne" : "Tous"}{option === "Tous" && <span>3</span>}</button>)}
              </div>
              <div className="ops-kiosk-list">
                {visibleKiosks.map((kiosk) => <KioskRow key={kiosk.id} kiosk={kiosk} />)}
                {visibleKiosks.length === 0 && <div className="ops-empty-state">Aucun kiosque dans cet état.</div>}
              </div>
              <div className="ops-kiosk-footer"><span><i className="legend-online" />En ligne <b>2</b></span><span><i className="legend-degraded" />Dégradé <b>1</b></span><span><i className="legend-offline" />Hors ligne <b>0</b></span><button onClick={() => setActiveNav("Kiosques")}>Carte du réseau <span>↗</span></button></div>
            </section>

            <section className="ops-panel action-panel">
              <div className="ops-panel-heading"><div><h2>Centre d’action</h2><p>Éléments nécessitant votre attention</p></div><span className="ops-priority-count">{openIncidents} ouverts</span></div>
              <div className="ops-action-list">
                {incidents.filter((incident) => incident.status === "OPEN").slice(0, 4).map((incident) => <div className="ops-action-item" key={incident.id}><span className={`ops-severity ${incident.severity.toLowerCase()}`} /> <div className="ops-action-copy"><strong>{incident.title}</strong><span>{incident.kiosk} <i>·</i> {incident.age}</span></div><button onClick={() => acknowledgeIncident(incident.id)} aria-label={`Prendre en charge ${incident.id}`}>→</button></div>)}
                {openIncidents === 0 && <div className="ops-empty-state">Tout est sous contrôle. Aucun incident ouvert.</div>}
              </div>
              <button className="ops-view-all" onClick={() => setActiveNav("Incidents")}>Gérer les incidents <span>→</span></button>
            </section>
          </div>

          <div className="ops-secondary-grid">
            <section className="ops-panel checklist-panel">
              <div className="ops-panel-heading"><div><h2>Checklist d’ouverture</h2><p>YDE-001 <span>·</span> Quart du matin</p></div><span className="ops-check-progress">{completedChecks.length}/{checklistItems.length}</span></div>
              <div className="ops-progress-track"><span style={{ width: `${completedChecks.length / checklistItems.length * 100}%` }} /></div>
              <div className="ops-check-list">{checklistItems.map((item, index) => <label key={item} className="ops-check-item"><input type="checkbox" checked={completedChecks.includes(index)} onChange={() => toggleChecklist(index)} /><span className="ops-custom-check">✓</span><span className={completedChecks.includes(index) ? "checked" : ""}>{item}</span>{index === 5 && <em>À faire</em>}</label>)}</div>
              <button className="ops-view-all" onClick={() => setActiveNav("Checklists")}>Ouvrir la checklist <span>→</span></button>
            </section>

            <section className="ops-panel activity-panel">
              <div className="ops-panel-heading"><div><h2>Activité du jour</h2><p>Transactions par heure · tous les kiosques</p></div><button className="ops-period-button">Aujourd’hui⌄</button></div>
              <div className="ops-chart" role="img" aria-label="Graphique des transactions par heure"><div className="ops-chart-y"><span>40</span><span>30</span><span>20</span><span>10</span><span>0</span></div><div className="ops-chart-plot"><div className="ops-chart-grid"><i /><i /><i /><i /><i /></div><div className="ops-bars">{[19, 27, 23, 36, 31, 44, 38, 59, 47, 68, 53, 76].map((height, index) => <div key={index} className="ops-bar-wrap"><span className={index === 9 ? "ops-bar highlight" : "ops-bar"} style={{ height: `${height}%` }} /></div>)}</div><div className="ops-chart-x"><span>08h</span><span>10h</span><span>12h</span><span>14h</span><span>16h</span><span>18h</span></div></div></div>
              <div className="ops-chart-summary"><span><i className="chart-dot" />Transactions</span><strong>128 <small>aujourd’hui</small></strong></div>
            </section>
          </div>

          </> : moduleContent}

          <footer className="ops-footer"><span>BUROIA Operations Center <i>·</i> {dataMode === "connected" ? "Données opérationnelles persistées" : "Données illustratives pour le pilote"}</span><span>{dataMode === "connected" ? "Connecté à MongoDB" : "Échantillon statique"}</span></footer>
        </div>
      </section>

      {showKioskForm && <div className="ops-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowKioskForm(false); }}><form className="ops-modal" onSubmit={createKiosk}><button type="button" className="ops-modal-close" onClick={() => setShowKioskForm(false)} aria-label="Fermer">×</button><span className="ops-modal-icon">⌖</span><h2>Enregistrer un kiosque</h2><p>Le nouveau kiosque sera ajouté à votre organisation.</p><label htmlFor="kiosk-code">Code kiosque</label><input id="kiosk-code" value={kioskCode} onChange={(event) => setKioskCode(event.target.value)} placeholder="Ex. YDE-004" required /><label htmlFor="kiosk-location">Emplacement</label><input id="kiosk-location" value={kioskLocation} onChange={(event) => setKioskLocation(event.target.value)} placeholder="Quartier · Ville" required /><div className="ops-modal-actions"><button type="button" className="ops-button secondary" onClick={() => setShowKioskForm(false)}>Annuler</button><button type="submit" className="ops-button primary">Enregistrer</button></div></form></div>}
      {showIncidentForm && <div className="ops-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowIncidentForm(false); }}><form className="ops-modal" onSubmit={createIncident}><button type="button" className="ops-modal-close" onClick={() => setShowIncidentForm(false)} aria-label="Fermer">×</button><span className="ops-modal-icon">△</span><h2>Déclarer un incident</h2><p>Ajoutez un signalement au centre de contrôle.</p><label htmlFor="incident-title">Description</label><input id="incident-title" value={incidentTitle} onChange={(event) => setIncidentTitle(event.target.value)} placeholder="Ex. Imprimante hors ligne" required autoFocus /><div className="ops-form-row"><div><label htmlFor="incident-kiosk">Kiosque</label><select id="incident-kiosk" value={incidentKiosk} onChange={(event) => setIncidentKiosk(event.target.value)}>{kiosks.map((kiosk) => <option key={kiosk.id}>{kiosk.id}</option>)}</select></div><div><label htmlFor="incident-severity">Priorité</label><select id="incident-severity" value={incidentSeverity} onChange={(event) => setIncidentSeverity(event.target.value as Incident["severity"])}><option value="P1">P1 · Critique</option><option value="P2">P2 · Élevée</option><option value="P3">P3 · Moyenne</option><option value="P4">P4 · Faible</option></select></div><div><label htmlFor="incident-type">Type</label><select id="incident-type" value={incidentType} onChange={(event) => setIncidentType(event.target.value)}><option value="OTHER">Autre</option><option value="HARDWARE">Matériel</option><option value="CONSUMABLE">Consommables</option><option value="NETWORK">Réseau</option><option value="SOFTWARE">Logiciel</option></select></div></div><div className="ops-modal-actions"><button type="button" className="ops-button secondary" onClick={() => setShowIncidentForm(false)}>Annuler</button><button type="submit" className="ops-button primary">Enregistrer l’incident</button></div></form></div>}
    </main>
  );
}

function MetricCard({ label, value, trend, icon, tone }: { label: string; value: string; trend: string; icon: string; tone: string }) {
  return <article className="ops-metric-card"><div className="ops-metric-top"><span>{label}</span><span className={`ops-metric-icon ${tone}`}>{icon}</span></div><strong>{value}</strong><small className={tone === "orange" ? "metric-warning" : "metric-trend"}><span>{tone === "orange" ? "•" : "↗"}</span> {trend}</small></article>;
}

function KioskRow({ kiosk }: { kiosk: Kiosk }) {
  const statusLabel = kiosk.status === "ONLINE" ? "En ligne" : kiosk.status === "DEGRADED" ? "Dégradé" : "Hors ligne";
  return <div className="ops-kiosk-row"><div className="ops-kiosk-ident"><span className={`ops-kiosk-icon ${kiosk.status.toLowerCase()}`}>⌖</span><span><strong>{kiosk.id}</strong><small>{kiosk.location}</small></span></div><span className={`ops-status ${kiosk.status.toLowerCase()}`}><i />{statusLabel}</span><span className="ops-kiosk-stat"><strong>{kiosk.transactions}</strong><small>transactions</small></span><span className="ops-kiosk-stat revenue"><strong>{money.format(kiosk.revenue)}</strong><small>FCFA</small></span><div className="ops-supplies"><span><small>Papier</small><i><b className={kiosk.paper < 20 ? "low" : ""} style={{ width: `${kiosk.paper}%` }} /></i></span><span><small>Toner</small><i><b className={kiosk.toner < 20 ? "low" : ""} style={{ width: `${kiosk.toner}%` }} /></i></span></div><button className="ops-row-more" aria-label={`Options ${kiosk.id}`}>···</button></div>;
}
