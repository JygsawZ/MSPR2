import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// 🔹 Retrieve all users (GET)

export async function GET() {
  try {
    const user = await prisma.user.findMany();
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Error when retrieving scenes" });
  }
}

// 🔹 Add user (POST)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        firstName: body.firstName,
        lastName: body.lastName,
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 🔹 Update user (PUT)

export async function PUT(req: NextRequest) {
  const { id, email, password, firstName, lastName } = await req.json();

  try {
    const updateUser = await prisma.user.update({
      where: { id },
      data: { email, password, firstName, lastName },
    });
    return NextResponse.json(updateUser);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 🔹 Delete user (DELETE)

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
