import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const checkUserAuth = () => {
    if (authToken) {
      setIsAuthenticated(true);
    } else {
      const token = localStorage.getItem("authToken");
      setAuthToken(token ? token : "");
      setIsAuthenticated(token !== null);
    }
  };

  const updateAuthToken = (token) => {
    setAuthToken(token);
    localStorage.setItem("authToken", token);

    checkUserAuth();
  };

  const handleLogout = () => {
    if (isAuthenticated) {
      localStorage.removeItem("authToken");
      setAuthToken("");
      setIsAuthenticated(false);
      setIsLogoutModalOpen(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authToken,
        isAuthenticated,
        globalError,
        isLogoutModalOpen,
        checkUserAuth,
        updateAuthToken,
        setGlobalError,
        setIsLogoutModalOpen,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
