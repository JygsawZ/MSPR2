"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface RunningOrderItem {
  id: number;
  artistId: number;
  sceneId: number;
  startTime: string;
  endTime: string;
  artist: {
    name: string;
  };
  scene: {
    name: string;
  };
}

export default function RunningOrderManagement() {
  const [runningOrder, setRunningOrder] = useState<RunningOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRunningOrder = async () => {
      try {
        const response = await fetch("/api/running-order");
        if (!response.ok) {
          throw new Error("Erreur lors du chargement du running order");
        }
        const data = await response.json();
        setRunningOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchRunningOrder();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce créneau ?")) return;

    try {
      const response = await fetch(`/api/running-order/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      setRunningOrder(runningOrder.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de suppression");
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd MMMM yyyy HH:mm", { locale: fr });
  };

  if (loading) return (
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

  if (error) return (
    <div className="p-4">
      <div className="text-red-500 bg-red-900/20 p-3 rounded-md border border-red-500">
        {error}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Running Order</h1>
        <button
          onClick={() => window.location.href = "/admin/running-order/new"}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Ajouter un créneau
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b text-left text-black">Artiste</th>
              <th className="px-6 py-3 border-b text-left text-black">Scène</th>
              <th className="px-6 py-3 border-b text-left text-black">Début</th>
              <th className="px-6 py-3 border-b text-left text-black">Fin</th>
              <th className="px-6 py-3 border-b text-center text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {runningOrder.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b text-black">{item.artist.name}</td>
                <td className="px-6 py-4 border-b text-black">{item.scene.name}</td>
                <td className="px-6 py-4 border-b text-black">{formatDateTime(item.startTime)}</td>
                <td className="px-6 py-4 border-b text-black">{formatDateTime(item.endTime)}</td>
                <td className="px-6 py-4 border-b text-center">
                  <button
                    onClick={() => window.location.href = `/admin/running-order/${item.id}/edit`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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