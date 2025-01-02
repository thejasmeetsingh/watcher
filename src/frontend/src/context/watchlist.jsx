import { createContext, useContext, useState } from "react";

import { fetchFeaturedMoviesAPI, fetchGenresAPI } from "../api/content";

const WatchlistContext = createContext();

export default function WatchlistProvider({ children }) {
  const addItem = (movieID) => {};
  const updateItem = (itemID, isComplete) => {};
  const removeItem = (itemID) => {};

  return (
    <WatchlistContext.Provider value={{}}>{children}</WatchlistContext.Provider>
  );
}

export function useWatchlistContext() {
  return useContext(WatchlistContext);
}
