// Navigation Bar With Auth And Navigation Links
import { useRef, useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../../../components/Logo/Logo";
import useAuth from "../../../hooks/useAuth";
import { useTheme } from "../../../contexts/ThemeContext";
import userIcon from "../../../assets/user.jpeg";
import { Sun, Moon, Menu, X } from "lucide-react";

const NavBar = () => {
  const { user, logOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // State For User Dropdown Menu
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle User Logout
  const handleLogOut = async () => {
    try {
      await logOut();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // Close Dropdown When Clicking Outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigation Links Configuration
  const links = useMemo(() => {
    const baseLinks = [
      { to: "/services", label: "Services" },
      { to: "/coverage", label: "Coverage" },
      { to: "/send-parcel", label: "Send Parcel" },
      { to: "/parcel-track", label: "Track Parcel" },
      { to: "/pricing", label: "Pricing" },
      { to: "/blog", label: "Blog" },
      { to: "/contact", label: "Contact" },
    ];
    if (user)
      baseLinks.push({ to: "/dashboard", label: "Dashboard" });
    return baseLinks;
  }, [user]);

  // Render Individual Navigation Link
  const renderLink = (link, onClick = null) => (
    <NavLink
      key={link.to}
      to={link.to}
      onClick={onClick}
      className={({ isActive }) =>
        `px-3 py-2 rounded-lg hover:text-primary hover:bg-base-200 transition-all duration-200 ${
          isActive
            ? "font-semibold text-primary bg-base-200"
            : "text-base-content"
        }`
      }
    >
      {link.label}
    </NavLink>
  );

  return (
    <nav className="navbar bg-base-100 shadow-lg rounded-2xl px-4 md:px-6 lg:px-8 border border-base-300">
      {/* Navbar Start */}
      <div className="navbar-start flex items-center gap-2">
        {/* Mobile Hamburger Menu */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="btn btn-ghost btn-circle"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
        <Logo />
      </div>

      {/* Navbar Center - Desktop Navigation */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          {links.map((link) => renderLink(link))}
        </ul>
      </div>

      {/* Navbar End - Theme Toggle, Auth Buttons */}
      <div className="navbar-end flex gap-2 md:gap-3 items-center">
        {/* Theme Toggle Button */}
        <motion.button
          onClick={toggleTheme}
          className="btn btn-ghost btn-circle"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-400" />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.button>

        {user ? (
          <div
            className="relative flex items-center gap-2 md:gap-4"
            ref={dropdownRef}
          >
            {/* User Avatar */}
            <motion.img
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-base-300 cursor-pointer"
              src={user.photoURL || userIcon}
              alt={user.displayName || user.email}
              aria-expanded={isDropdownOpen}
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            />

            {/* User Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-14 bg-base-100 shadow-xl border border-base-300 w-56 rounded-xl z-50 overflow-hidden"
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-base-300 text-sm text-left">
                    <NavLink
                      to="/dashboard/profile"
                      className="font-semibold truncate hover:underline hover:text-primary transition-colors duration-150"
                    >
                      {user.displayName || user.email}
                    </NavLink>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogOut}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-error hover:text-error-content transition-colors duration-150"
                  >
                    Log Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <NavLink to="/login" className="btn btn-outline btn-sm md:btn-md">
            Sign In
          </NavLink>
        )}

        {/* Become Rider Button */}
        <NavLink
          to="/rider"
          className="btn bg-primary hover:bg-primary/80 text-primary-content btn-sm md:btn-md hidden sm:inline-flex"
        >
          Be A Rider
        </NavLink>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 mx-4 bg-base-100 rounded-2xl shadow-xl border border-base-300 z-50 lg:hidden overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-2">
              {links.map((link) =>
                renderLink(link, () => setIsMobileMenuOpen(false)),
              )}
              <div className="pt-2 border-t border-base-300 mt-2">
                <NavLink
                  to="/rider"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn bg-primary hover:bg-primary/80 text-primary-content w-full"
                >
                  Be A Rider
                </NavLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavBar;
