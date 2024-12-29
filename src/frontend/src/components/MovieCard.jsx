import { Link, useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";

import { useContentContext } from "../context/content";
import { getImageURL, formatDate } from "../utils";

export default function MovieCard({ item }) {
  const navigate = useNavigate();
  const { genres, closeSearchBar } = useContentContext();

  const itemGenres = genres
    .filter((genre) => item.genre_ids.includes(genre.id))
    .map((genre) => genre.name)
    .sort((a, b) => a.length - b.length);

  return (
    <Link
      key={item.id}
      onClick={(e) => {
        e.preventDefault();
        closeSearchBar();
        navigate(`/content/${item.id}`);
      }}
    >
      <div className="backdrop-blur-3xl">
        <div className="relative flex-shrink-0 group cursor-pointer">
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
                  <Calendar className="w-4 h-4 ml-2 drop-shadow" />
                  <span className="text-shadow-sm">
                    {formatDate(item.release_date)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {itemGenres.map((genre, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-blue-500/50 text-gray-100 rounded-full backdrop-blur-sm border border-gray-500/20"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
