import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// GET /api/running-orders/admin - Liste admin des running orders
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const runningOrders = await prisma.runningOrder.findMany({
      include: {
        artist: true,
        scene: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return NextResponse.json(runningOrders);
  } catch (error) {
    console.error("Erreur lors de la récupération des running orders:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des running orders" },
      { status: 500 }
    );
  }
}

// POST /api/running-orders/admin - Créer un nouveau running order
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
        artist: true,
        scene: true,
      },
    });

    return NextResponse.json(runningOrder, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du running order:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du running order" },
      { status: 500 }
    );
  }
} 