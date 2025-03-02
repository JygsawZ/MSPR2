"use client";

import React, { useState } from 'react';

interface FilterProps {
  onFilterChange: (filters: {
    searchQuery: string;
    selectedDay: string;
    timeRange: {
      start: string;
      end: string;
    };
    selectedTags: string[];
  }) => void;
  availableTags: { id: number; name: string }[];
  availableDays: string[];
}

const Filter: React.FC<FilterProps> = ({ onFilterChange, availableTags, availableDays }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Les créneaux horaires
  const timeSlots = [
    "14:00", "15:00", "16:00", "17:00", "18:00",
    "19:00", "20:00", "21:00", "22:00", "23:00"
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    updateFilters({ searchQuery: value });
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedDay(value);
    updateFilters({ selectedDay: value });
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStartTime(value);
    updateFilters({ timeRange: { start: value, end: endTime } });
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setEndTime(value);
    updateFilters({ timeRange: { start: startTime, end: value } });
  };

  const handleTagToggle = (tagName: string) => {
    const updatedTags = selectedTags.includes(tagName)
      ? selectedTags.filter(tag => tag !== tagName)
      : [...selectedTags, tagName];
    
    setSelectedTags(updatedTags);
    updateFilters({ selectedTags: updatedTags });
  };

  const updateFilters = (updatedValues: Partial<{
    searchQuery: string;
    selectedDay: string;
    timeRange: { start: string; end: string };
    selectedTags: string[];
  }>) => {
    onFilterChange({
      searchQuery: updatedValues.searchQuery ?? searchQuery,
      selectedDay: updatedValues.selectedDay ?? selectedDay,
      timeRange: updatedValues.timeRange ?? { start: startTime, end: endTime },
      selectedTags: updatedValues.selectedTags ?? selectedTags,
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDay("");
    setStartTime("");
    setEndTime("");
    setSelectedTags([]);
    onFilterChange({
      searchQuery: "",
      selectedDay: "",
      timeRange: { start: "", end: "" },
      selectedTags: [],
    });
  };

  return (
    <div className="bg-black border border-white p-4 rounded-lg shadow-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Recherche par nom */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-300">Rechercher un artiste</span>
          </label>
          <input
            type="text"
            placeholder="Nom de l'artiste..."
            className="input input-bordered bg-gray-900 text-white border-gray-700 w-full placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Filtre par jour */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-300">Jour</span>
          </label>
          <select
            className="select select-bordered bg-gray-900 text-white border-gray-700 w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={selectedDay}
            onChange={handleDayChange}
          >
            <option value="" className="bg-gray-900">Tous les jours</option>
            {availableDays.map((day) => (
              <option key={day} value={day} className="bg-gray-900">
                {day}
              </option>
            ))}
          </select>
        </div>

        {/* Filtre par plage horaire */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-300">Plage horaire</span>
          </label>
          <div className="flex gap-2">
            <select
              className="select select-bordered bg-gray-900 text-white border-gray-700 w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={startTime}
              onChange={handleStartTimeChange}
            >
              <option value="" className="bg-gray-900">Début</option>
              {timeSlots.map((time) => (
                <option key={time} value={time} className="bg-gray-900">
                  {time}
                </option>
              ))}
            </select>
            <select
              className="select select-bordered bg-gray-900 text-white border-gray-700 w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={endTime}
              onChange={handleEndTimeChange}
            >
              <option value="" className="bg-gray-900">Fin</option>
              {timeSlots.map((time) => (
                <option key={time} value={time} className="bg-gray-900">
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bouton de réinitialisation */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-gray-300">Réinitialiser</span>
          </label>
          <button
            onClick={clearFilters}
            className="btn bg-gray-800 text-white hover:bg-gray-700 border-gray-700 w-full"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-4">
        <label className="label">
          <span className="label-text text-gray-300">Tags</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleTagToggle(tag.name)}
              className={`btn btn-sm ${
                selectedTags.includes(tag.name)
                  ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 border-gray-700"
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filter;
