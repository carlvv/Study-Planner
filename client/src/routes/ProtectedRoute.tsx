import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../context/useAuth";
import { Loading } from "../components/Loading";

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loading isLoading={loading} />; // oder Spinner

  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }

  return <Outlet />;
}
