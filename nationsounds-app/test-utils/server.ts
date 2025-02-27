// test-utils/server.ts
import { NextRequest, NextResponse } from "next/server";
import { GET, POST, PUT, DELETE } from "../src/app/api/artists/route";

// 🚀 Simule un appel API pour les tests
export async function testApi<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: T
) {
  const request = new NextRequest("http://localhost/api/artists", {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: { "Content-Type": "application/json" },
  });

  let response: NextResponse;
  switch (method) {
    case "GET":
      response = await GET();
      break;
    case "POST":
      response = await POST(request);
      break;
    case "PUT":
      response = await PUT(request);
      break;
    case "DELETE":
      response = await DELETE(request);
      break;
    default:
      throw new Error(`Method ${method} not supported`);
  }

  return response.json();
}

// Définir un type pour les gestionnaires de routes
type ApiHandler = (req: NextRequest) => Promise<NextResponse>;

// Fonction pour simuler le serveur avec les routes API
export function createServer() {
  return {
    get: (route: string, handler: ApiHandler) => {
      return { route, handler };
    },
    post: (route: string, handler: ApiHandler) => {
      return { route, handler };
    },
    put: (route: string, handler: ApiHandler) => {
      return { route, handler };
    },
    delete: (route: string, handler: ApiHandler) => {
      return { route, handler };
    },
  };
}
