import { Link, useNavigate } from "react-router-dom";

import { useContentContext } from "../context/content";
import ProfileDropdown from "./ProfileDropdown";
import Search from "./SearchBar";

export default function Navbar() {
  const navigate = useNavigate();
  const { closeSearchBar } = useContentContext();

  return (
    <div className="px-6 relative z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link
            className="text-2xl font-semibold text-yellow-400"
            onClick={(e) => {
              e.preventDefault();
              closeSearchBar();
              navigate("/");
            }}
          >
            <img
              className="w-24 object-cover"
              src="/images/logo.png"
              alt="Logo"
            />
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <Search />
          <ProfileDropdown />
        </div>
      </div>
    </div>
  );
}
