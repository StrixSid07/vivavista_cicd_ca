import { Carousel } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { Button } from "@material-tailwind/react";
import bg1 from "../../assets/bg/homebg1.jpg";
import bg2 from "../../assets/bg/homebg2.jpg";
import bg3 from "../../assets/bg/homebg3.jpg";

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};


export function CarouselCustomNavigation({slides}) {
  return (
    <Carousel
      className="h-full w-full relative"
      transition={{ duration: 1 }}
      loop={true}
      autoplay={true}
      navigation={({ setActiveIndex, activeIndex, length }) => (
        <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
          {new Array(length).fill("").map((_, i) => (
            <span
              key={i}
              className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
              }`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}
    >
      {slides.map((slide, index) => (
        <div key={index} className="relative h-full w-full">
          <img
            src={slide.image}
            alt={`Slide ${index + 1}`}
            className="h-full w-full object-cover"
          />
          {/* <div className="absolute inset-0 flex flex-col items-start justify-center">
            <h2 className="text-white text-lg md:text-4xl md:ml-32 ml-16 md:max-w-5xl max-w-xl font-bold text-left">
              {slide.text}
            </h2>
            <div className="bg-white md:rounded-full rounded-md w-auto px-4 py-2 md:text-md text-sm font-medium md:font-semibold md:ml-32 ml-16 text-orange-600 mt-8">
              {slide.destination}
            </div>
            <motion.div
              className="relative mt-8 md:ml-32 ml-16"
              initial="hidden"
              animate="visible"
              variants={buttonVariants}
            >
              <Button className="bg-white text-orange-600 font-medium md:font-semibold md:px-6 md:py-3 px-4 py-2 rounded-md text-md md:text-lg transition-all duration-300 hover:bg-orange-600 hover:text-white hover:scale-105 shadow-md">
                Book Now
              </Button>
            </motion.div>
          </div> */}
        </div>
      ))}
    </Carousel>
  );
}
