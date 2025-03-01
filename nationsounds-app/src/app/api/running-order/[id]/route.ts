import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// GET /api/running-order/[id] - Récupérer un créneau spécifique
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const id = parseInt(params.id);
    const runningOrder = await prisma.runningOrder.findUnique({
      where: { id },
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

    if (!runningOrder) {
      return NextResponse.json({ error: "Créneau non trouvé" }, { status: 404 });
    }

    return NextResponse.json(runningOrder);
  } catch (error) {
    console.error("Erreur lors de la récupération du créneau:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du créneau" },
      { status: 500 }
    );
  }
}

// PUT /api/running-order/[id] - Mettre à jour un créneau
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

    // Vérifier les chevauchements de créneaux pour l'artiste
    const artistConflict = await prisma.runningOrder.findFirst({
      where: {
        id: { not: id },
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
        id: { not: id },
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

    const runningOrder = await prisma.runningOrder.update({
      where: { id },
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

    return NextResponse.json(runningOrder);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du créneau:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du créneau" },
      { status: 500 }
    );
  }
}

// DELETE /api/running-order/[id] - Supprimer un créneau
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
    await prisma.runningOrder.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Créneau supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du créneau:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du créneau" },
      { status: 500 }
    );
  }
} 