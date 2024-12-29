import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useContentContext } from "../context/content";
import { getMoviesByGenreAPI } from "../api/content";
import GenreBanner from "../components/GenreBanner";
import List from "../components/List";
import Loader from "../components/Loader";

export default function GenrePage() {
  const { id } = useParams();
  const { genres, initGenres } = useContentContext();

  useEffect(() => {
    initGenres();
  }, []);

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
      <GenreBanner genre={genre.name} />
      <List param={id} apiFunction={getMoviesByGenreAPI} />
    </div>
  );
}
