import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// GET /api/artists/[id] - Récupérer un artiste spécifique
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
    const artist = await prisma.artist.findUnique({
      where: { id },
      include: {
        scene: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    if (!artist) {
      return NextResponse.json({ error: "Artiste non trouvé" }, { status: 404 });
    }

    return NextResponse.json(artist);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'artiste:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'artiste" },
      { status: 500 }
    );
  }
}

// PUT /api/artists/[id] - Mettre à jour un artiste
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

    const artist = await prisma.artist.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        sceneId: data.sceneId,
      },
    });

    return NextResponse.json(artist);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'artiste:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'artiste" },
      { status: 500 }
    );
  }
}

// DELETE /api/artists/[id] - Supprimer un artiste
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
    await prisma.artist.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Artiste supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'artiste:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'artiste" },
      { status: 500 }
    );
  }
} 