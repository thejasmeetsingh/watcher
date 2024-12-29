import { useState, useEffect } from "react";

import { getImageURL } from "../utils";

export default function GalleryCarousel({ images }) {
  const [isHovering, setIsHovering] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Autoplay carousel
  useEffect(() => {
    let interval;
    if (!isHovering && images.length > 0) {
      interval = setInterval(() => {
        setActiveSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }, 5000); // Change slide every 5 seconds
    }
    return () => clearInterval(interval);
  }, [isHovering, images.length]);

  return (
    <section
      className="relative h-[400px] rounded-xl overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === activeSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={getImageURL(image.file_path)}
              alt={`Scene ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === activeSlide
                ? "w-8 bg-yellow-400 scale-100"
                : "w-2 bg-white/50 hover:bg-white/75 scale-90 hover:scale-100"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
