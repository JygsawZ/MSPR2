import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// 🔹 Retrieve running orders (GET)

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const runningOrder = await prisma.runningOrder.findMany({
      include: {
        artist: {
          select: {
            name: true,
          },
        },
        scene: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return NextResponse.json(runningOrder);
  } catch (error) {
    console.error("Erreur lors de la récupération du running order:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du running order" },
      { status: 500 }
    );
  }
}

// 🔹 Add a running orders (POST)

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();

    // Vérifier les chevauchements de créneaux pour l'artiste
    const artistConflict = await prisma.runningOrder.findFirst({
      where: {
        artistId: data.artistId,
        OR: [
          {
            AND: [
              { startTime: { lte: new Date(data.startTime) } },
              { endTime: { gt: new Date(data.startTime) } },
            ],
          },
          {
            AND: [
              { startTime: { lt: new Date(data.endTime) } },
              { endTime: { gte: new Date(data.endTime) } },
            ],
          },
        ],
      },
    });

    if (artistConflict) {
      return NextResponse.json(
        { error: "L'artiste a déjà un créneau sur cette plage horaire" },
        { status: 400 }
      );
    }

    // Vérifier les chevauchements de créneaux pour la scène
    const sceneConflict = await prisma.runningOrder.findFirst({
      where: {
        sceneId: data.sceneId,
        OR: [
          {
            AND: [
              { startTime: { lte: new Date(data.startTime) } },
              { endTime: { gt: new Date(data.startTime) } },
            ],
          },
          {
            AND: [
              { startTime: { lt: new Date(data.endTime) } },
              { endTime: { gte: new Date(data.endTime) } },
            ],
          },
        ],
      },
    });

    if (sceneConflict) {
      return NextResponse.json(
        { error: "La scène est déjà occupée sur cette plage horaire" },
        { status: 400 }
      );
    }

    const runningOrder = await prisma.runningOrder.create({
      data: {
        artistId: data.artistId,
        sceneId: data.sceneId,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
      },
      include: {
        artist: {
          select: {
            name: true,
          },
        },
        scene: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(runningOrder, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du créneau:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du créneau" },
      { status: 500 }
    );
  }
}

// 🔹 Update running order (PUT)

export async function PUT(req: NextRequest) {
  const { id, artistId, startTime, endTime } = await req.json();

  try {
    const updateRunningOrder = await prisma.runningOrder.update({
      where: { id },
      data: {
        artistId,
        startTime,
        endTime,
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(updateRunningOrder);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 🔹 Delete running order (DELETE)

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  try {
    await prisma.runningOrder.delete({ where: { id } });
    return NextResponse.json({ message: "Running order deleted successfully" });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
