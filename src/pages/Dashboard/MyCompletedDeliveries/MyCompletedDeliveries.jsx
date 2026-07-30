// Rider Completed Deliveries Page
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Package,
  MapPin,
  Calendar,
  Search,
  Trophy,
  TrendingUp,
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const MyCompletedDeliveries = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Completed Deliveries
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const res = await axiosSecure.get(`/riders/${user.email}/completed`);
        setDeliveries(res.data);
        setFilteredDeliveries(res.data);
      } catch (error) {
        console.error("Failed To Fetch Completed Deliveries:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.email) fetchDeliveries();
  }, [user?.email, axiosSecure]);

  // Filter Deliveries
  useEffect(() => {
    if (searchTerm) {
      setFilteredDeliveries(
        deliveries.filter(
          (d) =>
            d.parcelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.receiverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.trackingId?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredDeliveries(deliveries);
    }
  }, [searchTerm, deliveries]);

  // Calculate Stats
  const totalEarned = deliveries.reduce((acc, d) => acc + (d.riderEarning || 50), 0);
  const thisMonthDeliveries = deliveries.filter((d) => {
    const date = new Date(d.deliveredAt);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });

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
          <h1 className="text-3xl font-bold text-base-content">Completed Deliveries</h1>
          <p className="text-base-content/60 mt-1">
            Your delivery success history!  
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/20 text-success">
          <Trophy className="w-5 h-5" />
          <span className="font-semibold">{deliveries.length} Completed</span>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="bg-gradient-to-br from-success to-success/80 rounded-2xl p-6 text-success-content">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-success-content/80 text-sm">Total Completed</p>
              <p className="text-3xl font-bold mt-1">{deliveries.length}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-success-content/50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-info to-info/80 rounded-2xl p-6 text-info-content">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-info-content/80 text-sm">This Month</p>
              <p className="text-3xl font-bold mt-1">{thisMonthDeliveries.length}</p>
            </div>
            <Calendar className="w-10 h-10 text-info-content/50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Total Earned</p>
              <p className="text-3xl font-bold mt-1">৳{totalEarned.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-white/50" />
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-base-200 rounded-2xl p-4 border border-base-300"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
          <input
            type="text"
            placeholder="Search completed deliveries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-base-100 border border-base-300 focus:border-primary focus:outline-none text-base-content placeholder:text-base-content/40"
          />
        </div>
      </motion.div>

      {/* Deliveries List */}
      {filteredDeliveries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-base-200 rounded-2xl border border-base-300"
        >
          <CheckCircle className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-base-content mb-2">
            {deliveries.length === 0 ? "No Completed Deliveries" : "No Matching Results"}
          </h3>
          <p className="text-base-content/60">
            {deliveries.length === 0
              ? "Complete deliveries to see them here!"
              : "Try adjusting your search criteria."}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {filteredDeliveries.map((delivery, index) => (
            <motion.div
              key={delivery._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-base-200 rounded-2xl border border-base-300 p-5 hover:border-success/30 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                {/* Success Icon */}
                <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>

                {/* Delivery Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base-content truncate">
                    {delivery.parcelName}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-base-content/60 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {delivery.receiverName} • {delivery.receiverDistrict}
                    </span>
                  </div>
                </div>

                {/* Amount & Date */}
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-success">৳{delivery.cost}</p>
                  <p className="text-sm text-base-content/60">
                    {delivery.deliveredAt
                      ? new Date(delivery.deliveredAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "Recently"}
                  </p>
                </div>

                {/* Badge */}
                <span className="badge badge-success gap-1 flex-shrink-0">
                  <CheckCircle className="w-3 h-3" />
                  Delivered
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MyCompletedDeliveries;
