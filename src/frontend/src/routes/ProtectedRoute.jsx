import { Navigate, useLocation } from "react-router-dom";

import { useAuthContext } from "../context/auth";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/join" state={{ from: location }} replace />;
  }

  return children;
}
