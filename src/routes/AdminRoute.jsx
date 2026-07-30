// Admin Route Component For Admin Users Only
import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";

const AdminRoute = ({ children }) => {
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

  // Redirect To Dashboard If Not Admin
  if (!user || role !== "admin") {
    return (
      <Navigate to="/dashboard" state={location.pathname} replace />
    );
  }

  return children;
};

export default AdminRoute;
