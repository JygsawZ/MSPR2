"use client";
import React, { useEffect, useState } from "react";
import { Artistes } from "../../../typescript/artistes";
import axios from "axios";
import GroupCard from "./GroupCard";
import { BASE_URL3 } from "../config/config";

const GroupList: React.FC = () => {
  const [artistes, setArtistes] = useState<Artistes[]>([]);
  const [selectedDay, setSelectedDay] = useState<
    "Tous" | "Vendredi" | "Samedi" | "Dimanche"
  >("Tous");

  useEffect(() => {
    const fetchArtistes = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL3}/wp-json/custom/v1/artistes`
        );

        const order: { [key in "Vendredi" | "Samedi" | "Dimanche"]: number } = {
          Vendredi: 1,
          Samedi: 2,
          Dimanche: 3,
        }; // Ordre des jours
        const hourOrder: {
          [key in
            | "17h00"
            | "18h30"
            | "20h00"
            | "21h30"
            | "23h00"
            | "1h30"]: number;
        } = {
          "17h00": 1,
          "18h30": 2,
          "20h00": 3,
          "21h30": 4,
          "23h00": 5,
          "1h30": 6,
        };

        const sortedArtistes = response.data.sort(
          (a: Artistes, b: Artistes) => {
            if (
              order[a.jour as "Vendredi" | "Samedi" | "Dimanche"] !==
              order[b.jour as "Vendredi" | "Samedi" | "Dimanche"]
            ) {
              return (
                order[a.jour as "Vendredi" | "Samedi" | "Dimanche"] -
                order[b.jour as "Vendredi" | "Samedi" | "Dimanche"]
              );
            }
            return (
              hourOrder[
                a.heure as
                  | "17h00"
                  | "18h30"
                  | "20h00"
                  | "21h30"
                  | "23h00"
                  | "1h30"
              ] -
              hourOrder[
                b.heure as
                  | "17h00"
                  | "18h30"
                  | "20h00"
                  | "21h30"
                  | "23h00"
                  | "1h30"
              ]
            );
          }
        );

        setArtistes(sortedArtistes);
      } catch (error) {
        console.error(
          "Il y a eu une erreur lors de la récupération des artistes :",
          error
        );
      }
    };

    fetchArtistes();
  }, []);

  const filteredArtistes =
    selectedDay === "Tous"
      ? artistes
      : artistes.filter((artiste) => artiste.jour === selectedDay);

  const groupedArtistes = filteredArtistes.reduce<{
    [key: string]: Artistes[];
  }>((acc, artiste) => {
    if (!acc[artiste.jour]) {
      acc[artiste.jour] = [];
    }
    acc[artiste.jour].push(artiste);
    return acc;
  }, {});

  return (
    <React.Fragment>
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
          {Object.keys(groupedArtistes).map((day) => (
            <div key={day}>
              <span className="relative flex justify-center bg-black p-4">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-transparent bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-75"></div>
                <span className="relative z-10 bg-black px-6 text-white md:text-2xl lg:text-4xl">
                  {day}
                </span>
              </span>
              {groupedArtistes[day].map((artiste) => (
                <GroupCard key={artiste.ID} artiste={artiste} />
              ))}
            </div>
          ))}
          {filteredArtistes.length === 0 && <p>Aucun artiste trouvé.</p>}
        </div>
      </div>
    </React.Fragment>
  );
};

export default GroupList;
