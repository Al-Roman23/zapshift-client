// User Login Page
import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff, LogIn, Zap, Shield, Truck, Package } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import SocialLogin from "./SocialLogin";
import Swal from "sweetalert2";

// Demo Credentials For Testing
const DEMO_CREDENTIALS = {
  admin: { email: "mizukiokada@gmail.com", password: "A12345a@", label: "Admin", icon: Shield, color: "text-error" },
  rider: { email: "alroman@gmail.com", password: "A12345a@", label: "Rider", icon: Truck, color: "text-info" },
  sender: { email: "alroman12152004@gmail.com", password: "A12345a@", label: "Sender", icon: Package, color: "text-success" },
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // React Hook Form Configuration
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Auth And Navigation Hooks
  const { signInUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  // Fill Demo Credentials
  const fillCredentials = (role) => {
    const creds = DEMO_CREDENTIALS[role];
    setValue("email", creds.email);
    setValue("password", creds.password);
  };

  // Handle Login Form Submission
  const handleLogin = async (data) => {
    setIsLoading(true);
    try {
      // Sign In With Firebase
      const result = await signInUser(data.email, data.password);

      // Get Firebase ID Token
      const token = await result.user.getIdToken();

      // Verify User With Backend
      await axiosSecure.get("/users/check", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Navigate After Successful Login
      navigate(location?.state?.from || "/");
    } catch (error) {
      console.error("Login Error:", error);

      // Show Alert If Account Disabled
      if (error.response?.status === 403) {
        Swal.fire({
          icon: "error",
          title: "Account Disabled",
          html: `Your account has been disabled by the admin.<br/>Please contact support:<br/><strong>📞 01319694957</strong>`,
          confirmButtonText: "OK",
          confirmButtonColor: "#A3E635",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: error.message || "Invalid email or password. Please try again.",
          confirmButtonText: "OK",
          confirmButtonColor: "#A3E635",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-base-content mb-2">
          Welcome Back
        </h1>
        <p className="text-base-content/60">Please login to continue!</p>
      </div>

      {/* Demo Credentials Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-warning" />
          <span className="text-sm font-medium text-base-content/70">Quick Demo Login</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(DEMO_CREDENTIALS).map(([role, creds]) => {
            const Icon = creds.icon;
            return (
              <button
                key={role}
                type="button"
                onClick={() => fillCredentials(role)}
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-base-200 hover:bg-base-300 border border-base-300 hover:border-primary/30 transition-all"
              >
                <Icon className={`w-5 h-5 ${creds.color}`} />
                <span className="text-xs font-medium text-base-content">{creds.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="divider text-base-content/40 text-sm">or sign in with email</div>
      <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-base-content mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
            <input
              type="email"
              {...register("email", { required: "Email is required." })}
              className={`w-full pl-12 pr-4 py-3 rounded-xl bg-base-100 border ${
                errors.email ? "border-error" : "border-base-300"
              } focus:border-primary focus:outline-none text-base-content placeholder:text-base-content/40`}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && (
            <p className="text-error text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-base-content mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required.",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters.",
                },
              })}
              className={`w-full pl-12 pr-12 py-3 rounded-xl bg-base-100 border ${
                errors.password ? "border-error" : "border-base-300"
              } focus:border-primary focus:outline-none text-base-content placeholder:text-base-content/40`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-error text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-content font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              Login
            </>
          )}
        </button>

        {/* Register Link */}
        <p className="text-center text-base-content/70">
          New to ZaP ShifT?{" "}
          <Link
            to="/register"
            state={location.state}
            className="text-primary font-medium hover:underline"
          >
            Create an account
          </Link>
        </p>
      </form>

      {/* Social Login */}
      <div className="mt-6">
        <SocialLogin />
      </div>
    </motion.div>
  );
};

export default Login;
