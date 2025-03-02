import React, { useState } from "react";
import { Artists } from "../../../typescript/artists";
import Image from "next/image.js";
import { Button } from "@/components/ui/Button/Button";

const GroupCard = ({ artist }: { artist: Artists }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <React.Fragment>
      <div className="p-4">
        <div className="card bg-base-100 shadow-xl lg:card-normal flex flex-col">
          <figure className="relative w-full aspect-video">
            <Image
              src={artist.image || "/default-artist.jpg"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
              alt={artist.name}
              className="rounded-t-xl"
            />
          </figure>
          <div className="card-body flex flex-col flex-grow-0">
            <h2 className="card-title md:text-2xl lg:text-4xl">
              {artist.name}
              {artist.tags && artist.tags.length > 0 && (
                <div className="badge badge-neutral badge-xs sm:badge-sm md:badge-md">
                  {artist.tags.map((tagObj) => tagObj.tag.name).join(", ")}
                </div>
              )}
            </h2>
            <div className="md:text-xl lg:text-2xl">
              {artist.jour} - {artist.heure}
            </div>
            <div className="md:text-xl lg:text-2xl">
              Scène: {artist.scene?.name || "Inconnue"}
            </div>
            <div className="card-actions justify-end mt-auto">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors p-4"
              >
                <div className="flex items-center justify-between text-white md:text-xl lg:text-2xl">
                  Description
                  <svg 
                    className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div 
                className={`w-full overflow-hidden transition-all duration-200 ease-in-out ${
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="bg-gray-900 text-white rounded-b-lg md:text-lg p-4">
                  <p className="whitespace-pre-wrap">{artist.description || "Aucune description disponible"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default GroupCard;
