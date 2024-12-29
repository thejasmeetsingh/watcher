import { createContext, useContext, useState } from "react";

import { fetchFeaturedMoviesAPI, fetchGenresAPI } from "../api/content";

const ContentContext = createContext();

export default function ContentProvider({ children }) {
  const [genres, setGenres] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const initGenres = async () => {
    const results = await fetchGenresAPI();
    setGenres(results);
  };

  const initFeaturedMovies = async () => {
    const results = await fetchFeaturedMoviesAPI();

    setFeaturedMovies(results);
  };

  const closeSearchBar = () => {
    setSearchValue("");
    setIsSearchOpen(false);
  };

  return (
    <ContentContext.Provider
      value={{
        genres,
        featuredMovies,
        searchValue,
        isSearchOpen,
        initGenres,
        initFeaturedMovies,
        setSearchValue,
        setIsSearchOpen,
        closeSearchBar,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContentContext() {
  return useContext(ContentContext);
}
