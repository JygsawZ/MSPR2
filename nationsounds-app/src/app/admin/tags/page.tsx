"use client";

import { useState, useEffect } from "react";

interface Tag {
  id: number;
  name: string;
  _count?: {
    artists: number;
  };
}

export default function TagsManagement() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Charger les tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/tags/admin");
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des tags");
        }
        const data = await response.json();
        setTags(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  // Supprimer un tag
  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce tag ?")) return;

    try {
      const response = await fetch(`/api/tags/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      setTags(tags.filter(tag => tag.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de suppression");
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">Erreur: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Gestion des Tags</h1>
        <button
          onClick={() => window.location.href = "/admin/tags/new"}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Ajouter un tag
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b text-left text-black">Nom</th>
              <th className="px-6 py-3 border-b text-left text-black">Nombre d'artistes</th>
              <th className="px-6 py-3 border-b text-center text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr key={tag.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b text-black">{tag.name}</td>
                <td className="px-6 py-4 border-b text-black">
                  {(tag as any)._count?.artists || 0}
                </td>
                <td className="px-6 py-4 border-b text-center">
                  <button
                    onClick={() => window.location.href = `/admin/tags/${tag.id}/edit`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(tag.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 