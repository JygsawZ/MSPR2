"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Scene {
  id: number;
  name: string;
}

export default function NewArtist() {
  const router = useRouter();
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    sceneId: "",
  });

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/artists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          sceneId: formData.sceneId ? parseInt(formData.sceneId) : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création");
      }

      router.push("/admin/artists");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de création");
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">Erreur: {error}</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Ajouter un artiste</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL de l'image</label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Scène</label>
          <select
            value={formData.sceneId}
            onChange={(e) => setFormData({ ...formData, sceneId: e.target.value })}
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
            Créer
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