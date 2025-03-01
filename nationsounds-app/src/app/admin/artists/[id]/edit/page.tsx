"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Artist {
  id: number;
  name: string;
  description: string;
  imageUrl?: string | null;
  sceneId?: number | null;
}

interface Scene {
  id: number;
  name: string;
}

export default function EditArtist({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger l'artiste
        const artistResponse = await fetch(`/api/artists/${params.id}`);
        if (!artistResponse.ok) {
          throw new Error("Erreur lors du chargement de l'artiste");
        }
        const artistData = await artistResponse.json();
        setArtist(artistData);

        // Charger les scènes
        const scenesResponse = await fetch("/api/scenes");
        if (!scenesResponse.ok) {
          throw new Error("Erreur lors du chargement des scènes");
        }
        const scenesData = await scenesResponse.json();
        setScenes(scenesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!artist) return;

    try {
      const response = await fetch(`/api/artists/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(artist),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour");
      }

      router.push("/admin/artists");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de mise à jour");
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">Erreur: {error}</div>;
  if (!artist) return <div>Artiste non trouvé</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Modifier l'artiste</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input
            type="text"
            value={artist.name}
            onChange={(e) => setArtist({ ...artist, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={artist.description}
            onChange={(e) => setArtist({ ...artist, description: e.target.value })}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL de l'image</label>
          <input
            type="url"
            value={artist.imageUrl || ""}
            onChange={(e) => setArtist({ ...artist, imageUrl: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Scène</label>
          <select
            value={artist.sceneId || ""}
            onChange={(e) => setArtist({ ...artist, sceneId: e.target.value ? parseInt(e.target.value) : null })}
            className="w-full p-2 border rounded"
          >
            <option value="">Sélectionner une scène</option>
            {scenes.map((scene) => (
              <option key={scene.id} value={scene.id}>
                {scene.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Enregistrer
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/artists")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
} 