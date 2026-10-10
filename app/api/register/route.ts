import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { createSessionToken, setSessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  try {
    // Get the data sent by the registration form
    const body = await request.json();

    const { name, email, password } = body;

    // Check required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          message: "Tous les champs sont obligatoires.",
        },
        { status: 400 }
      );
    }

    // Check password length
    if (password.length < 6) {
      return NextResponse.json(
        {
          message: "Le mot de passe doit contenir au moins 6 caractères.",
        },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectToDatabase();

    // Check if the email already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "Cette adresse email est déjà utilisée.",
        },
        { status: 409 }
      );
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = new mongoose.Types.ObjectId();
    const tenantId = userId.toString();
    createSessionToken(tenantId);

    // Create the new user
    const user = await User.create({
      _id: userId,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      tenantId,
    });

    // Send a successful response
    const response = NextResponse.json(
      {
        message: "Compte créé avec succès.",
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
    setSessionCookie(response, String(user._id));
    return response;
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      {
        message: "Une erreur est survenue lors de la création du compte.",
      },
      { status: 500 }
    );
  }
}
