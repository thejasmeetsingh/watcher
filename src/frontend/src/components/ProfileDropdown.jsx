import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Film, LogOut, UserPlus } from "lucide-react";

import { useAuthContext } from "../context/auth";

export default function ProfileDropdown() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  const { isAuthenticated, setIsLogoutModalOpen } = useAuthContext();

  // Handle clicks outside the profile container
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  return (
    <div className="relative" ref={profileDropdownRef}>
      <button
        className="w-8 h-8 rounded-full overflow-hidden bg-orange-500 flex items-center justify-center hover:ring-2 hover:ring-yellow-400 transition-all"
        onClick={() => setIsProfileOpen(!isProfileOpen)}
      >
        <img
          src="/images/profile.png"
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </button>

      <div
        className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 
              transition-all duration-200 ease-in-out transform origin-top-right
              ${
                isProfileOpen
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }`}
      >
        <div className="py-1">
          {isAuthenticated ? (
            <>
              <a
                href="/watchlist"
                className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-yellow-400"
              >
                <Film size={16} className="mr-2" />
                Watchlist
              </a>
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  setIsLogoutModalOpen(true);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-yellow-400"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link
                key="auth"
                to="/join"
                className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-yellow-400"
              >
                <UserPlus size={16} className="mr-2" />
                Join Watcher!
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
