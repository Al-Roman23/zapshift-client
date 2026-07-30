// Dashboard Layout
import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Package,
  Truck,
  CreditCard,
  Users,
  UserPlus,
  UserCheck,
  XCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
  DollarSign,
  Activity,
  CheckCircle,
  Bell,
  Search,
  User,
  Moon,
  Sun,
} from "lucide-react";
import useUserRole from "../hooks/useUserRole";
import useAuth from "../hooks/useAuth";
import { useTheme } from "../contexts/ThemeContext";
import PageTitle from "../components/Shared/PageTitle";

const DashboardLayout = () => {
  const { role, isRoleLoading } = useUserRole();
  const { user, logOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation Items Based On Role
  const getNavItems = () => {
    // Items available to ALL roles
    const commonItems = [
      { path: "/dashboard", icon: Home, label: "Dashboard", exact: true },
      { path: "/dashboard/profile", icon: User, label: "My Profile" },
    ];

    // Items ONLY for regular users (senders)
    const userItems = [
      { path: "/dashboard/my-parcels", icon: Package, label: "My Parcels" },
      { path: "/dashboard/payment-history", icon: CreditCard, label: "Payment History" },
    ];

    // Items ONLY for riders
    const riderItems = [
      { path: "/dashboard/my-deliveries", icon: Truck, label: "My Deliveries" },
      { path: "/dashboard/my-completed-deliveries", icon: CheckCircle, label: "Completed Deliveries" },
      { path: "/dashboard/my-earnings", icon: DollarSign, label: "My Earnings" },
      { path: "/dashboard/my-work-status", icon: Activity, label: "Work Status" },
    ];

    // Items ONLY for admins
    const adminItems = [
      { path: "/dashboard/all-parcels", icon: Package, label: "All Parcels" },
      { path: "/dashboard/assign-riders", icon: UserPlus, label: "Assign Riders" },
      { path: "/dashboard/unpaid-parcels", icon: CreditCard, label: "Unpaid Parcels" },
      { path: "/dashboard/rejected-parcels", icon: XCircle, label: "Rejected Parcels" },
      { path: "/dashboard/manage-users", icon: Users, label: "Manage Users" },
      { path: "/dashboard/approve-riders", icon: UserCheck, label: "Approve Riders" },
      { path: "/dashboard/approved-riders", icon: UserCheck, label: "Approved Riders" },
    ];

    if (role === "admin") return [...commonItems, ...adminItems];
    if (role === "rider") return [...commonItems, ...riderItems];
    return [...commonItems, ...userItems]; // Regular users
  };

  const navItems = getNavItems();

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Loading State
  if (isRoleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100">
        <PageTitle />
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Sidebar Link Component
  const SidebarLink = ({ item }) => {
    const isActive = item.exact 
      ? location.pathname === item.path 
      : location.pathname.startsWith(item.path);

    return (
      <NavLink
        to={item.path}
        onClick={() => setMobileMenuOpen(false)}
        className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative ${
          isActive
            ? "bg-primary text-primary-content shadow-md"
            : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
        }`}
      >
        <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "" : "group-hover:text-primary"}`} />
        <span className={`font-medium whitespace-nowrap transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 lg:hidden"
        }`}>
          {item.label}
        </span>
        {/* Tooltip For Collapsed State */}
        {!sidebarOpen && (
          <div className="absolute left-full ml-3 px-3 py-1.5 bg-base-200 text-base-content text-sm font-medium rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 hidden lg:block">
            {item.label}
          </div>
        )}
      </NavLink>
    );
  };

  return (
    <div className="min-h-screen bg-base-100 flex">
      <PageTitle />
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-base-200 border-r border-base-300 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-base-300">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-content" />
            </div>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-xl text-base-content"
              >
                ZaP ShifT
              </motion.span>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-base-300 transition-colors"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5 text-base-content/70" />
            ) : (
              <ChevronRight className="w-5 h-5 text-base-content/70" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {/* Main Navigation (Dashboard & Profile) */}
          <div className="space-y-1">
            {navItems.slice(0, 2).map((item) => (
              <SidebarLink key={item.path} item={item} />
            ))}
          </div>

          {/* Role-Specific Navigation */}
          {navItems.length > 2 && (
            <>
              <div className="my-4 border-t border-base-300"></div>
              <div className="space-y-1">
                {sidebarOpen && (
                  <p className="px-3 text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2">
                    {role === "admin" ? "Admin Tools" : role === "rider" ? "Rider Tools" : "My Items"}
                  </p>
                )}
                {navItems.slice(2).map((item) => (
                  <SidebarLink key={item.path} item={item} />
                ))}
              </div>
            </>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-base-300">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base-content/70 hover:bg-base-300 transition-colors"
          >
            <Home className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Back to Home</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-error hover:bg-error/10 transition-colors mt-1"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-72 bg-base-200 border-r border-base-300 z-50 lg:hidden flex flex-col"
            >
              {/* Mobile Header */}
              <div className="h-16 flex items-center justify-between px-4 border-b border-base-300">
                <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary-content" />
                  </div>
                  <span className="font-bold text-xl text-base-content">ZaP ShifT</span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-base-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                  <SidebarLink key={item.path} item={item} />
                ))}
              </nav>

              {/* Mobile Footer */}
              <div className="p-4 border-t border-base-300 space-y-2">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base-content/70 hover:bg-base-300 transition-colors"
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Back to Home</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-error hover:bg-error/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-base-200 border-b border-base-300 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-base-300 transition-colors lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
              <input
                type="text"
                placeholder="Search parcels, users..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-base-100 border border-base-300 focus:border-primary focus:outline-none text-base-content placeholder:text-base-content/40"
              />
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-base-300 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-base-content/70" />
              )}
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-xl hover:bg-base-300 transition-colors relative">
              <Bell className="w-5 h-5 text-base-content/70" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error"></span>
            </button>

            {/* User Menu */}
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-base-300 transition-colors">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-content" />
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-base-content line-clamp-1">
                    {user?.displayName || "User"}
                  </p>
                  <p className="text-xs text-base-content/60 capitalize">{role}</p>
                </div>
              </button>
              <ul tabIndex={0} className="dropdown-content menu bg-base-200 rounded-xl w-52 p-2 shadow-lg border border-base-300 mt-2">
                <li>
                  <Link to="/dashboard" className="rounded-lg">
                    <Home className="w-4 h-4" /> Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/my-parcels" className="rounded-lg">
                    <Package className="w-4 h-4" /> My Parcels
                  </Link>
                </li>
                <li>
                  <button onClick={toggleTheme} className="rounded-lg">
                    {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </button>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <button onClick={handleLogout} className="rounded-lg text-error">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
