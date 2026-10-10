import { NextResponse } from "next/server";
import AuditEvent from "@/lib/models/AuditEvent";
import Kiosk from "@/lib/models/Kiosk";
import { getAuthenticatedUser } from "@/lib/session";
import { hasPermission } from "@/lib/roles";

export async function GET(request: Request) {
  try {
    const actor = await getAuthenticatedUser(request);
    if (!actor) return NextResponse.json({ message: "Authentification requise." }, { status: 401 });
    if (!hasPermission(actor.role, "OPERATIONS_VIEW")) return NextResponse.json({ message: "Accès refusé." }, { status: 403 });

    const kiosks = await Kiosk.find({ tenantId: actor.tenantId }).sort({ code: 1 }).lean();
    return NextResponse.json({ kiosks });
  } catch (error) {
    console.error("Kiosk list error:", error);
    return NextResponse.json({ message: "Impossible de charger les kiosques." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const actor = await getAuthenticatedUser(request);
    if (!actor) return NextResponse.json({ message: "Authentification requise." }, { status: 401 });
    if (!hasPermission(actor.role, "OPERATIONS_MANAGE")) return NextResponse.json({ message: "Accès refusé." }, { status: 403 });

    const body = await request.json();
    const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
    const location = typeof body.location === "string" ? body.location.trim() : "";
    if (!/^[A-Z0-9-]{3,80}$/.test(code) || !location || location.length > 200) {
      return NextResponse.json({ message: "Code kiosque ou emplacement invalide." }, { status: 400 });
    }

    const kiosk = await Kiosk.create({ tenantId: actor.tenantId, code, location, createdBy: actor.id });
    await AuditEvent.create({
      tenantId: actor.tenantId,
      actorId: actor.id,
      action: "OPERATIONS_KIOSK_CREATED",
      entityType: "Kiosk",
      entityId: String(kiosk._id),
      metadata: { code },
    });
    return NextResponse.json({ kiosk }, { status: 201 });
  } catch (error) {
    console.error("Kiosk creation error:", error);
    return NextResponse.json({ message: "Impossible d’enregistrer le kiosque." }, { status: 500 });
  }
}
