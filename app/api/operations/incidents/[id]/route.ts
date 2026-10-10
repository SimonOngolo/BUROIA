import { NextResponse } from "next/server";
import mongoose from "mongoose";
import AuditEvent from "@/lib/models/AuditEvent";
import OperationsIncident from "@/lib/models/OperationsIncident";
import { getAuthenticatedUser } from "@/lib/session";
import { hasPermission } from "@/lib/roles";

const validTransitions: Record<string, string[]> = {
  LOGGED: ["CLASSIFIED", "ASSIGNED", "CLOSED"],
  CLASSIFIED: ["ASSIGNED", "CLOSED"],
  ASSIGNED: ["INVESTIGATING", "CLOSED"],
  INVESTIGATING: ["CONTAINED", "RESOLVED"],
  CONTAINED: ["INVESTIGATING", "RESOLVED"],
  RESOLVED: ["VERIFIED", "INVESTIGATING"],
  VERIFIED: ["CLOSED", "INVESTIGATING"],
  CLOSED: [],
};

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const actor = await getAuthenticatedUser(request);
    if (!actor) return NextResponse.json({ message: "Authentification requise." }, { status: 401 });
    if (!hasPermission(actor.role, "INCIDENT_MANAGE")) return NextResponse.json({ message: "Accès refusé." }, { status: 403 });

    const { id } = await context.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ message: "Identifiant d’incident invalide." }, { status: 400 });
    const body = await request.json();
    const status = typeof body.status === "string" ? body.status : "";
    const incident = await OperationsIncident.findOne({ _id: id, tenantId: actor.tenantId });
    if (!incident) return NextResponse.json({ message: "Incident introuvable." }, { status: 404 });
    if (!validTransitions[incident.status]?.includes(status)) {
      return NextResponse.json({ message: "Cette transition d’incident n’est pas autorisée." }, { status: 409 });
    }

    const previousStatus = incident.status;
    incident.status = status;
    if (status === "ASSIGNED") incident.set("owner", actor.id);
    if (status === "CONTAINED" && typeof body.containment === "string") incident.containment = body.containment.slice(0, 3000);
    if (status === "RESOLVED" && typeof body.resolution === "string") incident.resolution = body.resolution.slice(0, 3000);
    if (status === "CLOSED") incident.closedAt = new Date();
    await incident.save();

    await AuditEvent.create({
      tenantId: actor.tenantId,
      actorId: actor.id,
      action: "OPERATIONS_INCIDENT_STATUS_CHANGED",
      entityType: "OperationsIncident",
      entityId: String(incident._id),
      metadata: { from: previousStatus, to: status },
    });

    return NextResponse.json({ incident });
  } catch (error) {
    console.error("Incident update error:", error);
    return NextResponse.json({ message: "Impossible de mettre à jour l’incident." }, { status: 500 });
  }
}
