import { useState, useEffect } from "react";
import { Check, Film, Clock } from "lucide-react";

import {
  fetchWatchlistAPI,
  removeItemAPI,
  updateItemAPI,
} from "../api/watchlist";
import { useAuthContext } from "../context/auth";
import GlobalError from "../components/GlobalError";
import Watchlist from "../components/Watchlist";

export default function WatchlistPage() {
  const { authToken, globalError, setGlobalError } = useAuthContext();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filters = { all: null, completed: true, pending: false };

  const resetData = () => {
    setLoading(true);
    setMovies([]);
    setPage(1);
  };

  useEffect(() => {
    resetData();

    const timeoutID = setTimeout(() => {
      fetchWatchlist();
    }, 1000);

    return () => clearTimeout(timeoutID);
  }, [selectedFilter]);

  const fetchWatchlist = async () => {
    setLoading(true);

    const response = await fetchWatchlistAPI(
      authToken,
      page,
      filters[selectedFilter]
    );

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

  const removeItemFromCurrSet = (itemID) => {
    setMovies(movies.filter((movie) => movie.watchlist.id !== itemID));
  };

  // Handle marking movie as completed/uncompleted
  const toggleComplete = async (itemID, isComplete) => {
    const response = await updateItemAPI(authToken, itemID, isComplete);

    if (response.errors) {
      setGlobalError(response.errors.default);
    } else {
      if (selectedFilter !== "all") {
        removeItemFromCurrSet(itemID);
      }
    }
  };

  // Handle removing movie from watchlist
  const removeFromWatchlist = async (itemID) => {
    const response = await removeItemAPI(authToken, itemID);

    if (response.errors) {
      setGlobalError(response.errors.default);
    } else {
      removeItemFromCurrSet(itemID);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      {globalError && (
        <GlobalError message={globalError} onClose={() => setGlobalError("")} />
      )}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 tracking-tight">
          Your Watchlist
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex gap-2">
            {Object.keys(filters).map((key) => {
              return (
                <button
                  key={key}
                  onClick={() => setSelectedFilter(key)}
                  className={`px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                    selectedFilter === key
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/30"
                      : "bg-gray-800/50 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {key === "all" && <Film className="inline mr-2" size={18} />}
                  {key === "completed" && (
                    <Check className="inline mr-2" size={18} />
                  )}
                  {key === "pending" && (
                    <Clock className="inline mr-2" size={18} />
                  )}
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        <Watchlist
          movies={movies}
          apiFunction={fetchWatchlist}
          loading={loading}
          hasMore={hasMore}
          toggleComplete={toggleComplete}
          removeFromWatchlist={removeFromWatchlist}
        />

        {!loading && movies.length === 0 && (
          <div className="text-center py-16 bg-gray-800/50 backdrop-blur-sm rounded-xl">
            <Film
              size={48}
              className="mx-auto text-gray-600 mb-4 animate-pulse"
            />
            <p className="text-gray-400 text-lg">
              {selectedFilter === "all"
                ? "Your watchlist is empty"
                : selectedFilter === "completed"
                ? "You have no movies marked as completed"
                : "You have no pending movies to watch"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
