"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditUser({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${params.id}`);
        if (!response.ok) {
          throw new Error("Erreur lors du chargement de l'utilisateur");
        }
        const data = await response.json();
        setFormData({
          email: data.email,
          password: "",
          role: data.role,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Ne pas envoyer le mot de passe s'il est vide
      const dataToSend = {
        email: formData.email,
        role: formData.role,
        ...(formData.password && { password: formData.password }),
      };

      const response = await fetch(`/api/users/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      router.push("/admin/users");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de mise à jour");
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">Erreur: {error}</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-black">Modifier l'utilisateur</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-black">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-black">
            Nouveau mot de passe (laisser vide pour ne pas changer)
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-2 border rounded"
            minLength={6}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-black">Rôle</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full p-2 border rounded"
            required
          >
            <option value="USER">Utilisateur</option>
            <option value="ADMIN">Administrateur</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push("/admin/users")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
} 