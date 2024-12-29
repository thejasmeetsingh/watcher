import { Link } from "react-router-dom";
import { Film } from "lucide-react";

export default function GenreCard({ item }) {
  return (
    <Link key={item.id} to={`/genre/${item.id}`}>
      <div className="relative flex-shrink-0 group cursor-pointer">
        <div className="w-56 h-32 overflow-hidden rounded-xl relative bg-gradient-to-br from-slate-500 to-slate-100">
          <div className="absolute inset-0 p-4 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-white group-hover:text-yellow-300 transition-colors">
                {item.name}
              </h3>
              <Film className="w-6 h-6 text-white group-hover:text-yellow-300 transition-colors" />
            </div>
          </div>
          <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-yellow-300 transition-colors duration-300" />
        </div>
      </div>
    </Link>
  );
}
