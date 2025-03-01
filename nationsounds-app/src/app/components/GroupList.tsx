"use client";

import React, { useEffect, useState } from "react";
import { Artists } from "../../../typescript/artists";
import GroupCard from "./GroupCard";

const GroupList: React.FC = () => {
  const [artists, setArtists] = useState<Artists[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtists = async () => {
      //Récupération et affichage des artistes
      try {
        const response = await fetch("/api/artists");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des artistes");
        }
        const data = await response.json();
        setArtists(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);
  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  // const filteredArtists =
  //   selectedDay === "Tous"
  //     ? artists
  //     : artists.filter((artist) => artist.jour === selectedDay);

  // const groupedArtists = filteredArtists.reduce<{
  //   [key: string]: Artists[];
  // }>((acc, artist) => {
  //   if (!acc[artist.jour]) {
  //     acc[artist.jour] = [];
  //   }
  //   acc[artist.jour].push(artist);
  //   return acc;
  // }, {});

  return (
    <React.Fragment>
      <div className="lg:px-52">
        <div className="flex justify-center ">
          <button
            title="day"
            className="btn btn mx-1 lg:btn-lg md:mx-2"
          ></button>
        </div>
        <div>
          <div>
            <span className="relative flex justify-center bg-black p-4">
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-75"></div>
            </span>
            <div>
              {artists.length > 0 ? (
                artists.map((artist) => (
                  <GroupCard key={artist.id} artist={artist} />
                ))
              ) : (
                <p>Aucun artiste trouvé</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default GroupList;

{
  /* <React.Fragment>
<div className="lg:px-52">
  <div className="flex justify-center ">
    {["Tous", "Vendredi", "Samedi", "Dimanche"].map((day) => (
      <button
        key={day}
        className={`btn btn mx-1 lg:btn-lg md:mx-2 ${
          selectedDay === day ? "border-white bg-black text-white" : ""
        }`}
        onClick={() =>
          setSelectedDay(
            day as "Tous" | "Vendredi" | "Samedi" | "Dimanche"
          )
        }
      >
        {day}
      </button>
    ))}
  </div>
  <div>
    {Object.keys(groupdArtists).map((day) => (
      <div key={day}>
        <span className="relative flex justify-center bg-black p-4">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-75"></div>
          <span className="relative z-10 bg-black px-6 text-white md:text-2xl lg:text-4xl">
            {day}
          </span>
        </span>
        {groupedArtists[day].map((artist) => (
          <GroupCard key={artist.id} artists={artist} />
        ))}
      </div>
    ))}
    {filteredArtists.length === 0 && <p>Aucun artiste trouvé.</p>}
  </div>
</div>
</React.Fragment> */
}
