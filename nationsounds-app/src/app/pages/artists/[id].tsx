"use strict";

// File: [id].tsx
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const DetailArtist = () => {
  const router = useRouter();
  const { id } = router.query;
  interface Artist {
    imageUrl: string;
    name: string;
    tags: string;
    jour: string;
    heure: string;
    scene: string;
    description: string;
  }

  const [artist, setArtist] = useState<Artist | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/artists/${id}`)
        .then((res) => res.json())
        .then((data) => setArtist(data));
    }
  }, [id]);

  if (!artist) {
    return <div>Loading...</div>;
  }
  return (
    <React.Fragment>
      <div className="lg:px-52">
        <div className="p-4">
          <div className="card bg-base-100 shadow-xl lg:card-normal">
            <figure>
              <Image
                className="w-full"
                src={artist.imageUrl}
                alt="image"
                layout="responsive"
                width={700}
                height={475}
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title md:text-2xl lg:text-4xl">
                {artist.name}
                <div className="badge badge-neutral badge-xs sm:badge-sm md:badge-md">
                  {artist.tags}
                </div>
              </h2>
              <div className="md:text-xl lg:text-2xl">
                {artist.jour} - {artist.heure}
              </div>
              <div className="md:text-xl lg:text-2xl">
                Scène: {artist.scene}
              </div>
              <div className="card-actions justify-end">
                <div className="collapse bg-black">
                  <input
                    title="checkbox"
                    type="checkbox"
                    className="peer"
                    defaultChecked
                  />
                  <div className="collapse-title bg-black text-primary-content peer-checked:bg-black peer-checked:text-secondary-content md:text-xl lg:text-2xl">
                    Description
                  </div>
                  <div className="collapse-content bg-black text-primary-content peer-checked:bg-black peer-checked:text-secondary-content md:text-xl lg:text-2xl">
                    <p id="description">{artist.description}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center p-4">
                <button className="btn btn-outline">
                  <Link href="../">Retour</Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default DetailArtist;
