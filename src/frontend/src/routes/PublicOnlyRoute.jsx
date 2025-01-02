import { Navigate, useLocation } from "react-router-dom";

import { useAuthContext } from "../context/auth";

export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();

  if (isAuthenticated) {
    const destination = location.state?.from?.pathname || "/";
    return <Navigate to={destination} replace />;
  }

  return children;
}
