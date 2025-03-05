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
    console.log("Début de la requête d'inscription");
    const body = await req.json();
    console.log("Données reçues:", { ...body, password: '[HIDDEN]' });
    
    // Validation des données
    console.log("Validation des données...");
    const validatedData = registerSchema.parse(body);

    // Vérification si l'email existe déjà
    console.log("Vérification de l'email...");
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      console.log("Email déjà utilisé");
      return NextResponse.json(
        { message: "Cet email est déjà utilisé" },
        { status: 400 }
      );
    }

    // Hashage du mot de passe
    console.log("Hashage du mot de passe...");
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Création de l'utilisateur
    console.log("Création de l'utilisateur...");
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role: "USER", // Rôle par défaut
      },
    });

    console.log("Utilisateur créé avec succès");
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
    console.error("Erreur détaillée:", error);
    
    if (error instanceof z.ZodError) {
      console.log("Erreur de validation Zod:", error.errors);
      return NextResponse.json(
        { message: "Données invalides", errors: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      console.error("Message d'erreur:", error.message);
      console.error("Stack trace:", error.stack);
    }

    return NextResponse.json(
      { message: "Une erreur est survenue lors de l'inscription" },
      { status: 500 }
    );
  }
} 