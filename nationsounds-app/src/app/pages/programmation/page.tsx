"use client";

import React from "react";
import GroupList from "../../components/GroupList";

const Programmation: React.FC = () => {
  return (
    <React.Fragment>
      <div className="flex justify-center bg-black">
        <GroupList />
      </div>
    </React.Fragment>
  );
};

export default Programmation;
