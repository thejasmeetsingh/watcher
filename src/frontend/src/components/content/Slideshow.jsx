import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function () {
  const slides = [
    {
      backdrop_path: "/bHkn3yuOFdu5LJcq67Odofhx6cb.jpg",
      id: 845781,
      title: "Red One",
      original_title: "Red One",
      overview:
        "After Santa Claus (codename: Red One) is kidnapped, the North Pole's Head of Security must team up with the world's most infamous tracker in a globe-trotting, action-packed mission to save Christmas.",
      poster_path: "/cdqLnri3NEGcmfnqwk2TSIYtddg.jpg",
      media_type: "movie",
      adult: false,
      original_language: "en",
      genre_ids: [28, 14, 35],
      popularity: 3379.818,
      release_date: "2024-10-31",
      video: false,
      vote_average: 7.0,
      vote_count: 718,
    },
    {
      backdrop_path: "/3V4kLQg0kSqPLctI5ziYWabAZYF.jpg",
      id: 912649,
      title: "Venom: The Last Dance",
      original_title: "Venom: The Last Dance",
      overview:
        "Eddie and Venom are on the run. Hunted by both of their worlds and with the net closing in, the duo are forced into a devastating decision that will bring the curtains down on Venom and Eddie's last dance.",
      poster_path: "/aosm8NMQ3UyoBVpSxyimorCQykC.jpg",
      media_type: "movie",
      adult: false,
      original_language: "en",
      genre_ids: [28, 878, 12, 53],
      popularity: 9486.301,
      release_date: "2024-10-22",
      video: false,
      vote_average: 6.772,
      vote_count: 1561,
    },
    {
      backdrop_path: "/rhc8Mtuo3Kh8CndnlmTNMF8o9pU.jpg",
      id: 1005331,
      title: "Carry-On",
      original_title: "Carry-On",
      overview:
        "An airport security officer races to outsmart a mysterious traveler forcing him to let a dangerous item slip onto a Christmas Eve flight.",
      poster_path: "/sjMN7DRi4sGiledsmllEw5HJjPy.jpg",
      media_type: "movie",
      adult: false,
      original_language: "en",
      genre_ids: [28, 9648, 53],
      popularity: 242.953,
      release_date: "2024-12-05",
      video: false,
      vote_average: 7.025,
      vote_count: 302,
    },
    {
      backdrop_path: "/roPfmU0ORLGXljln06I2AjST9x3.jpg",
      id: 1061474,
      title: "Superman",
      original_title: "Superman",
      overview:
        "Superman, a cub reporter in Metropolis, embarks on a journey to reconcile his Kryptonian heritage with his human upbringing as Clark Kent.",
      poster_path: "/w0NrLQXID3oyC5oGafuZQtIlQgA.jpg",
      media_type: "movie",
      adult: false,
      original_language: "en",
      genre_ids: [28, 878],
      popularity: 43.978,
      release_date: "2025-07-09",
      video: false,
      vote_average: 0.0,
      vote_count: 0,
    },
    {
      backdrop_path: "/c6nouvFYnmNO50WQDLcKMI3p0jA.jpg",
      id: 762509,
      title: "Mufasa: The Lion King",
      original_title: "Mufasa: The Lion King",
      overview:
        "Rafiki relays the legend of Mufasa to lion cub Kiara, daughter of Simba and Nala, with Timon and Pumbaa lending their signature schtick. Told in flashbacks, the story introduces Mufasa as an orphaned cub, lost and alone until he meets a sympathetic lion named Taka—the heir to a royal bloodline. The chance meeting sets in motion a journey of misfits searching for their destiny and working together to evade a threatening and deadly foe.",
      poster_path: "/lurEK87kukWNaHd0zYnsi3yzJrs.jpg",
      media_type: "movie",
      adult: false,
      original_language: "en",
      genre_ids: [12, 10751, 18, 16],
      popularity: 867.518,
      release_date: "2024-12-18",
      video: false,
      vote_average: 7.4,
      vote_count: 5,
    },
  ];

  const [currSlide, setCurrSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState("next"); // Track animation direction

  // Auto-advance slides with smooth transitions
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setDirection("next");
        setCurrSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (idx) => {
    setDirection(idx > currSlide ? "next" : "prev");
    setCurrSlide(idx);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setDirection("next");
    setCurrSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setDirection("prev");
    setCurrSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute w-full h-full transform transition-all duration-400 ease-in-out
              ${
                index === currSlide
                  ? "opacity-100 translate-x-0 scale-100"
                  : direction === "next"
                  ? "opacity-0 translate-x-full scale-95"
                  : "opacity-0 -translate-x-full scale-95"
              }
              ${
                index === (currSlide + 1) % slides.length &&
                direction === "next"
                  ? "z-10"
                  : index === (currSlide - 1 + slides.length) % slides.length &&
                    direction === "prev"
                  ? "z-10"
                  : "z-0"
              }`}
          >
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={`https://image.tmdb.org/t/p/original${slide.backdrop_path}`}
                alt={slide.title}
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
                {slide.title}
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
                {slide.overview}
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
        {slides.map((_, index) => (
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
