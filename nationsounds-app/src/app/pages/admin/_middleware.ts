// pages/admin/_middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // Vérification du token JWT pour voir si l'utilisateur est connecté
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Si l'utilisateur n'est pas connecté, redirection vers la page de connexion
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Si l'utilisateur est connecté, permettre l'accès à la page admin
  return NextResponse.next();
}

export const config = {
  matcher: "/admin/*", // Applique ce middleware uniquement aux routes /admin
};
