"client server";

import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// 🔹 Retrieve all artists (GET)

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const artists = await prisma.artist.findMany({
      include: {
        scene: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    return NextResponse.json(artists);
  } catch (error) {
    console.error("Erreur lors de la récupération des artistes:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des artistes" },
      { status: 500 }
    );
  }
}

// 🔹 Add an artist (POST)

// TODO : Add image directcly to the storage supabase

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();

    const artist = await prisma.artist.create({
      data: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        sceneId: data.sceneId,
      },
    });

    return NextResponse.json(artist, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de l'artiste:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'artiste" },
      { status: 500 }
    );
  }
}

// 🔹 Update an artist (PUT)

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
    console.error("Error updating artist:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 🔹 Delete an artist (DELETE)

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
