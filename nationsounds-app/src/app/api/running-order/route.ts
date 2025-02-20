import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// 🔹 Retrieve running orders (GET)

export async function GET() {
  try {
    const runningOrders = await prisma.runningOrder.findMany();
    return NextResponse.json(runningOrders);
  } catch {
    return NextResponse.json({ error: "Error when retrieving running orders" });
  }
}

// 🔹 Add a running orders (POST)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const runningOrder = await prisma.runningOrder.create({
      data: {
        artistId: body.artistId,
        startTime: body.startTime,
        endTime: body.endTime,
      },
    });
    return NextResponse.json(runningOrder, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
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
