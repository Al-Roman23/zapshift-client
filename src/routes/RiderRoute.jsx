// Rider Route Component For Rider Users Only
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";
import { Navigate, useLocation } from "react-router";

const RiderRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, isRoleLoading } = useUserRole();
  const location = useLocation();

  // Show Loading Spinner While Checking Auth And Role
  if (loading || isRoleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Redirect To Dashboard If Not Rider
  if (!user || role !== "rider") {
    return (
      <Navigate to="/dashboard" state={location.pathname} replace />
    );
  }

  return children;
};

export default RiderRoute;
