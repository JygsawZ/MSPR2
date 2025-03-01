"use client";

import { useState, useEffect } from "react";
import { Scene } from "@prisma/client";

export default function ScenesManagement() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Charger les scènes
  useEffect(() => {
    const fetchScenes = async () => {
      try {
        const response = await fetch("/api/scenes");
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des scènes");
        }
        const data = await response.json();
        setScenes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchScenes();
  }, []);

  // Supprimer une scène
  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette scène ?")) return;

    try {
      const response = await fetch(`/api/scenes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      setScenes(scenes.filter(scene => scene.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de suppression");
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">Erreur: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Scènes</h1>
        <button
          onClick={() => window.location.href = "/admin/scenes/new"}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Ajouter une scène
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b text-left text-black">Nom</th>
              <th className="px-6 py-3 border-b text-left text-black">Description</th>
              <th className="px-6 py-3 border-b text-left text-black">Localisation</th>
              <th className="px-6 py-3 border-b text-center text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {scenes.map((scene) => (
              <tr key={scene.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b text-black">{scene.name}</td>
                <td className="px-6 py-4 border-b text-black">
                  {scene.description ? (
                    scene.description.length > 100
                      ? `${scene.description.substring(0, 100)}...`
                      : scene.description
                  ) : "Aucune description"}
                </td>
                <td className="px-6 py-4 border-b text-black">
                  {`${scene.latitude}, ${scene.longitude}`}
                </td>
                <td className="px-6 py-4 border-b text-center">
                  <button
                    onClick={() => window.location.href = `/admin/scenes/${scene.id}/edit`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(scene.id)}
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