import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// GET /api/scenes - Récupérer toutes les scènes
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const scenes = await prisma.scene.findMany({
      include: {
        artists: true,
      }
    });

    return NextResponse.json(scenes);
  } catch (error) {
    console.error("Erreur lors de la récupération des scènes:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des scènes" },
      { status: 500 }
    );
  }
}

// POST /api/scenes - Créer une nouvelle scène
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();

    const scene = await prisma.scene.create({
      data: {
        name: data.name,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    });

    return NextResponse.json(scene, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la scène:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la scène" },
      { status: 500 }
    );
  }
} 