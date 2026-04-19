import React from "react";
import SalonCard from "./SalonCard";

const SalonList = ({ salons }) => {
  return (
    <div className="flex gap-5 flex-wrap">
      {salons?.map((item) => (
        <SalonCard key={item.id} salon={item} />
      ))}
    </div>
  );
};

export default SalonList;