// Example in AccommodationSlider.jsx
import React from "react";
import AccommodationCard from "./AccommodationCardWithDrawer";

export const AccommodationSlider = ({ hotels }) => {
  if (!hotels || hotels.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="flex space-x-4 overflow-x-auto pb-4 snap-x snap-mandatory">
        {hotels.map((hotel) => (
          <div key={hotel._id} className="snap-start">
            <AccommodationCard hotel={hotel} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccommodationSlider;
