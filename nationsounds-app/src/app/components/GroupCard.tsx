import React from "react";
import { Artists } from "../../../typescript/artists";
import Image from "next/image.js";
import { Button } from "@/components/ui/Button/Button";

const GroupCard = ({ artist }: { artist: Artists }) => {
  return (
    <React.Fragment>
      <div className="p-4">
        <div className="card bg-base-100 shadow-xl lg:card-normal flex flex-col ">
          <figure className="relative w-full" style={{ height: "50vh" }}>
            <Image
              src={artist.imageUrl}
              layout="fill"
              objectFit="contain"
              objectPosition="top"
              alt={artist.name}
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
              <div className="collapse bg-black">
                <input title="checkbox" type="checkbox" className="peer" />
                <div className="collapse-title bg-black text-white peer-checked:bg-black peer-checked:text-white md:text-xl lg:text-2xl">
                  Description
                </div>
                <div className="collapse-content bg-black text-white peer-checked:bg-black peer-checked:text-white md:text-xl lg:text-2xl">
                  <p id="description">{artist.description}</p>
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
