import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// GET /api/scenes/[id] - Récupérer une scène spécifique
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const id = parseInt(params.id);
    const scene = await prisma.scene.findUnique({
      where: { id },
      include: {
        artists: true,
      }
    });

    if (!scene) {
      return NextResponse.json({ error: "Scène non trouvée" }, { status: 404 });
    }

    return NextResponse.json(scene);
  } catch (error) {
    console.error("Erreur lors de la récupération de la scène:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la scène" },
      { status: 500 }
    );
  }
}

// PUT /api/scenes/[id] - Mettre à jour une scène
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const id = parseInt(params.id);
    const data = await request.json();

    const scene = await prisma.scene.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    });

    return NextResponse.json(scene);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la scène:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la scène" },
      { status: 500 }
    );
  }
}

// DELETE /api/scenes/[id] - Supprimer une scène
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const id = parseInt(params.id);
    await prisma.scene.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Scène supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la scène:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la scène" },
      { status: 500 }
    );
  }
} 