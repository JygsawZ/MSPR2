"use client";

import React, { useEffect, useState } from "react";
import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { Button } from "@/components/ui/Button/Button";
import { Table } from "@/components/ui/Table/Table";

// Types
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const mockUsers: User[] = [
  { id: 1, name: "Jean Dupont", email: "jean@example.com", role: "ADMIN" },
  { id: 2, name: "Marie Martin", email: "marie@example.com", role: "USER" },
  { id: 3, name: "Paul Durand", email: "paul@example.com", role: "USER" },
];

const columns = [
  { header: "Nom", accessor: "name" as const },
  { header: "Email", accessor: "email" as const },
  { header: "Rôle", accessor: "role" as const },
  {
    header: "Actions",
    accessor: "id" as const,
    render: (_: any, user: User) => (
      <div className="flex space-x-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => alert(`Modifier ${user.name}`)}
        >
          Modifier
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => alert(`Supprimer ${user.name}`)}
        >
          Supprimer
        </Button>
      </div>
    ),
  },
];

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const userSession = await getSession();
      if (!userSession) {
        router.push("/auth/login");
      } else {
        setSession(userSession);
      }
      setIsLoading(false);
    };

    fetchSession();
  }, [router]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/auth/login");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center text-white">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-white font-semibold">Interface Admin</h1>
        <div className="text-white flex items-center space-x-4">
          <span>Bienvenue, {session.user?.name}</span>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Se déconnecter
          </Button>
        </div>
      </div>

      <div className="mb-6 flex justify-end">
        <Button onClick={() => alert("Ajout d'un utilisateur")}>
          Ajouter un utilisateur
        </Button>
      </div>

      <Table data={mockUsers} columns={columns} />
    </div>
  );
} 