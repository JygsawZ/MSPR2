import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";

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

// PUT /api/artists/[id] - Mettre à jour un artiste - Admin only
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

    // Get the current artist to check if we need to delete old image
    const currentArtist = await prisma.artist.findUnique({
      where: { id },
      select: { image: true }
    });

    // If there's a new image and an old image exists, delete the old one
    if (data.image && currentArtist?.image && data.image !== currentArtist.image) {
      const oldFilename = getFilenameFromUrl(currentArtist.image);
      await supabase.storage
        .from('artists-images')
        .remove([oldFilename]);
    }

    const updatedArtist = await prisma.artist.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
        sceneId: data.sceneId,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedArtist);
  } catch (error) {
    console.error("Error updating artist:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/artists/[id] - Supprimer un artiste - Admin only
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

    // Get the artist to delete their image
    const artist = await prisma.artist.findUnique({
      where: { id },
      select: { image: true }
    });

    // If artist has an image, delete it from storage
    if (artist?.image) {
      const filename = getFilenameFromUrl(artist.image);
      await supabase.storage
        .from('artists-images')
        .remove([filename]);
    }

    // Delete the artist from the database
    await prisma.artist.delete({ where: { id } });

    return NextResponse.json({ message: "Artist and associated image deleted successfully" });
  } catch (error) {
    console.error("Error deleting artist:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 