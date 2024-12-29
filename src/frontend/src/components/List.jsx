import { useRef, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

import MovieCard from "./MovieCard";

export default function List({ param, apiFunction }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const loader = useRef(null);

  const fetchData = async () => {
    setLoading(true);

    const newItems = await apiFunction(param, page);
    setMovies((prev) => [...prev, ...newItems]);

    setLoading(false);
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && !loading) {
        fetchData();
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
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} item={movie} />
        ))}
      </div>
      <div ref={loader} className="flex justify-center py-4">
        {loading && <Loader2 className="animate-spin h-8 w-8 text-blue-500" />}
      </div>
    </div>
  );
}
