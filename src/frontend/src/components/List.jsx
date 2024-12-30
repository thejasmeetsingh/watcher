import { useRef, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

import MovieCard from "./MovieCard";

export default function List({ param, apiFunction }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [prevParam, setPrevParam] = useState("");

  const loader = useRef(null);

  const fetchData = async () => {
    if ((!page && !totalPages) || page < totalPages) {
      setLoading(true);

      const response = await apiFunction(param, page);

      // update current page and total pages
      setTotalPages(response.total_pages);
      setPage(response.page + 1);

      setMovies((prev) => [...prev, ...response.results]);
      setPrevParam(param);

      setLoading(false);
    }
  };

  // if params is changed then remove the current items.
  // And re-initialize the required state variables.
  const removeCurrItems = () => {
    setLoading(true);
    setMovies([]);
    setPage(null);
    setTotalPages(null);
  };

  useEffect(() => {
    if (param !== prevParam) {
      removeCurrItems();
    }

    const timeoutID = setTimeout(() => {
      fetchData();
    }, 1000);

    return () => clearTimeout(timeoutID);
  }, [param]);

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
