import React, { useState } from "react";
import { Artists } from "../../../typescript/artists";
import Image from "next/image.js";

const GroupCard = ({ artist }: { artist: Artists }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-full">
      <div className="card bg-base-100 shadow-xl h-full flex flex-col">
        <figure className="relative w-full aspect-video">
          <Image
            src={artist.image || "/default-artist.jpg"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
            alt={artist.name}
            className="rounded-t-xl"
          />
        </figure>
        <div className="card-body flex flex-col flex-grow p-4">
          <div className="space-y-2">
            <h2 className="card-title text-lg md:text-xl lg:text-2xl">
              {artist.name}
            </h2>
            {artist.tags && artist.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {artist.tags.map((tagObj) => (
                  <span
                    key={tagObj.tag.name}
                    className="inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full break-words"
                  >
                    {tagObj.tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="text-sm md:text-base lg:text-lg mt-2">
            {artist.jour} - {artist.heure}
          </div>
          <div className="text-sm md:text-base lg:text-lg">
            Scène: {artist.scene?.name || "Inconnue"}
          </div>
          <div className="card-actions mt-auto">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="w-full bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors p-3"
            >
              <div className="flex items-center justify-between text-white text-sm md:text-base">
                Description
                <svg 
                  className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
              <div className="bg-gray-900 text-white rounded-b-lg text-sm md:text-base p-3">
                <p className="whitespace-pre-wrap">{artist.description || "Aucune description disponible"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
