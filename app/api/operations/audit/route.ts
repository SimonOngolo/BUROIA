import { NextResponse } from "next/server";
import AuditEvent from "@/lib/models/AuditEvent";
import { getAuthenticatedUser } from "@/lib/session";
import { hasPermission } from "@/lib/roles";

export async function GET(request: Request) {
  try {
    const actor = await getAuthenticatedUser(request);
    if (!actor) return NextResponse.json({ message: "Authentification requise." }, { status: 401 });
    if (!hasPermission(actor.role, "AUDIT_VIEW")) return NextResponse.json({ message: "Accès refusé." }, { status: 403 });

    const events = await AuditEvent.find({ tenantId: actor.tenantId })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    return NextResponse.json({ events });
  } catch (error) {
    console.error("Audit list error:", error);
    return NextResponse.json({ message: "Impossible de charger le journal d’audit." }, { status: 500 });
  }
}
