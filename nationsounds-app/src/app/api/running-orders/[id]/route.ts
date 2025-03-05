import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// GET /api/running-orders/[id] - Récupérer un running order spécifique
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const runningOrder = await prisma.runningOrder.findUnique({
      where: { id },
      include: {
        artist: true,
        scene: true,
      },
    });

    if (!runningOrder) {
      return NextResponse.json(
        { error: "Running order non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(runningOrder);
  } catch (error) {
    console.error("Erreur lors de la récupération du running order:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du running order" },
      { status: 500 }
    );
  }
}

// PUT /api/running-orders/[id] - Mettre à jour un running order
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

    // Vérifier si le running order existe
    const existingRunningOrder = await prisma.runningOrder.findUnique({
      where: { id },
    });

    if (!existingRunningOrder) {
      return NextResponse.json(
        { error: "Running order non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier les chevauchements (sauf pour le créneau actuel)
    const conflicts = await prisma.runningOrder.findFirst({
      where: {
        id: { not: id },
        OR: [
          {
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
          {
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
        ],
      },
    });

    if (conflicts) {
      return NextResponse.json(
        { error: "Conflit de créneaux détecté" },
        { status: 400 }
      );
    }

    const updatedRunningOrder = await prisma.runningOrder.update({
      where: { id },
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

    return NextResponse.json(updatedRunningOrder);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du running order:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du running order" },
      { status: 500 }
    );
  }
}

// DELETE /api/running-orders/[id] - Supprimer un running order
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

    // Vérifier si le running order existe
    const existingRunningOrder = await prisma.runningOrder.findUnique({
      where: { id },
    });

    if (!existingRunningOrder) {
      return NextResponse.json(
        { error: "Running order non trouvé" },
        { status: 404 }
      );
    }

    await prisma.runningOrder.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Erreur lors de la suppression du running order:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du running order" },
      { status: 500 }
    );
  }
} 