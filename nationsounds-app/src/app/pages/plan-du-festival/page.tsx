"use client";

import React from "react";
import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("../../components/InteractiveMap"), {
  ssr: false,
});

const Map: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg overflow-hidden shadow-2xl">
          <DynamicMap />
        </div>
      </div>
    </div>
  );
};

export default Map;
