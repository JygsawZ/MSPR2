"client server";

import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

interface Artist {
  id: number;
  name: string;
  description?: string | null;
  image?: string | null;
  sceneId?: number | null;
  scene?: { name: string } | null;
  tags: { tag: { name: string } }[];
  runningOrders: { startTime: Date; endTime: Date }[];
}

// 🔹 Retrieve all artists (GET) - Public access
export async function GET() {
  try {
    const artists = await prisma.artist.findMany({
      include: {
        scene: true,
        tags: {
          include: {
            tag: true
          }
        },
        runningOrders: {
          select: {
            startTime: true,
            endTime: true
          }
        }
      }
    });

    // Format the response to include jour and heure
    const formattedArtists = artists.map((artist: Artist) => {
      const runningOrder = artist.runningOrders[0]; // Get the first running order
      const startTime = runningOrder ? new Date(runningOrder.startTime) : null;

      return {
        ...artist,
        jour: startTime ? startTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : undefined,
        heure: startTime ? startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : undefined,
      };
    });

    return NextResponse.json(formattedArtists);
  } catch (error) {
    console.error("Erreur lors de la récupération des artistes:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des artistes" },
      { status: 500 }
    );
  }
}

// 🔹 Add an artist (POST) - Admin only
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
        image: data.image,
        sceneId: data.sceneId,
        tags: {
          create: data.tagIds.map((tagId: number) => ({
            tagId: tagId
          }))
        }
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
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

// 🔹 Update an artist (PUT) - Admin only
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id, name, description, tags, imageUrl, scene } = await req.json();

    const updateArtist = await prisma.artist.update({
      where: { id },
      data: {
        name,
        description,
        image: imageUrl,
        sceneId: scene?.id,
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

// 🔹 Delete an artist (DELETE) - Admin only
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await req.json();
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
