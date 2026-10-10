import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import AuditEvent from "@/lib/models/AuditEvent";
import OperationsIncident from "@/lib/models/OperationsIncident";
import { getAuthenticatedUser } from "@/lib/session";
import { hasPermission } from "@/lib/roles";

const incidentTypes = ["KIOSK_FAILURE", "PRINT_FAILURE", "PAYMENT_FAILURE", "NETWORK_FAILURE", "SECURITY_EVENT", "SUPPORT_SLA", "STOCK_ALERT", "OTHER"];
const severities = ["P1", "P2", "P3", "P4"];

export async function GET(request: Request) {
  try {
    const actor = await getAuthenticatedUser(request);
    if (!actor) return NextResponse.json({ message: "Authentification requise." }, { status: 401 });
    if (!hasPermission(actor.role, "OPERATIONS_VIEW")) return NextResponse.json({ message: "Accès refusé." }, { status: 403 });

    const incidents = await OperationsIncident.find({ tenantId: actor.tenantId })
      .sort({ detectedAt: -1 })
      .limit(100)
      .lean();
    return NextResponse.json({ incidents });
  } catch (error) {
    console.error("Incident list error:", error);
    return NextResponse.json({ message: "Impossible de charger les incidents." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const actor = await getAuthenticatedUser(request);
    if (!actor) return NextResponse.json({ message: "Authentification requise." }, { status: 401 });
    if (!hasPermission(actor.role, "INCIDENT_MANAGE")) return NextResponse.json({ message: "Accès refusé." }, { status: 403 });

    const body = await request.json();
    const type = typeof body.type === "string" ? body.type : "";
    const severity = typeof body.severity === "string" ? body.severity : "";
    const kioskId = typeof body.kioskId === "string" ? body.kioskId.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    if (!incidentTypes.includes(type) || !severities.includes(severity) || !kioskId || !description || description.length > 3000) {
      return NextResponse.json({ message: "Type, priorité, kiosque et description valide sont obligatoires." }, { status: 400 });
    }

    const incidentNumber = `INC-${randomUUID().slice(0, 8).toUpperCase()}`;
    const incident = await OperationsIncident.create({
      tenantId: actor.tenantId,
      incidentNumber,
      type,
      severity,
      status: "LOGGED",
      detectedBy: actor.id,
      affectedSystem: "KIOSK",
      kioskId,
      description,
    });
    await AuditEvent.create({
      tenantId: actor.tenantId,
      actorId: actor.id,
      action: "OPERATIONS_INCIDENT_CREATED",
      entityType: "OperationsIncident",
      entityId: String(incident._id),
      metadata: { incidentNumber, type, severity, kioskId },
    });

    return NextResponse.json({ incident }, { status: 201 });
  } catch (error) {
    console.error("Incident creation error:", error);
    return NextResponse.json({ message: "Impossible d’enregistrer l’incident." }, { status: 500 });
  }
}
