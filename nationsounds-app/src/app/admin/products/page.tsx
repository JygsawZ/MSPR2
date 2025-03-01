"use client";

import { useState, useEffect } from "react";
import type { Product } from ".prisma/client";

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Charger les produits
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des produits");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Supprimer un produit
  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      setProducts(products.filter(product => product.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de suppression");
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">Erreur: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Gestion des Produits</h1>
        <button
          onClick={() => window.location.href = "/admin/products/new"}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Ajouter un produit
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b text-left text-black">Nom</th>
              <th className="px-6 py-3 border-b text-left text-black">Description</th>
              <th className="px-6 py-3 border-b text-left text-black">Prix</th>
              <th className="px-6 py-3 border-b text-left text-black">Quantité</th>
              <th className="px-6 py-3 border-b text-left text-black">Catégorie</th>
              <th className="px-6 py-3 border-b text-center text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b text-black">{product.name}</td>
                <td className="px-6 py-4 border-b text-black">
                  {product.description.length > 100
                    ? `${product.description.substring(0, 100)}...`
                    : product.description}
                </td>
                <td className="px-6 py-4 border-b text-black">
                  {product.price.toFixed(2)} €
                </td>
                <td className="px-6 py-4 border-b text-black">
                  {product.quantity}
                </td>
                <td className="px-6 py-4 border-b text-black">
                  {product.categoryId ? `Catégorie ${product.categoryId}` : "Non catégorisé"}
                </td>
                <td className="px-6 py-4 border-b text-center">
                  <button
                    onClick={() => window.location.href = `/admin/products/${product.id}/edit`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
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