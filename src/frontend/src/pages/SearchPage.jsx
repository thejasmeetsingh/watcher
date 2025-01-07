import { useState, useEffect } from "react";

import { searchMovieAPI } from "../api/content";
import { useContentContext } from "../context/content";
import { useAuthContext } from "../context/auth";

import List from "../components/List";
import GlobalError from "../components/GlobalError";

export default function SearchPage() {
  const { searchValue } = useContentContext();
  const { authToken, globalError, setGlobalError } = useAuthContext();

  const [movies, setMovies] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const resetData = () => {
    setLoading(true);
    setMovies([]);
    setPage(1);
  };

  useEffect(() => {
    // Reset the data whenever autToken or the search query is updated,
    // So the updated data can shown.
    resetData();

    if (!searchValue) {
      return;
    }

    const timeoutID = setTimeout(() => {
      fetchSearchedMovies();
    }, 1000);

    return () => clearTimeout(timeoutID);
  }, [authToken, searchValue]);

  // Call the search API and fetch the movies based on the search query
  const fetchSearchedMovies = async () => {
    setLoading(true);

    const response = await searchMovieAPI(authToken, searchValue, page);

    if (response.errors) {
      setGlobalError(response.errors.default);
    } else {
      if (response.results) {
        const hasMore = response.page < response.total_pages;

        setHasMore(hasMore);
        setPage((prev) => (hasMore ? prev + 1 : prev));
        setMovies((prev) => [...prev, ...response.results]);
      }
    }

    setLoading(false);
  };

  return (
    <div>
      {globalError && (
        <GlobalError message={globalError} onClose={() => setGlobalError("")} />
      )}
      <List
        movies={movies}
        apiFunction={fetchSearchedMovies}
        loading={loading}
        hasMore={hasMore}
      />
    </div>
  );
}
