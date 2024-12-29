import { useEffect } from "react";

import { useContentContext } from "../context/content";
import Slideshow from "../components/Slideshow";
import CardRow from "../components/CardRow";
import MovieCard from "../components/MovieCard";
import GenreCard from "../components/GenreCard";
import Loader from "../components/Loader";

export default function HomePage() {
  const { genres, featuredMovies, initGenres, initFeaturedMovies } =
    useContentContext();

  useEffect(() => {
    initGenres();
    initFeaturedMovies();
  }, []);

  if (!genres.length || !featuredMovies) {
    return (
      <div>
        <Loader size={100} />
      </div>
    );
  }

  return (
    <div>
      <div className="pb-6">
        <Slideshow items={featuredMovies.nowPlaying} />
      </div>
      <CardRow
        title="What's Popular"
        items={featuredMovies.popular}
        Card={MovieCard}
      />
      <CardRow title="Genres" items={genres} Card={GenreCard} />
      <CardRow
        title="Top Rated"
        items={featuredMovies.topRated}
        Card={MovieCard}
      />
      <CardRow
        title="Upcoming"
        items={featuredMovies.upcoming}
        Card={MovieCard}
      />
    </div>
  );
}
