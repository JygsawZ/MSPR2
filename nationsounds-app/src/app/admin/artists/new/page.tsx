"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/lib/supabase";
import Image from "next/image";

interface Scene {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

export default function NewArtist() {
  const router = useRouter();
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sceneId: "",
    tagIds: [] as number[],
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scenesResponse, tagsResponse] = await Promise.all([
          fetch("/api/scenes"),
          fetch("/api/tags")
        ]);

        if (!scenesResponse.ok) {
          throw new Error("Erreur lors du chargement des scènes");
        }
        if (!tagsResponse.ok) {
          throw new Error("Erreur lors du chargement des tags");
        }

        const [scenesData, tagsData] = await Promise.all([
          scenesResponse.json(),
          tagsResponse.json()
        ]);

        setScenes(scenesData);
        setTags(tagsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTagChange = (tagId: number) => {
    setFormData(prev => {
      const currentTags = prev.tagIds;
      const newTags = currentTags.includes(tagId)
        ? currentTags.filter(id => id !== tagId)
        : [...currentTags, tagId];
      return { ...prev, tagIds: newTags };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("L'image ne doit pas dépasser 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Le fichier doit être une image");
        return;
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      
      if (!fileExt || !validExtensions.includes(fileExt)) {
        setError("Format d'image non supporté. Utilisez JPG, PNG, GIF ou WEBP");
        return;
      }

      setSelectedFile(file);
      setError("");
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      let imageUrl = null;

      if (selectedFile) {
        try {
          imageUrl = await uploadImage(selectedFile);
        } catch (uploadErr: any) {
          console.error("Upload error:", uploadErr);
          throw new Error(`Erreur lors de l'upload: ${uploadErr?.message || 'Erreur inconnue'}`);
        }
      }

      const response = await fetch("/api/artists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
          sceneId: formData.sceneId ? parseInt(formData.sceneId) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la création");
      }

      router.push("/admin/artists");
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !imagePreview) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">Erreur: {error}</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">Ajouter un artiste</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-white">Nom</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded text-black"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-white">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded text-black"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-white">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
          {imagePreview && (
            <div className="mt-2 relative w-full h-48">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="rounded object-cover"
              />
            </div>
          )}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-white">Scène</label>
          <select
            value={formData.sceneId}
            onChange={(e) => setFormData({ ...formData, sceneId: e.target.value })}
            className="w-full p-2 border rounded text-black"
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
          <label className="block text-sm font-medium mb-1 text-white">Tags</label>
          <div className="grid grid-cols-2 gap-2">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center space-x-2 text-white">
                <input
                  type="checkbox"
                  checked={formData.tagIds.includes(tag.id)}
                  onChange={() => handleTagChange(tag.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>{tag.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push("/admin/artists")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Création en cours..." : "Créer"}
          </button>
        </div>
      </form>
    </div>
  );
} 