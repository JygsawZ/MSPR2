import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const runningOrders = await prisma.runningOrder.findMany({
      include: {
        artist: true,
        scene: true
      },
      where: {
        AND: [
          {
            startTime: {
              gte: new Date('2000-01-01')
            }
          },
          {
            endTime: {
              gte: new Date('2000-01-01')
            }
          }
        ]
      },
      orderBy: {
        startTime: 'asc'
      }
    });

    if (!runningOrders || runningOrders.length === 0) {
      return NextResponse.json([]);
    }

    return NextResponse.json(runningOrders);
  } catch (error) {
    console.error("Erreur détaillée lors de la récupération des running orders:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Erreur lors de la récupération des running orders: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Erreur inconnue lors de la récupération des running orders" },
      { status: 500 }
    );
  }
} 