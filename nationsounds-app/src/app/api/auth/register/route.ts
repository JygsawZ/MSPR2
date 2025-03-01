import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";

// Schéma de validation
const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validation des données
    const validatedData = registerSchema.parse(body);

    // Vérification si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Cet email est déjà utilisé" },
        { status: 400 }
      );
    }

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Création de l'utilisateur
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role: "USER", // Rôle par défaut
      },
    });

    // On ne renvoie pas le mot de passe
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "Utilisateur créé avec succès",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Données invalides", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de l'inscription" },
      { status: 500 }
    );
  }
} 