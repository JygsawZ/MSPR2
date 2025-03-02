"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/lib/supabase";
import Image from "next/image";
import { use } from "react";

interface Scene {
  id: number;
  name: string;
}

interface Artist {
  id: number;
  name: string;
  description: string;
  image: string | null;
  sceneId: number | null;
}

export default function EditArtist({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sceneId: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Charger l'artiste et les scènes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger l'artiste
        const artistResponse = await fetch(`/api/artists/${id}`);
        if (!artistResponse.ok) {
          throw new Error("Erreur lors du chargement de l'artiste");
        }
        const artistData: Artist = await artistResponse.json();
        
        setFormData({
          name: artistData.name,
          description: artistData.description,
          sceneId: artistData.sceneId?.toString() || "",
        });
        
        if (artistData.image) {
          setCurrentImage(artistData.image);
          setImagePreview(artistData.image);
        }

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
  }, [id]);

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
      let imageUrl = currentImage;

      if (selectedFile) {
        try {
          // Pass the current image URL to handle replacement
          imageUrl = await uploadImage(selectedFile, currentImage || undefined);
        } catch (uploadErr: any) {
          console.error("Upload error:", uploadErr);
          throw new Error(`Erreur lors de l'upload: ${uploadErr?.message || 'Erreur inconnue'}`);
        }
      }

      const response = await fetch(`/api/artists/${id}`, {
        method: "PUT",
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
        throw new Error(errorData.error || "Erreur lors de la modification");
      }

      router.push("/admin/artists");
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">Erreur: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Modifier l'artiste</h1>
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
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full p-2 rounded-md bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-black"
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
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            required
            className="w-full p-2 rounded-md bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-black"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1 text-white">
            Image
          </label>
          {currentImage && !selectedFile && (
            <div className="mb-2">
              <p className="text-sm text-gray-300 mb-2">Image actuelle :</p>
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={currentImage}
                  alt="Current"
                  fill
                  className="rounded object-cover"
                />
              </div>
            </div>
          )}
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full p-2 rounded-md bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-black"
          />
          {selectedFile && imagePreview && (
            <div className="mt-2">
              <p className="text-sm text-gray-300 mb-2">Nouvelle image :</p>
              <div className="relative w-full h-48">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="rounded object-cover"
                />
              </div>
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
          <label htmlFor="sceneId" className="block text-sm font-medium mb-1 text-white">
            Scène
          </label>
          <select
            id="sceneId"
            name="sceneId"
            value={formData.sceneId}
            onChange={(e) => setFormData({ ...formData, sceneId: e.target.value })}
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

        {error && (
          <div className="text-red-500 bg-red-900/20 p-3 rounded-md border border-red-500">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Modification en cours..." : "Modifier"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/artists")}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
} 