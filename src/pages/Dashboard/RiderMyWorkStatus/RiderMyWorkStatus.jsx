// Rider Work Status Page
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Power,
  Activity,
  Clock,
  Package,
  Star,
  TrendingUp,
  Zap,
  AlertCircle,
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const RiderMyWorkStatus = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [riderData, setRiderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);

  // Fetch Rider Status
  useEffect(() => {
    const fetchRiderStatus = async () => {
      try {
        const res = await axiosSecure.get(`/riders/${user.email}/status`);
        setRiderData(res.data);
      } catch (error) {
        console.error("Failed To Fetch Rider Status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.email) fetchRiderStatus();
  }, [user?.email, axiosSecure]);

  // Toggle Work Status
  const toggleWorkStatus = async () => {
    const newStatus = riderData.isActive ? "offline" : "online";
    
    setIsToggling(true);
    
    try {
      await axiosSecure.patch(`/riders/${user.email}/toggle-status`);
      setRiderData((prev) => ({ ...prev, isActive: !prev.isActive }));
      Swal.fire({
        icon: "success",
        title: riderData.isActive ? "You're Offline" : "You're Online!",
        text: riderData.isActive 
          ? "You will not receive new delivery requests."
          : "You can now receive delivery requests!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire("Error!", "Failed to update status.", "error");
    } finally {
      setIsToggling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!riderData) {
    return (
      <div className="p-6">
        <div className="text-center py-16 bg-base-200 rounded-2xl border border-base-300">
          <AlertCircle className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-base-content mb-2">
            Profile Not Found
          </h3>
          <p className="text-base-content/60">
            Your rider profile could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-base-content">Work Status</h1>
        <p className="text-base-content/60 mt-1">
          Control your availability for deliveries!
        </p>
      </motion.div>

      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="max-w-md mx-auto"
      >
        <div className={`rounded-3xl p-8 text-center transition-all duration-500 ${
          riderData.isActive 
            ? "bg-gradient-to-br from-success to-success/80" 
            : "bg-base-200 border border-base-300"
        }`}>
          {/* Status Indicator */}
          <motion.div
            animate={{ scale: riderData.isActive ? [1, 1.1, 1] : 1 }}
            transition={{ repeat: riderData.isActive ? Infinity : 0, duration: 2 }}
            className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-lg ${
              riderData.isActive 
                ? "bg-white/20 ring-4 ring-white/30" 
                : "bg-base-300"
            }`}
          >
            {riderData.isActive ? (
              <Zap className="w-16 h-16 text-white" />
            ) : (
              <Power className="w-16 h-16 text-base-content/40" />
            )}
          </motion.div>

          {/* Status Text */}
          <h2 className={`text-2xl font-bold mt-6 ${
            riderData.isActive ? "text-white" : "text-base-content"
          }`}>
            {riderData.isActive ? "You're Online!" : "You're Offline"}
          </h2>
          <p className={`mt-2 ${
            riderData.isActive ? "text-white/80" : "text-base-content/60"
          }`}>
            {riderData.isActive
              ? "You can receive new delivery requests!"
              : "You will not receive any delivery requests!"}
          </p>

          {/* Toggle Button */}
          <button
            onClick={toggleWorkStatus}
            disabled={isToggling}
            className={`btn btn-lg mt-8 gap-2 min-w-[200px] ${
              riderData.isActive 
                ? "bg-white text-success hover:bg-white/90 border-none" 
                : "btn-success"
            }`}
          >
            {isToggling ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <>
                <Power className="w-5 h-5" />
                {riderData.isActive ? "Go Offline" : "Go Online"}
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-base-200 rounded-2xl p-5 border border-base-300 text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-primary/20 flex items-center justify-center mb-3">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <p className="text-2xl font-bold text-base-content">
            {riderData.totalDeliveries || 0}
          </p>
          <p className="text-sm text-base-content/60">Total Deliveries</p>
        </div>

        <div className="bg-base-200 rounded-2xl p-5 border border-base-300 text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-warning/20 flex items-center justify-center mb-3">
            <Star className="w-6 h-6 text-warning" />
          </div>
          <p className="text-2xl font-bold text-base-content">
            {riderData.rating ? riderData.rating.toFixed(1) : "N/A"}
          </p>
          <p className="text-sm text-base-content/60">Rating</p>
        </div>

        <div className="bg-base-200 rounded-2xl p-5 border border-base-300 text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-success/20 flex items-center justify-center mb-3">
            <TrendingUp className="w-6 h-6 text-success" />
          </div>
          <p className="text-2xl font-bold text-base-content">
            {riderData.completionRate || "100"}%
          </p>
          <p className="text-sm text-base-content/60">Completion Rate</p>
        </div>

        <div className="bg-base-200 rounded-2xl p-5 border border-base-300 text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-info/20 flex items-center justify-center mb-3">
            <Clock className="w-6 h-6 text-info" />
          </div>
          <p className="text-2xl font-bold text-base-content">
            {riderData.avgDeliveryTime || "30"} min
          </p>
          <p className="text-sm text-base-content/60">Avg. Time</p>
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-2xl mx-auto bg-info/10 border border-info/30 rounded-2xl p-4"
      >
        <h4 className="font-semibold text-info mb-2">💡 Pro Tips</h4>
        <ul className="text-sm text-base-content/70 space-y-1">
          <li>• Stay online during peak hours (12-2 PM, 7-9 PM) for more deliveries!</li>
          <li>• Maintain a high completion rate to get priority assignments!</li>
          <li>• Respond to delivery requests within 30 seconds!</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default RiderMyWorkStatus;
