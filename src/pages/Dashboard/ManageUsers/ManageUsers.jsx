// Admin Manage Users Page
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Shield,
  ShieldCheck,
  ShieldX,
  UserCheck,
  UserX,
  Crown,
  Truck,
  User,
  Mail,
  MoreVertical,
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Fetch All Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosSecure.get("/users");
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (error) {
        console.error("Failed To Fetch Users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [axiosSecure]);

  // Filter Users
  useEffect(() => {
    let result = [...users];

    if (searchTerm) {
      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      result = result.filter((u) => u.role === roleFilter);
    }

    setFilteredUsers(result);
  }, [searchTerm, roleFilter, users]);

  // Toggle User Status
  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "disabled" : "active";
    const action = newStatus === "disabled" ? "Disable" : "Enable";

    const confirmResult = await Swal.fire({
      title: `${action} User?`,
      text: `Are you sure you want to ${action.toLowerCase()} this user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: newStatus === "disabled" ? "#ef4444" : "#22c55e",
      confirmButtonText: `Yes, ${action}`,
    });

    if (!confirmResult.isConfirmed) return;

    try {
      await axiosSecure.patch(`/users/${userId}/toggle-status`);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
      );
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `User is now ${newStatus}.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire("Error!", "Failed to update user status.", "error");
    }
  };

  // Change User Role
  const handleRoleChange = async (userId, newRole, userName) => {
    const confirmResult = await Swal.fire({
      title: "Change Role?",
      html: `Change <strong>${userName}</strong>'s role to <strong>${newRole}</strong>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#A3E635",
      confirmButtonText: "Yes, Change",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      await axiosSecure.patch(`/users/${userId}/role`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `User role changed to ${newRole}.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire("Error!", "Failed to change user role.", "error");
    }
  };

  // Role Config
  const roleConfig = {
    admin: { icon: Crown, color: "text-warning", bg: "bg-warning/20", label: "Admin" },
    rider: { icon: Truck, color: "text-info", bg: "bg-info/20", label: "Rider" },
    user: { icon: User, color: "text-primary", bg: "bg-primary/20", label: "User" },
  };

  const getRoleConfig = (role) => roleConfig[role] || roleConfig.user;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-base-content">Manage Users</h1>
          <p className="text-base-content/60 mt-1">
            View and manage all registered users!
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {[
          { label: "Total Users", count: users.length, icon: Users, color: "text-primary bg-primary/20" },
          { label: "Admins", count: users.filter(u => u.role === "admin").length, icon: Crown, color: "text-warning bg-warning/20" },
          { label: "Riders", count: users.filter(u => u.role === "rider").length, icon: Truck, color: "text-info bg-info/20" },
          { label: "Regular Users", count: users.filter(u => u.role === "user").length, icon: User, color: "text-success bg-success/20" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-base-200 rounded-xl p-4 border border-base-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/60 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-base-content">{stat.count}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-base-200 rounded-2xl p-4 border border-base-300"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-base-100 border border-base-300 focus:border-primary focus:outline-none text-base-content placeholder:text-base-content/40"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "admin", "rider", "user"].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`btn btn-sm ${roleFilter === role ? "btn-primary" : "btn-ghost"}`}
              >
                {role === "all" ? "All Roles" : getRoleConfig(role).label + "s"}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Users Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {filteredUsers.map((user, index) => {
          const roleInfo = getRoleConfig(user.role);
          const RoleIcon = roleInfo.icon;
          const isActive = user.status === "active" || !user.status;

          return (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`bg-base-200 rounded-2xl border ${
                isActive ? "border-base-300" : "border-error/30"
              } overflow-hidden hover:border-primary/30 transition-all duration-300`}
            >
              <div className="p-5">
                {/* User Header */}
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={user.photoURL || "/user.png"}
                      alt={user.name}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${roleInfo.bg} flex items-center justify-center`}>
                      <RoleIcon className={`w-3 h-3 ${roleInfo.color}`} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base-content truncate">{user.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-base-content/60">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`badge badge-sm ${roleInfo.bg} ${roleInfo.color} border-none`}>
                        {roleInfo.label}
                      </span>
                      <span className={`badge badge-sm ${isActive ? "badge-success" : "badge-error"}`}>
                        {isActive ? "Active" : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-base-300">
                  <select
                    className="select select-bordered select-sm flex-1 rounded-xl bg-base-100 text-sm"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value, user.name)}
                  >
                    <option value="user">User</option>
                    <option value="rider">Rider</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={() => handleToggleStatus(user._id, user.status || "active")}
                    className={`btn btn-sm ${isActive ? "btn-error btn-outline" : "btn-success"} gap-1`}
                  >
                    {isActive ? (
                      <>
                        <UserX className="w-4 h-4" />
                        Disable
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4" />
                        Enable
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-base-200 rounded-2xl border border-base-300"
        >
          <Users className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-base-content mb-2">No Users Found</h3>
          <p className="text-base-content/60">Try adjusting your search or filter criteria.</p>
        </motion.div>
      )}
    </div>
  );
};

export default ManageUsers;
