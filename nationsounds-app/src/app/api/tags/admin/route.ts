import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// GET /api/tags/admin - Liste admin des tags
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const tags = await prisma.tag.findMany({
      include: {
        artists: {
          include: {
            artist: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Erreur lors de la récupération des tags:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des tags" },
      { status: 500 }
    );
  }
}

// POST /api/tags/admin - Créer un nouveau tag
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();

    const tag = await prisma.tag.create({
      data: {
        name: data.name,
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du tag:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du tag" },
      { status: 500 }
    );
  }
} 