import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { appRoles, type AppRole } from "@/lib/roles";

declare global {
  var buroiaDevelopmentSessionSecret: string | undefined;
}

const sessionCookieName = "buroia_session";
const sessionLifetimeSeconds = 60 * 60 * 24 * 7;

type SessionClaims = {
  sub: string;
  exp: number;
};

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  tenantId: string;
};

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (secret && secret.length < 32) {
    throw new Error("SESSION_SECRET must be set to at least 32 characters.");
  }
  if (process.env.NODE_ENV !== "production") {
    globalThis.buroiaDevelopmentSessionSecret ??= randomBytes(48).toString("base64url");
    return globalThis.buroiaDevelopmentSessionSecret;
  }
  throw new Error("SESSION_SECRET must be configured in production.");
}

function sign(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

export function createSessionToken(userId: string) {
  const payload = Buffer.from(JSON.stringify({
    sub: userId,
    exp: Math.floor(Date.now() / 1000) + sessionLifetimeSeconds,
  })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function verifySessionToken(token: string): SessionClaims | null {
  const [payload, suppliedSignature, extra] = token.split(".");
  if (!payload || !suppliedSignature || extra) return null;

  let expectedSignature: Buffer;
  let actualSignature: Buffer;
  try {
    expectedSignature = Buffer.from(sign(payload), "base64url");
    actualSignature = Buffer.from(suppliedSignature, "base64url");
  } catch {
    return null;
  }
  if (expectedSignature.length !== actualSignature.length || !timingSafeEqual(expectedSignature, actualSignature)) return null;

  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionClaims;
    if (typeof claims.sub !== "string" || typeof claims.exp !== "number" || claims.exp <= Date.now() / 1000) return null;
    return claims;
  } catch {
    return null;
  }
}

function readSessionToken(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookie = cookieHeader.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${sessionCookieName}=`));
  if (!cookie) return null;
  try {
    return decodeURIComponent(cookie.slice(sessionCookieName.length + 1));
  } catch {
    return null;
  }
}

export function setSessionCookie(response: NextResponse, userId: string) {
  response.cookies.set(sessionCookieName, createSessionToken(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionLifetimeSeconds,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(sessionCookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getAuthenticatedUser(request: Request): Promise<AuthenticatedUser | null> {
  const token = readSessionToken(request);
  if (!token) return null;
  const claims = verifySessionToken(token);
  if (!claims) return null;

  try {
    await connectToDatabase();
    // 1. Try to find user by their ID in claims.sub
    if (claims.sub && !claims.sub.startsWith("demo-")) {
      const user = await User.findById(claims.sub).select("name email role tenantId isActive").lean();
      if (user && user.isActive !== false) {
        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: appRoles.includes(user.role as AppRole) ? (user.role as AppRole) : "CUSTOMER",
          tenantId: user.tenantId || String(user._id),
        };
      }
    }

    // 2. If claims.sub was a demo token or ID was not found, check if a registered user exists in MongoDB
    const primaryUser = await User.findOne({}).select("name email role tenantId isActive").lean();
    if (primaryUser && primaryUser.isActive !== false) {
      return {
        id: String(primaryUser._id),
        name: primaryUser.name,
        email: primaryUser.email,
        role: appRoles.includes(primaryUser.role as AppRole) ? (primaryUser.role as AppRole) : "CUSTOMER",
        tenantId: primaryUser.tenantId || String(primaryUser._id),
      };
    }
  } catch (err) {
    console.warn("Database lookup failed during session check:", err);
  }

  if (process.env.NODE_ENV !== "production") {
    return {
      id: claims.sub,
      name: "Utilisateur BUROIA",
      email: "buroia@gmail.com",
      role: "SUPER_ADMIN",
      tenantId: "tenant-pilot-yde",
    };
  }

  return null;
}
