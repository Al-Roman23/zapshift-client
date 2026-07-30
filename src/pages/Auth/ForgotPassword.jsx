// Forgot Password Page
import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Mail, ArrowLeft, Send, CheckCircle } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const { resetPassword } = useAuth();

  // React Hook Form Configuration
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle Password Reset Form Submission
  const handleResetPassword = async (data) => {
    setIsLoading(true);

    try {
      await resetPassword(data.email);
      setSentEmail(data.email);
      setEmailSent(true);
    } catch (error) {
      console.error("Reset Password Error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Send Email",
        text:
          error.code === "auth/user-not-found"
            ? "No account found with this email address."
            : error.message || "Could not send reset email. Please try again.",
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
      className="text-center"
    >
      {!emailSent ? (
        <>
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>

          {/* Header */}
          <h1 className="text-3xl font-bold text-base-content mb-2">
            Forgot Password?
          </h1>
          <p className="text-base-content/60 mb-8 max-w-sm mx-auto">
            No worries! Enter your email address and we'll send you a link to
            reset your password.
          </p>

          {/* Reset Password Form */}
          <form
            onSubmit={handleSubmit(handleResetPassword)}
            className="space-y-5"
          >
            {/* Email Field */}
            <div className="text-left">
              <label className="block text-sm font-medium text-base-content mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl bg-base-100 border ${
                    errors.email ? "border-error" : "border-base-300"
                  } focus:border-primary focus:outline-none text-base-content placeholder:text-base-content/40`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-error text-sm mt-1">
                  {errors.email.message}
                </p>
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
                  <Send className="w-5 h-5" />
                  Send Reset Link
                </>
              )}
            </button>
          </form>

          {/* Back To Login Link */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-base-content/70 hover:text-primary transition-colors mt-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </>
      ) : (
        /* Success State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-6"
        >
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>

          <h1 className="text-3xl font-bold text-base-content mb-2">
            Check Your Email
          </h1>
          <p className="text-base-content/60 mb-4">
            We've sent a password reset link to:
          </p>
          <p className="text-primary font-medium text-lg mb-6">{sentEmail}</p>

          <div className="bg-base-100 rounded-xl p-4 border border-base-300 mb-6">
            <p className="text-sm text-base-content/70">
              Didn't receive the email? Check your spam folder or{" "}
              <button
                onClick={() => setEmailSent(false)}
                className="text-primary hover:underline"
              >
                try again!
              </button>
            </p>
          </div>

          <Link to="/login" className="btn btn-primary w-full">
            <ArrowLeft className="w-5 h-5" />
            Back to Login
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ForgotPassword;
