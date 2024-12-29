import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImageURL } from "../utils";

export default function Slideshow({ items }) {
  const [currSlide, setCurrSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState("next"); // Track animation direction

  // Auto-advance slides with smooth transitions
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setDirection("next");
        setCurrSlide((prev) => (prev + 1) % items.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, items.length]);

  const goToSlide = (idx) => {
    setDirection(idx > currSlide ? "next" : "prev");
    setCurrSlide(idx);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setDirection("next");
    setCurrSlide((prev) => (prev + 1) % items.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setDirection("prev");
    setCurrSlide((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      <div className="relative w-full h-full">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`absolute w-full h-full transform transition-all duration-400 ease-in-out
              ${
                index === currSlide
                  ? "opacity-100 translate-x-0 scale-100"
                  : direction === "next"
                  ? "opacity-0 translate-x-full scale-95"
                  : "opacity-0 -translate-x-full scale-95"
              }
              ${
                index === (currSlide + 1) % items.length && direction === "next"
                  ? "z-10"
                  : index === (currSlide - 1 + items.length) % items.length &&
                    direction === "prev"
                  ? "z-10"
                  : "z-0"
              }`}
          >
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={getImageURL(item.backdrop_path)}
                alt={item.title}
                className={`w-full h-full object-cover transform scale-105 transition-transform duration-10000 
                  ${index === currSlide ? "scale-110" : "scale-105"}`}
              />
            </div>

            <div
              className={`absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-black/80 to-transparent
              transform transition-all duration-300 delay-100 ease-out
              ${
                index === currSlide
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <h1
                className={`text-white text-5xl font-bold mb-4 transform transition-all duration-400 delay-200
                ${
                  index === currSlide
                    ? "translate-x-0 opacity-100"
                    : direction === "next"
                    ? "translate-x-8 opacity-0"
                    : "-translate-x-8 opacity-0"
                }`}
              >
                {item.title}
              </h1>
              <p
                className={`text-gray-200 text-xl transform transition-all duration-400 delay-300
                ${
                  index === currSlide
                    ? "translate-x-0 opacity-100"
                    : direction === "next"
                    ? "translate-x-8 opacity-0"
                    : "-translate-x-8 opacity-0"
                }`}
              >
                {item.overview}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full
          bg-black/30 hover:bg-black/50 transition-all duration-400 hover:scale-110
          opacity-75 hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full
          bg-black/30 hover:bg-black/50 transition-all duration-400 hover:scale-110
          opacity-75 hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-400 ease-out transform
              ${
                index === currSlide
                  ? "w-8 bg-yellow-400 scale-100"
                  : "w-2 bg-white/50 hover:bg-white/75 scale-90 hover:scale-100"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
