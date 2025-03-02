import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";
import { Prisma, PrismaClient } from "@prisma/client";

type TransactionClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>;

// Helper function to extract filename from URL
const getFilenameFromUrl = (url: string) => {
  const parts = url.split('/');
  return parts[parts.length - 1];
};

// GET /api/artists/[id] - Récupérer un artiste spécifique - Public access
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
      return NextResponse.json(
        { error: "Artiste non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(artist);
  } catch (error) {
    console.error("Error fetching artist:", error);
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
    
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const id = parseInt(params.id);
    const data = await request.json();

    // Vérifier si l'artiste existe
    const existingArtist = await prisma.artist.findUnique({
      where: { id },
      include: {
        tags: true
      }
    });

    if (!existingArtist) {
      return NextResponse.json(
        { error: "Artiste non trouvé" },
        { status: 404 }
      );
    }

    // Mise à jour de l'artiste avec les nouvelles données
    const updatedArtist = await prisma.artist.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
        sceneId: data.sceneId,
        tags: {
          deleteMany: {}, // Supprimer toutes les relations existantes
          create: Array.isArray(data.tagIds) ? data.tagIds.map((tagId: number) => ({
            tagId: tagId
          })) : []
        }
      },
      include: {
        scene: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    return NextResponse.json(updatedArtist);
  } catch (error) {
    console.error("Error updating artist:", error);
    let errorMessage = "Erreur lors de la mise à jour de l'artiste";
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    }
    return NextResponse.json(
      { error: errorMessage },
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
    
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const id = parseInt(params.id);

    // Supprimer l'artiste (les relations seront automatiquement supprimées grâce aux contraintes de clé étrangère)
    await prisma.artist.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting artist:", error);
    let errorMessage = "Erreur lors de la suppression de l'artiste";
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 