"use client";

import { useSession } from "next-auth/react";
import { FaUsers, FaGuitar, FaStore, FaTags } from "react-icons/fa";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <div className={`p-6 rounded-lg ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-200 mb-1">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      <div className="text-white text-3xl">{icon}</div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const { data: session } = useSession();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Bienvenue
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Utilisateurs"
          value={150}
          icon={<FaUsers />}
          color="bg-blue-600"
        />
        <StatCard
          title="Artistes"
          value={24}
          icon={<FaGuitar />}
          color="bg-green-600"
        />
        <StatCard
          title="Produits"
          value={45}
          icon={<FaStore />}
          color="bg-purple-600"
        />
        <StatCard
          title="Tags"
          value={12}
          icon={<FaTags />}
          color="bg-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Dernières activités</h2>
          <div className="space-y-4">
            <div className="flex items-center text-gray-300">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <p>Nouvel artiste ajouté : "Les Frangines"</p>
            </div>
            <div className="flex items-center text-gray-300">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <p>Mise à jour du running order</p>
            </div>
            <div className="flex items-center text-gray-300">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <p>Nouveau produit ajouté : "T-shirt Festival"</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Tâches en attente</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-gray-300">
              <span>Valider les nouveaux artistes</span>
              <span className="bg-yellow-500 text-black px-2 py-1 rounded text-sm">En attente</span>
            </div>
            <div className="flex items-center justify-between text-gray-300">
              <span>Mettre à jour les horaires</span>
              <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">Urgent</span>
            </div>
            <div className="flex items-center justify-between text-gray-300">
              <span>Vérifier le stock des produits</span>
              <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">En cours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 