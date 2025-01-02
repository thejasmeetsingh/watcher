import { Link, useNavigate } from "react-router-dom";
import { Calendar, Check, X } from "lucide-react";

import { useContentContext } from "../context/content";
import { getImageURL, formatDate } from "../utils";
import { useEffect, useState } from "react";

export default function MovieCard({
  item,
  toggleWatchlistComplete,
  removeFromWatchlist,
}) {
  const navigate = useNavigate();
  const { genres, closeSearchBar, initGenres } = useContentContext();

  const [isCompleted, setIsCompleted] = useState(
    item.watchlist ? item.watchlist.is_complete : false
  );

  useEffect(() => {
    initGenres();
  }, []);

  // Find and retrieve genre names based on the genre IDs given in the item.
  const itemGenres = genres
    .filter((genre) => item.genre_ids.includes(genre.id))
    .map((genre) => genre.name)
    .sort((a, b) => a.length - b.length);

  const content = (
    <div className="backdrop-blur-3xl">
      <div
        className={`relative flex-shrink-0 group ${
          !item.watchlist ? "cursor-pointer" : ""
        }`}
      >
        <div className="w-48 h-72 overflow-hidden rounded-lg relative">
          <img
            src={getImageURL(item.poster_path)}
            alt={item.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/90 opacity-0 group-hover:opacity-100 transition-all duration-300" />

          <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <div className="transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-white font-bold mb-1 text-shadow-sm">
                {item.title}
              </h3>
            </div>

            <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <div className="flex items-center space-x-2 text-sm text-gray-200 mb-2">
                <Calendar className="w-4 h-4 ml-1 drop-shadow" />
                <span className="text-shadow-sm">
                  {formatDate(item.release_date)}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {itemGenres.map((genre, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 bg-blue-500/50 text-gray-100 rounded-full backdrop-blur-sm border border-gray-500/20"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              {item.watchlist && (
                <div className="flex items-center space-x-2 text-sm text-gray-200">
                  <button
                    onClick={() => {
                      setIsCompleted(!isCompleted);
                      toggleWatchlistComplete(item.watchlist.id, !isCompleted);
                    }}
                    className={`p-2 rounded-full ${
                      isCompleted
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-600 hover:bg-gray-700"
                    } transition-colors duration-200 shadow-lg`}
                    title={false ? "Mark as unwatched" : "Mark as watched"}
                  >
                    <Check size={16} className="text-white" />
                  </button>
                  <button
                    onClick={() => removeFromWatchlist(item.watchlist.id)}
                    className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors duration-200 shadow-lg"
                    title="Remove from watchlist"
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              )}
            </div>
          </div>
          {item.watchlist && isCompleted && (
            <div className="absolute bottom-8 left-32 bg-gradient-to-r from-yellow-500 to-green-500 text-white px-8 py-1 transform -rotate-45 -translate-x-8 translate-y-4">
              Watched
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return item.watchlist ? (
    content
  ) : (
    <Link
      key={item.id}
      onClick={(e) => {
        e.preventDefault();
        closeSearchBar();
        navigate(`/content/${item.id}`);
      }}
    >
      {content}
    </Link>
  );
}
