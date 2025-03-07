"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Artist {
  id: number;
  name: string;
}

interface Scene {
  id: number;
  name: string;
}

export default function NewRunningOrderPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    artistId: "",
    sceneId: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistsResponse, scenesResponse] = await Promise.all([
          fetch("/api/artists"),
          fetch("/api/scenes"),
        ]);

        if (!artistsResponse.ok || !scenesResponse.ok) {
          throw new Error("Erreur lors du chargement des données");
        }

        const [artistsData, scenesData] = await Promise.all([
          artistsResponse.json(),
          scenesResponse.json(),
        ]);

        setArtists(artistsData);
        setScenes(scenesData);
      } catch (err) {
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/running-orders/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          artistId: parseInt(formData.artistId),
          sceneId: parseInt(formData.sceneId),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la création du créneau");
      }

      router.push("/admin/running-order");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erreur lors de la création du créneau");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Nouveau créneau</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label htmlFor="artistId" className="block text-sm font-medium mb-1 text-white">
            Artiste
          </label>
          <select
            id="artistId"
            name="artistId"
            value={formData.artistId}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-md bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-black"
          >
            <option value="">Sélectionner un artiste</option>
            {artists.map((artist) => (
              <option key={artist.id} value={artist.id}>
                {artist.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sceneId" className="block text-sm font-medium mb-1 text-white">
            Scène
          </label>
          <select
            id="sceneId"
            name="sceneId"
            value={formData.sceneId}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-md bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-black"
          >
            <option value="">Sélectionner une scène</option>
            {scenes.map((scene) => (
              <option key={scene.id} value={scene.id}>
                {scene.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="startTime" className="block text-sm font-medium mb-1 text-white">
            Date et heure de début
          </label>
          <input
            type="datetime-local"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-md bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-black"
          />
        </div>

        <div>
          <label htmlFor="endTime" className="block text-sm font-medium mb-1 text-white">
            Date et heure de fin
          </label>
          <input
            type="datetime-local"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-md bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-black"
          />
        </div>

        {error && (
          <div className="text-red-500 bg-red-900/20 p-3 rounded-md border border-red-500">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {saving ? "Création..." : "Créer"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/running-order")}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
} 