import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// 🔹 Retrieve all scenes (GET)

export async function GET() {
  try {
    const scene = await prisma.scene.findMany();
    return NextResponse.json(scene);
  } catch {
    return NextResponse.json({ error: "Error when retrieving scenes" });
  }
}

// 🔹 Add a scene (POST)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const scene = await prisma.scene.create({
      data: {
        name: body.name,
        description: body.description,
        latitude: body.latitude,
        longitude: body.longitude,
      },
    });
    return NextResponse.json(scene, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 🔹 Update a scene (PUT)

export async function PUT(req: NextRequest) {
  const { id, name, description, latitude, longitude } = await req.json();

  try {
    const updateScene = await prisma.scene.update({
      where: { id },
      data: { name, description, latitude, longitude },
    });
    return NextResponse.json(updateScene);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 🔹 Delete a scene (DELETE)

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  try {
    await prisma.scene.delete({ where: { id } });
    return NextResponse.json({ message: "Scene deleted successfully" });
  } catch (error) {
    console.error("Error deleting scene:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
