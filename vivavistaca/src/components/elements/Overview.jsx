import React, { useState } from "react";
import {
  Flame,
  Sparkles,
  Utensils,
  Grid2X2CheckIcon,
  TicketsIcon,
  Ruler,
  Waves,
  Users,
  BedDouble,
  Clock,
  Globe2,
  TelescopeIcon,
  PlusCircle,
  ShieldCheck,
  Hotel,
} from "lucide-react";
import { AccommodationSlider } from "./AccommodationSlider";

// Reusable Section Component with View More toggle
const Section = ({ title, items, icon }) => {
  const [showAll, setShowAll] = useState(false);
  const shouldShowToggle = items?.length > 3;
  const visibleItems = showAll ? items : items?.slice(0, 3);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-3 text-gray-800 flex items-center gap-2">
        {icon} {title}
      </h2>
      {items?.length > 0 ? (
        <>
          <ul className="list-disc list-inside text-gray-700 space-y-1 text-base">
            {visibleItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          {shouldShowToggle && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              {showAll ? "View Less" : "View More"}
            </button>
          )}
        </>
      ) : (
        <p className="text-gray-500 italic text-base">No items specified</p>
      )}
    </div>
  );
};

// Reusable Info Item
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-2">
    {icon}
    <strong>{label}:</strong> <span>{value}</span>
  </div>
);

// Main Overview Component
const Overview = ({
  tripData,
  availableCountries,
  whatsIncluded,
  exclusiveAdditions,
  termsAndConditions,
  hotels,
}) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-wide bg-transparent bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center gap-3 customfontstitle">
          <TelescopeIcon className="w-7 h-7 text-orange-500" />
          Discover the Deal
        </h1>
        <p className="text-gray-800 text-base sm:text-lg mt-3 leading-relaxed customfontstitle">
          {tripData.description}
        </p>
      </div>

      {/* Trip Summary */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5 text-base sm:text-lg text-gray-700 customfontstitle">
        {/* <InfoItem
          icon={<Globe2 className="text-blue-500 w-5 h-5" />}
          label="Countries"
          value={
            availableCountries?.length
              ? availableCountries.join(", ")
              : "Not specified"
          }
        /> */}
        <InfoItem
          icon={<Utensils className="text-green-500 w-5 h-5" />}
          label="Board Basis"
          value={tripData.boardBasis.name}
        />
        <InfoItem
          icon={<Ruler className="text-purple-500 w-5 h-5" />}
          label="To Center"
          value={`${tripData.distanceToCenter}`}
        />
        <InfoItem
          icon={<Waves className="text-teal-500 w-5 h-5" />}
          label="To Beach"
          value={`${tripData.distanceToBeach}`}
        />
        <InfoItem
          icon={<Clock className="text-indigo-500 w-5 h-5" />}
          label="Duration"
          value={`${tripData.days} Nights`}
        />
        <InfoItem
          icon={<BedDouble className="text-amber-500 w-5 h-5" />}
          label="Rooms"
          value={tripData.rooms}
        />
        <InfoItem
          icon={<Users className="text-pink-500 w-5 h-5" />}
          label="Guests"
          value={tripData.guests}
        />
      </div>

      {/* Highlights */}
      {(tripData.isTopDeal || tripData.isHotdeal) && (
        <div className="flex gap-4 mt-2">
          {tripData.isTopDeal && (
            <p className="text-amber-600 font-semibold flex items-center gap-2 bg-amber-100 rounded px-4 py-2 text-base">
              <Sparkles className="w-5 h-5" /> Top Deal
            </p>
          )}
          {tripData.isHotdeal && (
            <p className="text-red-600 font-semibold flex items-center gap-2 bg-red-100 rounded px-4 py-2 text-base">
              <Flame className="w-5 h-5" /> Hot Deal
            </p>
          )}
        </div>
      )}

      {/* What's Included */}
      <Section
        title="What's Included"
        icon={
          <Grid2X2CheckIcon className="w-6 h-6 text-green-500 customfontstitle" />
        }
        items={whatsIncluded}
      />

      {/* Exclusive Additions */}
      <Section
        title="Exclusive Additions"
        icon={<PlusCircle className="w-6 h-6 text-blue-500 customfontstitle" />}
        items={exclusiveAdditions}
      />

      {/* Terms & Conditions */}
      {/* <Section
        title="Terms & Conditions"
        icon={<ShieldCheck className="w-6 h-6 text-indigo-500" />}
        items={termsAndConditions}
      /> */}

      {/* Hotels Slider */}
      {hotels?.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-800 flex items-center gap-2 customfontstitle">
            <TicketsIcon className="w-6 h-6 text-orange-500" />
            Accommodation
          </h2>
          <AccommodationSlider hotels={hotels} />
        </div>
      )}
    </div>
  );
};

export default Overview;
