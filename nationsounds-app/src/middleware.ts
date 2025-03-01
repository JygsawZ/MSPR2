import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth } from "next-auth/middleware";

// Configuration des routes protégées
const protectedRoutes = ["/dashboard", "/admin"];
const adminRoutes = ["/admin"];
const authRoutes = ["/auth/login", "/auth/register"];

export default async function middleware(request: NextRequestWithAuth) {
  const token = await getToken({ req: request });
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Si l'utilisateur est connecté et essaie d'accéder aux pages d'auth
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (
    !token &&
    protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Vérification des permissions admin
  if (
    token &&
    adminRoutes.some((route) => request.nextUrl.pathname.startsWith(route)) &&
    token.role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configuration des routes à matcher pour le middleware
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/auth/login",
    "/auth/register",
  ],
}; 