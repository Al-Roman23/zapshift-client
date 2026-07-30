// New User Account Registration Page
import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ImagePlus,
  UserPlus,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import SocialLogin from "./SocialLogin";
import axios from "axios";
import Swal from "sweetalert2";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // React Hook Form Configuration
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Auth And Navigation Hooks
  const { registerUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();

  // Handle Image Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Handle Registration Form Submission
  const handleRegistration = async (data) => {
    setIsLoading(true);
    const profileImg = data.image[0];

    try {
      // Register User With Firebase
      const result = await registerUser(data.email, data.password);

      // Get Firebase ID Token From Newly Created User
      const idToken = await result.user.getIdToken();

      // Upload Profile Image To ImgBB
      const formData = new FormData();
      formData.append("image", profileImg);

      const imageApiUrl = `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_IMAGE_HOST_KEY
      }`;
      const response = await axios.post(imageApiUrl, formData);
      const imageUrl = response.data.data.url;

      // Update Firebase User Profile
      await updateUserProfile({
        displayName: data.name,
        photoURL: imageUrl,
      });

      // Create User In Database
      const userPayload = {
        uid: result.user.uid,
        name: data.name,
        email: data.email,
        photoURL: imageUrl,
        role: "user",
      };
      await axiosSecure.post("/users", userPayload, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Welcome to ZaP ShifT. Your account has been created.",
        confirmButtonText: "Continue",
        confirmButtonColor: "#A3E635",
      });

      // Navigate After Registration
      navigate(location?.state || "/");
    } catch (error) {
      console.error("Registration Error:", error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message || "Something went wrong. Please try again.",
        confirmButtonText: "OK",
        confirmButtonColor: "#A3E635",
      });
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
          Create Account
        </h1>
        <p className="text-base-content/60">
          Register to get started with ZaP ShifT!
        </p>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit(handleRegistration)} className="space-y-4">
        {/* Profile Image Upload */}
        <div className="flex justify-center">
          <label className="cursor-pointer group">
            <div className="relative">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover border-4 border-primary/30"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-base-300 border-4 border-base-300 group-hover:border-primary/30 flex items-center justify-center transition-colors">
                  <ImagePlus className="w-7 h-7 text-base-content/40 group-hover:text-primary transition-colors" />
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                <ImagePlus className="w-3.5 h-3.5 text-primary-content" />
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              {...register("image", { required: "Profile image is required" })}
              onChange={(e) => {
                handleImageChange(e);
                register("image").onChange(e);
              }}
              className="hidden"
            />
          </label>
        </div>
        {errors.image && (
          <p className="text-error text-sm text-center">
            {errors.image.message}
          </p>
        )}

        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-base-content mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className={`w-full pl-12 pr-4 py-3 rounded-xl bg-base-100 border ${
                errors.name ? "border-error" : "border-base-300"
              } focus:border-primary focus:outline-none text-base-content placeholder:text-base-content/40`}
              placeholder="Your Full Name"
            />
          </div>
          {errors.name && (
            <p className="text-error text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-base-content mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
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
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: "Must include uppercase, lowercase, and number",
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-content font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              Create Account
            </>
          )}
        </button>

        {/* Login Link */}
        <p className="text-center text-base-content/70">
          Already have an account?{" "}
          <Link
            to="/login"
            state={location.state}
            className="text-primary font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </form>

      {/* Social Login */}
      <div className="mt-5">
        <SocialLogin />
      </div>
    </motion.div>
  );
};

export default Register;
