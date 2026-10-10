import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  const accept = request.headers.get("accept") || "";
  const isApi = accept.includes("application/json") && !accept.includes("text/html");

  const response = isApi
    ? NextResponse.json({ message: "Déconnexion réussie." })
    : NextResponse.redirect(new URL("/login", request.url), 303);

  clearSessionCookie(response);
  return response;
}

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url), 303);
  clearSessionCookie(response);
  return response;
}
