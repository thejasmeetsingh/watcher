import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Play,
  X,
  Star,
  Calendar,
  Clock,
  Globe,
  Heart,
  BookmarkPlus,
} from "lucide-react";

import { getMovieDetailAPI } from "../api/content";
import { useContentContext } from "../context/content";
import { getImageURL, formatDate } from "../utils";
import MovieRow from "../components/CardRow";
import MovieCard from "../components/MovieCard";
import GalleryCarousel from "../components/GalleryCarousel";
import MovieActionButton from "../components/ActionButton";
import Loader from "../components/Loader";

export default function MovieDetail() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const modalRef = useRef(null);

  const { initGenres } = useContentContext();

  // Fetch movie details
  useEffect(() => {
    const initMovie = async () => {
      const result = await getMovieDetailAPI(id);
      setMovie(result);
    };

    initGenres();
    initMovie();
  }, [id]);

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowTrailer(false);
      }
    };

    if (showTrailer) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTrailer]);

  if (!movie) {
    return (
      <div>
        <Loader size={100} />
      </div>
    );
  }

  // Get first trailer (usually the main one)
  const mainTrailer = movie.videos.results.find(
    (video) => video.site === "YouTube" && video.official
  );

  // Format runtime to hours and minutes
  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="relative h-[70vh] w-full">
        <div className="absolute inset-0">
          <img
            src={getImageURL(movie.backdrop_path)}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 py-8 flex items-end">
          <div className="flex gap-8">
            <img
              src={getImageURL(movie.poster_path)}
              alt={`${movie.title} poster`}
              className="w-64 rounded-lg shadow-xl"
            />

            <div className="space-y-4">
              <h1 className="text-4xl font-bold">{movie.title}</h1>
              {movie.tagline && (
                <p className="text-xl text-gray-300 italic">{movie.tagline}</p>
              )}

              <div className="flex items-center gap-6 text-gray-300">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(movie.release_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  <span>{movie.original_language.toUpperCase()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {mainTrailer && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition"
                >
                  <Play className="w-5 h-5" />
                  Watch Trailer
                </button>
              )}
              <div className="flex items-center gap-3">
                <MovieActionButton
                  icon={Heart}
                  label="Favorite"
                  onClick={() => setIsFavorite(!isFavorite)}
                  isActive={isFavorite}
                />
                <MovieActionButton
                  icon={BookmarkPlus}
                  label="Watchlist"
                  onClick={() => setIsInWatchlist(!isInWatchlist)}
                  isActive={isInWatchlist}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-3 gap-52">
          <div className="col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </section>

            {movie.images.backdrops.length > 0 && (
              <GalleryCarousel
                images={movie.images.backdrops
                  .sort((a, b) => a.vote_count - b.vote_count)
                  .slice(0, 20)}
              />
            )}
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-bold mb-4">Production Details</h3>
              <dl className="space-y-4 text-gray-300">
                <div>
                  <dt className="font-medium">Status</dt>
                  <dd>{movie.status}</dd>
                </div>
                <div>
                  <dt className="font-medium">Budget</dt>
                  <dd>${movie.budget.toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="font-medium">Revenue</dt>
                  <dd>${movie.revenue.toLocaleString()}</dd>
                </div>
              </dl>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4">Production Companies</h3>
              <div className="space-y-4">
                {movie.production_companies.map((company) => (
                  <div key={company.id} className="flex items-center gap-3">
                    {company.logo_path ? (
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2">
                        <img
                          src={getImageURL(company.logo_path)}
                          alt={company.name}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                        {company.name[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{company.name}</p>
                      <p className="text-sm text-gray-400">
                        {company.origin_country}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {movie.recommendations.results.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <MovieRow
            title="You May Also Like"
            items={movie.recommendations.results.slice(0, 10)}
            Card={MovieCard}
          />
        </div>
      )}

      {showTrailer && mainTrailer && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div
            className="relative w-full max-w-5xl aspect-video"
            ref={modalRef}
          >
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 p-2 hover:bg-gray-800 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
            <iframe
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${mainTrailer.key}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
