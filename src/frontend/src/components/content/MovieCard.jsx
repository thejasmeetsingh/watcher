import { Calendar } from "lucide-react";

export default function ({ item }) {
  const genres = [
    {
      id: 28,
      name: "Action",
    },
    {
      id: 12,
      name: "Adventure",
    },
    {
      id: 16,
      name: "Animation",
    },
    {
      id: 35,
      name: "Comedy",
    },
    {
      id: 80,
      name: "Crime",
    },
    {
      id: 99,
      name: "Documentary",
    },
    {
      id: 18,
      name: "Drama",
    },
    {
      id: 10751,
      name: "Family",
    },
    {
      id: 14,
      name: "Fantasy",
    },
    {
      id: 36,
      name: "History",
    },
    {
      id: 27,
      name: "Horror",
    },
    {
      id: 10402,
      name: "Music",
    },
    {
      id: 9648,
      name: "Mystery",
    },
    {
      id: 10749,
      name: "Romance",
    },
    {
      id: 878,
      name: "Science Fiction",
    },
    {
      id: 10770,
      name: "TV Movie",
    },
    {
      id: 53,
      name: "Thriller",
    },
    {
      id: 10752,
      name: "War",
    },
    {
      id: 37,
      name: "Western",
    },
  ];

  const itemGenres = genres
    .filter((genre) => item.genre_ids.includes(genre.id))
    .map((genre) => genre.name)
    .sort((a, b) => a.length - b.length);

  return (
    <div className="relative flex-shrink-0 group cursor-pointer">
      <div className="w-48 h-72 overflow-hidden rounded-lg relative">
        <img
          src={`https://image.tmdb.org/t/p/original${item.poster_path}`}
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
                {new Date(item.release_date).toLocaleDateString("en-US")}
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
  );
}
