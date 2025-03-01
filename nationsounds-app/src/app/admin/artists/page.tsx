"use client";

import { useState, useEffect } from "react";
import type { Artist } from ".prisma/client";

export default function ArtistsManagement() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Charger les artistes
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch("/api/artists");
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des artistes");
        }
        const data = await response.json();
        setArtists(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  // Supprimer un artiste
  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet artiste ?")) return;

    try {
      const response = await fetch(`/api/artists/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      setArtists(artists.filter(artist => artist.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de suppression");
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">Erreur: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Artistes</h1>
        <button
          onClick={() => window.location.href = "/admin/artists/new"}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Ajouter un artiste
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b text-left text-black">Nom</th>
              <th className="px-6 py-3 border-b text-left text-black">Description</th>
              <th className="px-6 py-3 border-b text-left text-black">Scène</th>
              <th className="px-6 py-3 border-b text-center text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {artists.map((artist) => (
              <tr key={artist.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b text-black">{artist.name}</td>
                <td className="px-6 py-4 border-b text-black">
                  {(artist.description && artist.description.length > 100)
                    ? `${artist.description.substring(0, 100)}...`
                    : artist.description || ""}
                </td>
                <td className="px-6 py-4 border-b text-black">
                  {artist.sceneId ? `Scène ${artist.sceneId}` : "Non assigné"}
                </td>
                <td className="px-6 py-4 border-b text-center">
                  <button
                    onClick={() => window.location.href = `/admin/artists/${artist.id}/edit`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(artist.id)}
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