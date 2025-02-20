import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// 🔹 Retrieve all artists (GET)

export async function GET() {
  try {
    const artists = await prisma.artist.findMany();
    return NextResponse.json(artists);
  } catch {
    return NextResponse.json(
      { error: "Error when retrieving artists" },
      { status: 500 }
    );
  }
}

// 🔹 Add an artist (POST)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const artist = await prisma.artist.create({
      data: {
        name: body.name,
        description: body.description,
        imageUrl: body.imageUrl,
        sceneId: body.sceneId,
      },
    });
    return NextResponse.json(artist, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
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
