import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/session";

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) return NextResponse.json({ message: "Authentification requise." }, { status: 401 });
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Session lookup error:", error);
    return NextResponse.json({ message: "Impossible de vérifier la session." }, { status: 500 });
  }
}
