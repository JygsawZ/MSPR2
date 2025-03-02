"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Artists } from "../../../typescript/artists";
import GroupCard from "./GroupCard";
import Filter from "./Filter";

interface RunningOrder {
  id: number;
  artistId: number;
  sceneId: number;
  startTime: string;
  endTime: string;
}

const GroupList: React.FC = () => {
  const [artists, setArtists] = useState<Artists[]>([]);
  const [runningOrders, setRunningOrders] = useState<RunningOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    searchQuery: "",
    selectedDay: "",
    timeRange: {
      start: "",
      end: "",
    },
    selectedTags: [] as string[],
  });

  // Récupérer tous les jours uniques des running orders
  const availableDays = useMemo(() => {
    const daysSet = new Set<string>();
    runningOrders.forEach((order) => {
      if (order.startTime) {
        const date = new Date(order.startTime);
        const day = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
        daysSet.add(day);
      }
    });
    return Array.from(daysSet).sort();
  }, [runningOrders]);

  // Récupérer tous les tags uniques des artistes
  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    artists.forEach((artist) => {
      artist.tags?.forEach((tagRelation) => {
        if (tagRelation.tag.name) {
          tagsSet.add(tagRelation.tag.name);
        }
      });
    });
    return Array.from(tagsSet).map((name, id) => ({ id, name }));
  }, [artists]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les artistes
        const artistsResponse = await fetch("/api/artists");
        if (!artistsResponse.ok) {
          throw new Error("Erreur lors de la récupération des artistes");
        }
        const artistsData = await artistsResponse.json();

        // Récupérer les running orders
        const runningOrdersResponse = await fetch("/api/running-orders");
        if (!runningOrdersResponse.ok) {
          throw new Error("Erreur lors de la récupération des running orders");
        }
        const runningOrdersData = await runningOrdersResponse.json();

        setArtists(artistsData);
        setRunningOrders(runningOrdersData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrer les artistes en fonction des critères
  const filteredArtists = useMemo(() => {
    // D'abord, filtrer les artistes
    const filtered = artists.filter((artist) => {
      // Trouver le running order correspondant à l'artiste
      const artistRunningOrder = runningOrders.find(
        (order) => order.artistId === artist.id
      );

      // Vérifier tous les critères de filtrage
      const matchesSearch = !filters.searchQuery || 
        artist.name.toLowerCase().includes(filters.searchQuery.toLowerCase());

      let matchesDay = true;
      if (filters.selectedDay && artistRunningOrder) {
        const date = new Date(artistRunningOrder.startTime);
        const day = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
        matchesDay = day === filters.selectedDay;
      }

      let matchesTimeRange = true;
      if (filters.timeRange.start && filters.timeRange.end && artistRunningOrder) {
        const startTime = new Date(artistRunningOrder.startTime);
        const startHour = startTime.getHours().toString().padStart(2, '0') + ':' + 
                         startTime.getMinutes().toString().padStart(2, '0');
        matchesTimeRange = startHour >= filters.timeRange.start && startHour <= filters.timeRange.end;
      }

      let matchesTags = true;
      if (filters.selectedTags.length > 0) {
        const artistTags = artist.tags?.map((tagRelation) => tagRelation.tag.name) || [];
        matchesTags = filters.selectedTags.every((tag) => artistTags.includes(tag));
      }

      // Retourner true seulement si TOUS les critères sont satisfaits
      return matchesSearch && matchesDay && matchesTimeRange && matchesTags;
    });

    // Ensuite, trier les artistes filtrés par horaire de passage
    return filtered.sort((a, b) => {
      const runningOrderA = runningOrders.find(order => order.artistId === a.id);
      const runningOrderB = runningOrders.find(order => order.artistId === b.id);

      // Si un artiste n'a pas de running order, le mettre à la fin
      if (!runningOrderA) return 1;
      if (!runningOrderB) return -1;

      // Comparer les dates de passage
      return new Date(runningOrderA.startTime).getTime() - new Date(runningOrderB.startTime).getTime();
    });
  }, [artists, runningOrders, filters]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">Erreur: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Filter
        onFilterChange={setFilters}
        availableTags={availableTags}
        availableDays={availableDays}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredArtists.length > 0 ? (
          filteredArtists.map((artist) => (
            <div key={artist.id} className="w-full">
              <GroupCard artist={artist} />
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <p className="text-center text-white text-lg">
              Aucun artiste ne correspond aux critères de recherche
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupList;
