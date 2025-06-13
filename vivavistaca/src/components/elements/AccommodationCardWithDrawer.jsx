import React, { useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Hotel } from "lucide-react";
import {
  Drawer,
  Button,
  Typography,
  IconButton,
} from "@material-tailwind/react";

const AccommodationCard = ({ hotel }) => {
  const rating = hotel.tripAdvisorRating;
  const reviews = hotel.tripAdvisorReviews;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i + 1 <= Math.floor(rating)) {
        stars.push(<FaStar key={i} className="text-amber-500 text-sm" />);
      } else if (i < rating) {
        stars.push(
          <FaStarHalfAlt key={i} className="text-amber-500 text-sm" />
        );
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300 text-sm" />);
      }
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg flex flex-col md:w-80 w-64 mr-4 shrink-0 customfontstitle">
      {/* Hotel Name */}
      <div className="flex items-center gap-3 mb-3">
        <Hotel className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-800">
          {hotel.name || "Hotel Name"}
        </h2>
      </div>

      {/* Short Description */}
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        {hotel.about
          ? hotel.about.substring(0, 150) + "..."
          : "No description available."}
      </p>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        {rating ? (
          <>
            {renderStars()}
            <span className="text-sm text-gray-700 ml-2 font-medium">
              {rating.toFixed(1)}{" "}
              <span className="text-gray-500">({reviews} reviews)</span>
            </span>
          </>
        ) : (
          <span className="text-sm text-gray-500 italic">No reviews yet</span>
        )}
      </div>

      {/* Button */}
      <Button
        size="sm"
        onClick={openDrawer}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 customfontstitle"
      >
        View More
      </Button>

      {/* Drawer */}
      <Drawer
        placement="right"
        open={drawerOpen}
        onClose={closeDrawer}
        // override the backdrop to cover the entire screen
        overlayProps={{
          className:
            "fixed inset-0 z-[9998] bg-black bg-opacity-60 backdrop-blur-sm",
        }}
        // ensure the drawer panel itself stacks above that
        className="fixed top-0 right-0 h-full z-[9999] p-5 pt-28"
        size={1000}
        dismiss={{ outsidePress: true, escapeKey: true }}
        overlay
      >
        <div className="overflow-y-auto h-full pr-2">
          <div className="mb-6 flex items-center justify-between">
            <Typography variant="h5" color="blue" className="customfontstitle">
              {hotel.name}
            </Typography>
            <IconButton variant="text" color="red" onClick={closeDrawer}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
          </div>

          {/* About */}
          <Typography
            color="black"
            className="mb-4 pr-4 leading-relaxed customfontstitle"
          >
            {hotel.about || "No description available."}
          </Typography>

          {/* Facilities */}
          {hotel.facilities?.length > 0 && (
            <section className="mb-4">
              <Typography
                variant="h6"
                className="mb-1 text-black customfontstitle"
              >
                Facilities:
              </Typography>
              <ul className="list-disc pl-6 text-gray-900 text-sm space-y-1">
                {hotel.facilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Location */}
          {hotel.location && (
            <section className="mb-4">
              <Typography
                variant="h6"
                className="mb-1 text-black customfontstitle"
              >
                Location:
              </Typography>
              <Typography className="text-sm text-gray-900 customfontstitle">
                {hotel.location}
              </Typography>
            </section>
          )}

          {/* Booking Link */}
          {hotel.externalBookingLink && (
            <section className="mb-4">
              <Typography
                variant="h6"
                className="mb-1 text-black customfontstitle"
              >
                External Links:
              </Typography>
              <a
                href={hotel.externalBookingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-sm hover:underline"
              >
                Visit Hotel Website
              </a>
            </section>
          )}

          {/* Images */}
          {(hotel.images?.length > 0 ||
            hotel.tripAdvisorPhotos?.length > 0) && (
            <section className="mb-4">
              <Typography
                variant="h6"
                className="mb-2 text-black customfontstitle"
              >
                Images:
              </Typography>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ...(hotel.images || []),
                  ...(hotel.tripAdvisorPhotos || []),
                ].map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Hotel Image ${idx + 1}`}
                    className="rounded-lg w-full object-cover h-40"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Room Types */}
          {hotel.rooms?.length > 0 && (
            <section className="mb-4">
              <Typography
                variant="h6"
                className="mb-1 text-black customfontstitle"
              >
                Room Options:
              </Typography>
              <ul className="pl-6 list-disc text-sm text-gray-900 space-y-1">
                {hotel.rooms.map((room, idx) => (
                  <li key={idx}>
                    {room.numberofrooms} rooms for {room.guestCapacity} guest(s)
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Latest Reviews */}
          {hotel.tripAdvisorLatestReviews?.length > 0 && (
            <section className="mb-4">
              <Typography
                variant="h6"
                className="mb-2 text-black customfontstitle"
              >
                Latest Reviews:
              </Typography>
              <ul className="space-y-3">
                {hotel.tripAdvisorLatestReviews.map((rev, i) => (
                  <li
                    key={i}
                    className="bg-gray-100 p-3 rounded-lg shadow-sm text-sm text-gray-700"
                  >
                    <p className="italic mb-1">"{rev.review}"</p>
                    <p className="text-amber-700 font-medium">
                      Rating: {rev.rating}/5
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* TripAdvisor Link */}
          {hotel.tripAdvisorLink && (
            <section className="mb-4">
              <Typography
                variant="h6"
                className="mb-1 text-black customfontstitle"
              >
                TripAdvisor:
              </Typography>
              <a
                href={hotel.tripAdvisorLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-sm hover:underline customfontstitle"
              >
                View on TripAdvisor
              </a>
            </section>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default AccommodationCard;
