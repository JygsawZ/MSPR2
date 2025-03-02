"use client";

import React from "react";
import GroupList from "../../components/GroupList";
import dynamic from "next/dynamic";
import Image from "next/image";

const Accueil: React.FC = () => {
  const DynamicMap = dynamic(() => import("../../components/InteractiveMap"), {
    ssr: false,
  });

  return (
    <React.Fragment>
      <div className="flex-col justify-items-center">
        <div className="flex justify-center pt-20 pb-5">
          <Image
            src="/corefeast3.jpg"
            alt="Core Feast"
            width={500}
            height={300}
            priority
            className="w-auto h-auto"
          />
        </div>
        <div className="flex-col py-4 text-center text-2xl text-white md:text-4xl lg:text-6xl">
          <h2 className="font-bold">Bienvenue au Nation Sound !</h2>
        </div>
        <div className="mx-8 flex-col justify-items-center px-2 py-8 text-white md:text-xl lg:text-3xl">
          <div>
            Plonge dans l&apos;univers intense du metalcore, deathcore et
            hardcore ! Prépare-toi à vivre des concerts explosifs avec les
            meilleurs groupes de la scène, des mosh pits déchaînés et une
            énergie brute à couper le souffle. Que tu viennes pour voir tes
            artistes préférés ou découvrir de nouvelles légendes, ce festival
            est une immersion totale dans la musique extrême.
          </div>
          <br />
          <div>
            Rejoins-nous pour un week-end de pur plaisir, de passion, et
            d&apos;adrénaline. Le chaos n'attend plus que toi !
          </div>
        </div>
      </div>
      <div className="flex justify-center bg-black">
        <GroupList />
      </div>
      <div>
        <DynamicMap />
      </div>
    </React.Fragment>
  );
};

export default Accueil;
