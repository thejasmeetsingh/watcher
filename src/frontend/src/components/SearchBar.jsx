import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";

import { useContentContext } from "../context/content";

export default function SearchBar() {
  const { searchValue, setSearchValue, isSearchOpen, setIsSearchOpen } =
    useContentContext();

  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Handle clicks outside the search container
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        !searchValue // Only close if search input is empty
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchValue]);

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const value = searchValue.trim();

    if (value) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    }
  };

  return (
    <div className="relative flex items-center" ref={containerRef}>
      {isSearchOpen ? (
        <button
          onClick={() => {
            if (!searchValue) {
              setIsSearchOpen(false);
            }
            setSearchValue("");
          }}
          className="text-gray-300 hover:text-yellow-400 transition-colors absolute right-2 z-10"
          aria-label="Clear search"
        >
          <X size={20} />
        </button>
      ) : (
        <button
          onClick={() => setIsSearchOpen(true)}
          className="text-gray-300 hover:text-yellow-400 transition-colors"
          aria-label="Open search"
        >
          <Search size={20} />
        </button>
      )}

      <form
        onSubmit={handleSearchSubmit}
        className={`absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-300 ${
          isSearchOpen
            ? "w-80 opacity-100"
            : "w-0 opacity-0 pointer-events-none"
        }`}
      >
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search movies, TV shows..."
          className="w-full bg-gray-800 text-gray-100 rounded-full py-2 pl-4 pr-10 
                  focus:outline-none ring-2 ring-yellow-400 
                  placeholder:text-gray-400"
          autoFocus={isSearchOpen}
        />
      </form>
    </div>
  );
}
