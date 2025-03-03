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

  // Filtrer et regrouper les artistes par jour
  const groupedArtists = useMemo(() => {
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

      return matchesSearch && matchesDay && matchesTimeRange && matchesTags;
    });

    // Trier les artistes par horaire
    const sorted = filtered.sort((a, b) => {
      const runningOrderA = runningOrders.find(order => order.artistId === a.id);
      const runningOrderB = runningOrders.find(order => order.artistId === b.id);

      if (!runningOrderA) return 1;
      if (!runningOrderB) return -1;

      return new Date(runningOrderA.startTime).getTime() - new Date(runningOrderB.startTime).getTime();
    });

    // Grouper par jour
    const groups = sorted.reduce((acc, artist) => {
      const runningOrder = runningOrders.find(order => order.artistId === artist.id);
      if (runningOrder) {
        const date = new Date(runningOrder.startTime);
        const day = date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push(artist);
      }
      return acc;
    }, {} as Record<string, Artists[]>);

    return groups;
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
      
      {Object.entries(groupedArtists).length > 0 ? (
        Object.entries(groupedArtists).map(([day, dayArtists]) => (
          <div key={day} className="mb-12">
            {/* Séparateur de jour */}
            <div className="relative flex justify-center my-8">
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-75"></div>
              <span className="relative z-10 bg-black px-6 text-white md:text-2xl lg:text-4xl">
                {day}
              </span>
            </div>

            {/* Grille d'artistes pour ce jour */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dayArtists.map((artist) => (
                <div key={artist.id} className="w-full">
                  <GroupCard artist={artist} />
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-white text-lg">
          Aucun artiste ne correspond aux critères de recherche
        </div>
      )}
    </div>
  );
};

export default GroupList;
