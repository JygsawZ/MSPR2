"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Tag } from ".prisma/client";
import { use } from "react";

export default function EditTag({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [tag, setTag] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    const fetchTag = async () => {
      try {
        const response = await fetch(`/api/tags/${id}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération du tag");
        }
        const data = await response.json();
        setTag(data);
        setFormData({
          name: data.name,
        });
      } catch (error) {
        setError("Erreur lors de la récupération du tag");
      } finally {
        setLoading(false);
      }
    };

    fetchTag();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/tags/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du tag");
      }

      router.push("/admin/tags");
    } catch (error) {
      setError("Erreur lors de la mise à jour du tag");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500 bg-red-900/20 p-3 rounded-md border border-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">Modifier le tag</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-white">
            Nom
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full text-black p-2 border rounded"
            required
          />
        </div>

        {error && (
          <div className="text-red-500 bg-red-900/20 p-3 rounded-md border border-red-500">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push("/admin/tags")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
} 