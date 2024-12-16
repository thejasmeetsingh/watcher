import Profile from "./Profile";
import Search from "./Search";

export default function () {
  return (
    <div className="px-6 py-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <a
            href="/"
            className="text-2xl font-semibold text-yellow-400"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            Watcher
          </a>
        </div>
        <div className="flex items-center space-x-6">
          <Search />
          <Profile />
        </div>
      </div>
    </div>
  );
}
