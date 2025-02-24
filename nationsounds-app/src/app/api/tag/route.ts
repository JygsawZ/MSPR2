import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// 🔹 Retrieve all tags (GET)

export async function GET() {
  try {
    const tag = await prisma.tag.findMany();
    return NextResponse.json(tag);
  } catch {
    return NextResponse.json({ error: "Error when retrieving tags" });
  }
}

// 🔹 Add a tag (POST)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const tag = await prisma.tag.create({
      data: {
        name: body.name,
      },
    });
    return NextResponse.json(tag, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 🔹 Update a tag (PUT)

export async function PUT(req: NextRequest) {
  const { id, name } = await req.json();

  try {
    const updateTag = await prisma.tag.update({
      where: { id },
      data: { name },
    });
    return NextResponse.json(updateTag);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 🔹 Delete a tag (DELETE)

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  try {
    await prisma.tag.delete({ where: { id } });
    return NextResponse.json({ message: "Tag deleted successfully" });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
