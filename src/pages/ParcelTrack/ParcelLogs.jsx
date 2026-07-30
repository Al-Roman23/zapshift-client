// Parcel Tracking History And Logs Page
import { useParams, Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  Clock,
  Truck,
  CheckCircle,
  MapPin,
  User,
  Calendar,
  AlertCircle,
  Navigation,
  Copy,
  Check,
} from "lucide-react";
import useAxios from "../../hooks/useAxios";

// Status Configuration
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "warning",
    icon: Clock,
  },
  "in-transit": {
    label: "In Transit",
    color: "info",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "success",
    icon: CheckCircle,
  },
  parcel_delivered: {
    label: "Delivered",
    color: "success",
    icon: CheckCircle,
  },
  failed: {
    label: "Failed",
    color: "error",
    icon: AlertCircle,
  },
};

const ParcelLogs = () => {
  const { trackingId } = useParams();
  const navigate = useNavigate();
  const axios = useAxios();
  const [logs, setLogs] = useState([]);
  const [parcel, setParcel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Fetch Parcel Logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`/trackings/${trackingId}/logs`);
        setLogs(res.data.logs || res.data);
        if (res.data.parcel) {
          setParcel(res.data.parcel);
        }
      } catch (err) {
        console.error("Failed To Fetch Logs:", err);
        setError("Failed to fetch tracking logs. Please check your tracking ID.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, [trackingId, axios]);

  // Copy Tracking ID
  const copyTrackingId = () => {
    navigator.clipboard.writeText(trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get Icon for Log Type
  const getLogIcon = (details) => {
    const lowerDetails = details.toLowerCase();
    if (lowerDetails.includes("delivered")) return CheckCircle;
    if (lowerDetails.includes("transit") || lowerDetails.includes("picked")) return Truck;
    if (lowerDetails.includes("assigned")) return User;
    return Clock;
  };

  return (
    <div className="min-h-screen bg-base-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            to="/parcel-track"
            className="inline-flex items-center gap-2 text-base-content/70 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Tracking</span>
          </Link>
        </motion.div>

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-6 md:p-8 mb-6 text-primary-content relative overflow-hidden"
        >
          {/* Decoration */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <Navigation className="w-7 h-7" />
              </div>
              <div>
                <p className="text-primary-content/80 text-sm">Tracking ID</p>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-bold font-mono">{trackingId}</h1>
                  <button
                    onClick={copyTrackingId}
                    className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                    title="Copy tracking ID"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Parcel Info (if available) */}
            {parcel && (
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/20">
                <div>
                  <p className="text-primary-content/60 text-sm">Parcel Name</p>
                  <p className="font-semibold">{parcel.parcelName}</p>
                </div>
                <div>
                  <p className="text-primary-content/60 text-sm">Status</p>
                  <p className="font-semibold capitalize">{parcel.deliveryStatus?.replace("-", " ")}</p>
                </div>
                <div>
                  <p className="text-primary-content/60 text-sm">From</p>
                  <p className="font-semibold">{parcel.senderDistrict}</p>
                </div>
                <div>
                  <p className="text-primary-content/60 text-sm">To</p>
                  <p className="font-semibold">{parcel.receiverDistrict}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16 bg-base-200 rounded-2xl border border-base-300">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-base-content/60 mt-4">Fetching tracking logs...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-base-200 rounded-2xl border border-error/30"
          >
            <AlertCircle className="w-16 h-16 text-error/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-base-content mb-2">
              Tracking Not Found
            </h3>
            <p className="text-base-content/60 mb-6">{error}</p>
            <button
              onClick={() => navigate("/parcel-track")}
              className="btn btn-primary gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Try Another ID
            </button>
          </motion.div>
        )}

        {/* Logs Timeline */}
        {!isLoading && !error && logs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-xl font-bold text-base-content mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Tracking History
            </h2>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-base-300" />
              
              {/* Logs */}
              <div className="space-y-4">
                {logs.map((log, index) => {
                  const LogIcon = getLogIcon(log.details);
                  const isFirst = index === 0;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative pl-14 ${isFirst ? "" : ""}`}
                    >
                      {/* Icon */}
                      <div className={`absolute left-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                        isFirst 
                          ? "bg-primary text-primary-content" 
                          : "bg-base-200 text-base-content/60 border border-base-300"
                      }`}>
                        <LogIcon className="w-5 h-5" />
                      </div>

                      {/* Content */}
                      <div className={`bg-base-200 rounded-xl p-4 border ${
                        isFirst ? "border-primary/30" : "border-base-300"
                      }`}>
                        <p className={`font-medium ${isFirst ? "text-primary" : "text-base-content"}`}>
                          {log.details}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-base-content/60">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(log.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {log.by && (
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {log.by}
                            </span>
                          )}
                          {log.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {log.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && logs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-base-200 rounded-2xl border border-base-300"
          >
            <Package className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-base-content mb-2">
              No Updates Yet
            </h3>
            <p className="text-base-content/60">
              Your parcel tracking history will appear here once it's processed.
            </p>
          </motion.div>
        )}

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-base-200 rounded-2xl border border-base-300 p-5"
        >
          <h4 className="font-semibold text-base-content mb-3">Need Help?</h4>
          <p className="text-sm text-base-content/70">
            If you have any questions about your delivery, please contact our support team
            or call us at <span className="font-semibold text-primary">+8801319694957!</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ParcelLogs;
