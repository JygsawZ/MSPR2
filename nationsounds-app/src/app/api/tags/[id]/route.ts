import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// GET /api/tags/[id] - Récupérer un tag spécifique
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
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        artists: {
          include: {
            artist: true,
          }
        },
      }
    });

    if (!tag) {
      return NextResponse.json({ error: "Tag non trouvé" }, { status: 404 });
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error("Erreur lors de la récupération du tag:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du tag" },
      { status: 500 }
    );
  }
}

// PUT /api/tags/[id] - Mettre à jour un tag
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

    // Vérifier si le nouveau nom existe déjà pour un autre tag
    const existingTag = await prisma.tag.findFirst({
      where: {
        name: data.name,
        NOT: {
          id: id,
        },
      },
    });

    if (existingTag) {
      return NextResponse.json(
        { error: "Un tag avec ce nom existe déjà" },
        { status: 400 }
      );
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: {
        name: data.name,
      },
      include: {
        artists: {
          include: {
            artist: true,
          }
        },
      }
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du tag:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du tag" },
      { status: 500 }
    );
  }
}

// DELETE /api/tags/[id] - Supprimer un tag
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

    // Supprimer d'abord toutes les relations avec les artistes
    await prisma.artistTag.deleteMany({
      where: {
        tagId: id,
      },
    });

    // Puis supprimer le tag
    await prisma.tag.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Erreur lors de la suppression du tag:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du tag" },
      { status: 500 }
    );
  }
} 