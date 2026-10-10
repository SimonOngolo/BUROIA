import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { setSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email et mot de passe sont obligatoires." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    try {
      await connectToDatabase();
      const user = await User.findOne({ email: normalizedEmail });

      if (user) {
        const passwordIsCorrect = await bcrypt.compare(password, user.password);
        if (passwordIsCorrect) {
          const response = NextResponse.json(
            {
              message: "Connexion réussie.",
              user: {
                id: String(user._id),
                name: user.name,
                email: user.email,
                role: user.role,
              },
            },
            { status: 200 }
          );
          setSessionCookie(response, String(user._id));
          return response;
        } else {
          return NextResponse.json(
            { message: "Mot de passe incorrect." },
            { status: 401 }
          );
        }
      }
    } catch (dbError) {
      console.warn("MongoDB lookup failed during login:", dbError);
    }

    // In local development if database is unseeded, allow demo access
    if (process.env.NODE_ENV !== "production") {
      const response = NextResponse.json(
        {
          message: "Connexion réussie.",
          user: {
            id: "demo-user",
            name: "Utilisateur BUROIA",
            email: normalizedEmail,
            role: "SUPER_ADMIN",
          },
        },
        { status: 200 }
      );
      setSessionCookie(response, "demo-user");
      return response;
    }

    return NextResponse.json(
      { message: "Email ou mot de passe incorrect." },
      { status: 401 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Connexion impossible pour le moment." },
      { status: 500 }
    );
  }
}
