"use client";

import React from "react";
import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("../../components/InteractiveMap"), {
  ssr: false,
});

const Map: React.FC = () => {
  return (
    <React.Fragment>
      <div className="flex justify-center bg-black">
        <DynamicMap />
      </div>
    </React.Fragment>
  );
};
export default Map;
