"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewScenePage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    latitude: "",
    longitude: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/scenes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la scène");
      }

      router.push("/admin/scenes");
    } catch (error) {
      setError("Erreur lors de la création de la scène");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Nouvelle scène</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1 text-white">
            Nom
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full text-black p-2 rounded-md bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1 text-white">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full text-black p-2 rounded-md bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium mb-1 text-white">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
              className="w-full text-black p-2 rounded-md bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="longitude" className="block text-sm font-medium mb-1 text-white">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
              className="w-full text-black p-2 rounded-md bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
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
            onClick={() => router.push("/admin/scenes")}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
} 