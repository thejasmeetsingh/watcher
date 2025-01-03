import { useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";

import MovieCard from "./MovieCard";

export default function Watchlist({
  movies,
  apiFunction,
  loading,
  hasMore,
  toggleComplete,
  removeFromWatchlist,
}) {
  const loader = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && !loading && hasMore) {
        apiFunction();
      }
    });

    const currentLoader = loader.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [loading]);

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            item={movie}
            toggleWatchlistComplete={toggleComplete}
            removeFromWatchlist={removeFromWatchlist}
          />
        ))}
      </div>
      <div ref={loader} className="flex justify-center py-4">
        {loading && <Loader2 className="animate-spin h-8 w-8 text-blue-500" />}
      </div>
    </div>
  );
}
