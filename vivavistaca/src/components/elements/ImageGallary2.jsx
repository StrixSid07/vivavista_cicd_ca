import React, { useState } from "react";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { FaCamera, FaVideo } from "react-icons/fa";

const ImageGallery2 = ({ images }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const collageImages = images.slice(0, 5);

  return (
    <div className="w-full mx-auto pt-4 md:px-20 px-2 relative">
      <div
        className="
          grid
          grid-cols-2
          md:grid-cols-4
          md:grid-rows-2
          gap-2
          rounded-xl
          overflow-hidden
        "
      >
        {/* Large image */}
        <div
          className="
            col-span-2
            md:col-span-2
            md:row-span-2
            relative
            cursor-pointer
            rounded-xl
            overflow-hidden
          "
          onClick={handleOpen}
        >
          <motion.img
            src={collageImages[0]}
            alt="Main Travel"
            className="w-full h-[450px] object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Smaller images */}
        {collageImages.slice(1).map((src, index) => (
          <div
            key={index}
            className="cursor-pointer rounded-xl overflow-hidden"
            onClick={handleOpen}
          >
            <motion.img
              src={src}
              alt={`Travel ${index + 2}`}
              className="w-full object-cover md:h-[220px] h-[120px]"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        ))}

        {/* Overlay icons (bottom right image only) */}
        {collageImages.length >= 5 && (
          <div
            className="
              absolute md:bottom-4 bottom-2 md:right-24 right-2 z-10 flex items-center gap-3
              bg-black/40 p-2 rounded-full backdrop-blur-sm
            "
          >
            <button
              onClick={handleOpen}
              className="text-white text-lg transition duration-500 ease-in-out hover:text-blue-500"
            >
              <FaCamera />
            </button>
            <button className="text-white text-lg">
              <FaVideo />
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {open && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={images.map((src) => ({ src }))}
          render={{
            footer: ({ currentIndex, slidesCount }) => (
              <div className="absolute bottom-0 right-0 p-4 text-white text-lg">
                {currentIndex + 1} / {slidesCount}
              </div>
            ),
          }}
        />
      )}
    </div>
  );
};

export default ImageGallery2;
