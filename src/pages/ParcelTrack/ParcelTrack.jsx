// Tracking Search Page For Parcels
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  Search,
  Package,
  MapPin,
  ArrowRight,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Box,
  Navigation,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

// Status Configuration
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "warning",
    icon: Clock,
    step: 1,
  },
  "in-transit": {
    label: "In Transit",
    color: "info",
    icon: Truck,
    step: 2,
  },
  delivered: {
    label: "Delivered",
    color: "success",
    icon: CheckCircle,
    step: 3,
  },
  parcel_delivered: {
    label: "Delivered",
    color: "success",
    icon: CheckCircle,
    step: 3,
  },
  failed: {
    label: "Failed",
    color: "error",
    icon: AlertCircle,
    step: 0,
  },
};

const ParcelTrack = () => {
  const navigate = useNavigate();
  const axiosInstance = useAxiosSecure();
  const { user } = useAuth();
  const [searchId, setSearchId] = useState("");
  const [userParcels, setUserParcels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch User's Paid Parcels
  useEffect(() => {
    const fetchUserParcels = async () => {
      if (!user?.email) return;
      setIsLoading(true);
      setError("");
      try {
        const res = await axiosInstance.get("/parcels/paid");
        setUserParcels(res.data);
      } catch (err) {
        console.error("Failed To Fetch User Parcels:", err);
        setError("Failed to fetch your paid parcels. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserParcels();
  }, [user?.email, axiosInstance]);

  // Handle Tracking Search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim() !== "") {
      navigate(`/parcel-track/${searchId.trim()}`);
    }
  };

  // Status Progress Component
  const StatusProgress = ({ status }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const currentStep = config.step;
    
    const steps = [
      { label: "Pending", step: 1 },
      { label: "In Transit", step: 2 },
      { label: "Delivered", step: 3 },
    ];

    return (
      <div className="flex items-center justify-between mt-4">
        {steps.map((step, index) => (
          <div key={step.step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep >= step.step
                    ? currentStep === step.step
                      ? "bg-primary text-primary-content"
                      : "bg-success text-success-content"
                    : "bg-base-300 text-base-content/40"
                }`}
              >
                {currentStep > step.step ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  step.step
                )}
              </div>
              <span className={`text-xs mt-1 ${
                currentStep >= step.step ? "text-base-content" : "text-base-content/40"
              }`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 sm:w-16 h-1 mx-1 rounded ${
                  currentStep > step.step ? "bg-success" : "bg-base-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-base-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section with Search */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-8 md:p-12 mb-8"
        >
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative text-center text-primary-content">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 mx-auto rounded-2xl bg-white/20 flex items-center justify-center mb-6"
            >
              <Navigation className="w-10 h-10" />
            </motion.div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Track Your Parcel
            </h1>
            <p className="text-primary-content/80 mb-8 max-w-md mx-auto">
              Enter your tracking ID to see real-time updates on your delivery!
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-lg mx-auto">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                  <input
                    type="text"
                    placeholder="Enter Tracking ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="input w-full pl-12 pr-4 py-3 bg-white text-black placeholder:text-gray-500 border-0 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-xl"
                  />
                </div>
                <button
                  type="submit"
                  className="btn bg-white text-primary hover:bg-white/90 border-none gap-2 px-6 rounded-xl"
                >
                  Track
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Your Parcels Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-base-content flex items-center gap-2">
              <Package className="w-6 h-6 text-primary" />
              Your Parcels
            </h2>
            {userParcels.length > 0 && (
              <span className="badge badge-primary">{userParcels.length} parcels</span>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12 bg-base-200 rounded-2xl border border-base-300">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="text-base-content/60 mt-4">Loading your parcels...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-error/10 border border-error/30 rounded-2xl p-4 flex items-center gap-3"
            >
              <AlertCircle className="w-6 h-6 text-error" />
              <p className="text-error">{error}</p>
            </motion.div>
          )}

          {/* Parcels Grid */}
          {!isLoading && !error && userParcels.length > 0 && (
            <div className="grid gap-4">
              {userParcels.map((parcel, index) => {
                const statusConfig = STATUS_CONFIG[parcel.deliveryStatus] || STATUS_CONFIG.pending;
                const StatusIcon = statusConfig.icon;

                return (
                  <motion.div
                    key={parcel._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => navigate(`/parcel-track/${parcel.trackingId}`)}
                    className="bg-base-200 rounded-2xl border border-base-300 p-5 cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-xl bg-${statusConfig.color}/20 flex items-center justify-center flex-shrink-0`}>
                        <Box className={`w-7 h-7 text-${statusConfig.color}`} />
                      </div>

                      {/* Parcel Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-semibold text-lg text-base-content group-hover:text-primary transition-colors">
                              {parcel.parcelName}
                            </h3>
                            <p className="text-sm text-base-content/60 font-mono">
                              {parcel.trackingId}
                            </p>
                          </div>
                          <span className={`badge badge-${statusConfig.color} gap-1`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                        </div>

                        {/* Route Info */}
                        <div className="flex items-center gap-2 text-sm text-base-content/70">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{parcel.senderDistrict || "Origin"}</span>
                          <ArrowRight className="w-4 h-4" />
                          <MapPin className="w-4 h-4 text-success" />
                          <span>{parcel.receiverDistrict || "Destination"}</span>
                        </div>

                        {/* Progress Bar */}
                        <StatusProgress status={parcel.deliveryStatus} />
                      </div>

                      {/* Arrow */}
                      <div className="hidden sm:flex items-center">
                        <ArrowRight className="w-6 h-6 text-base-content/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && userParcels.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-base-200 rounded-2xl border border-base-300"
            >
              <Package className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-base-content mb-2">
                No Parcels Yet
              </h3>
              <p className="text-base-content/60 mb-6 max-w-md mx-auto">
                {user 
                  ? "You don't have any paid parcels to track yet. Send a parcel to get started!"
                  : "Login to see your parcels or enter a tracking ID above to search."
                }
              </p>
              {user && (
                <button
                  onClick={() => navigate("/send-parcel")}
                  className="btn btn-primary gap-2"
                >
                  <Package className="w-5 h-5" />
                  Send a Parcel
                </button>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-info/10 border border-info/30 rounded-2xl p-5"
        >
          <h4 className="font-semibold text-info mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Tracking Tips
          </h4>
          <ul className="text-sm text-base-content/70 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
              <span>Your tracking ID can be found in your payment confirmation email!</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
              <span><strong>Pending:</strong> Your parcel is waiting to be picked up!</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
              <span><strong>In Transit:</strong> Your parcel is on its way to the destination!</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
              <span><strong>Delivered:</strong> Your parcel has been successfully delivered!</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default ParcelTrack;
