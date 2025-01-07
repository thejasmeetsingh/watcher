import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { useAuthContext } from "./context/auth";
import { useContentContext } from "./context/content";

import Navbar from "./components/navbar";
import HomePage from "./pages/HomePage";
import MovieDetail from "./pages/MovieDetailPage";
import GenrePage from "./pages/GenrePage";
import SearchPage from "./pages/SearchPage";
import AuthPage from "./pages/AuthPage";
import LogoutModal from "./components/LogoutModal";
import WatchlistPage from "./pages/WatchlistPage";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const {
    isAuthenticated,
    checkUserAuth,
    isLogoutModalOpen,
    setIsLogoutModalOpen,
    handleLogout,
  } = useAuthContext();
  const { initGenres } = useContentContext();

  useEffect(() => {
    // Fetch and initialize genres list
    initGenres();
  }, []);

  useEffect(() => {
    // Check if user is logged in or not
    checkUserAuth();
  }, [isAuthenticated]);

  // Common function to return a common layout component,
  // Which will be used in all pages.
  const commonLayout = (Comp) => {
    return (
      <div>
        <Navbar />
        <Comp />
        <LogoutModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onLogout={handleLogout}
        />
      </div>
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={commonLayout(HomePage)} />
        <Route path="/content/:id" element={commonLayout(MovieDetail)} />
        <Route path="/genre/:id" element={commonLayout(GenrePage)} />
        <Route path="/search" element={commonLayout(SearchPage)} />
        <Route
          path="/join"
          element={<PublicOnlyRoute>{commonLayout(AuthPage)}</PublicOnlyRoute>}
        />
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>{commonLayout(WatchlistPage)}</ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
