import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/running-orders - Liste publique des running orders
export async function GET() {
  try {
    const runningOrders = await prisma.runningOrder.findMany({
      include: {
        artist: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        scene: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc'
      }
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