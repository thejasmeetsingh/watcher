import { useState } from "react";
import { useParams } from "react-router-dom";

import { useContentContext } from "../context/content";
import { getMoviesByGenreAPI } from "../api/content";
import { useAuthContext } from "../context/auth";
import GenreBanner from "../components/GenreBanner";
import List from "../components/List";
import Loader from "../components/Loader";
import GlobalError from "../components/GlobalError";

export default function GenrePage() {
  const { id } = useParams();
  const { genres } = useContentContext();
  const { authToken, globalError, setGlobalError } = useAuthContext();

  const [movies, setMovies] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchMoviesByGenre = async () => {
    setLoading(true);

    const response = await getMoviesByGenreAPI(authToken, id, page);

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

  if (!genres.length) {
    return (
      <div>
        <Loader size={100} />
      </div>
    );
  }

  const genre = genres.find((obj) => obj.id === parseInt(id));

  return (
    <div>
      {globalError && (
        <GlobalError message={globalError} onClose={() => setGlobalError("")} />
      )}
      <GenreBanner genre={genre.name} />
      <List
        movies={movies}
        apiFunction={fetchMoviesByGenre}
        loading={loading}
        hasMore={hasMore}
      />
    </div>
  );
}
