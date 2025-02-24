import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// 🔹 Retrieve all meeting (GET)

export async function GET() {
  try {
    const meeting = await prisma.meeting.findMany();
    return NextResponse.json(meeting);
  } catch {
    return NextResponse.json({ error: "Error when retrieving scenes" });
  }
}

// 🔹 Add meeting (POST)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const meeting = await prisma.meeting.create({
      data: {
        artistId: body.artistId,
        date: body.date,
        lieuId: body.lieuId,
      },
    });
    return NextResponse.json(meeting, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 🔹 Update meeting (PUT)

export async function PUT(req: NextRequest) {
  const { id, artistId, date, lieuId } = await req.json();

  try {
    const updateMeeting = await prisma.meeting.update({
      where: { id },
      data: { artistId, date, lieuId },
    });
    return NextResponse.json(updateMeeting);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 🔹 Delete meeting (DELETE)

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  try {
    await prisma.meeting.delete({ where: { id } });
    return NextResponse.json({ message: "Meeting deleted successfully" });
  } catch (error) {
    console.error("Error deleting meeting:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
