import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../context/useAuth";

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // oder Spinner

  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }

  return <Outlet />;
}
