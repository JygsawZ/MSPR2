import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// 🔹 Récupérer tous les artistes (GET)
export async function GET() {
  try {
    const artists = await prisma.artist.findMany();
    return NextResponse.json(artists);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des artistes" },
      { status: 500 }
    );
  }
}

// 🔹 Ajouter un artiste (POST)

export async function POST(Request: NextRequest) {
  try {
    const body = await Request.json();
    console.log("✅ Données reçues :", body);

    // Recherche de la scène par nom, en utilisant `findFirst`
    // Removed unused variable 'scene'

    const artist = await prisma.artist.create({
      data: {
        name: body.name,
        description: body.description,
        imageUrl: body.imageUrl,
        sceneId: body.sceneId,
      },
    });

    console.log("✅ Artiste créé :", artist);
    return NextResponse.json(artist, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
// 🔹 Mettre à jour un artiste (PUT)

export async function PUT(req: NextRequest) {
  const { id, name, description, tags, imageUrl, scene } = await req.json();

  try {
    const updateArtist = await prisma.artist.update({
      where: { id },
      data: {
        name,
        description,
        tags,
        imageUrl,
        scene,
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(updateArtist);
  } catch (error) {
    console.error("Error updatying artist:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 🔹 Supprimer un artiste (DELETE)

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  try {
    await prisma.artist.delete({ where: { id } });
    return NextResponse.json({ message: "Artist deleted successfully" });
  } catch (error) {
    console.error("Error deleting artist:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
