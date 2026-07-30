// Rider Earnings Page
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Package,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Wallet,
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const RiderEarnings = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [earnings, setEarnings] = useState({
    total: 0,
    thisMonth: 0,
    thisWeek: 0,
    deliveries: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Earnings Data
  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await axiosSecure.get(`/riders/${user.email}/earnings`);
        setEarnings(res.data);
      } catch (error) {
        console.error("Failed To Fetch Earnings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.email) fetchEarnings();
  }, [user?.email, axiosSecure]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Calculate Average Per Delivery
  const avgPerDelivery =
    earnings.deliveries?.length > 0
      ? Math.round(earnings.total / earnings.deliveries.length)
      : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-base-content">My Earnings</h1>
          <p className="text-base-content/60 mt-1">
            Track your delivery earnings and performance! 
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/20 text-success">
          <Wallet className="w-5 h-5" />
          <span className="font-semibold">Active Rider</span>
        </div>
      </motion.div>

      {/* Earnings Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Total Earnings */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-white/80 text-sm font-medium">Total Earnings</p>
              <DollarSign className="w-5 h-5 text-white/60" />
            </div>
            <p className="text-4xl font-bold mt-2">৳{(earnings.total || 0).toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2 text-sm text-white/80">
              <TrendingUp className="w-4 h-4" />
              <span>All time</span>
            </div>
          </div>
        </div>

        {/* This Month */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-white/80 text-sm font-medium">This Month</p>
              <Calendar className="w-5 h-5 text-white/60" />
            </div>
            <p className="text-4xl font-bold mt-2">৳{(earnings.thisMonth || 0).toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2 text-sm text-white/80">
              <ArrowUpRight className="w-4 h-4" />
              <span>{new Date().toLocaleString("default", { month: "long" })}</span>
            </div>
          </div>
        </div>

        {/* Total Deliveries */}
        <div className="bg-base-200 rounded-2xl p-6 border border-base-300">
          <div className="flex items-center justify-between">
            <p className="text-base-content/60 text-sm font-medium">Total Deliveries</p>
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-4xl font-bold text-base-content mt-2">
            {earnings.deliveries?.length || 0}
          </p>
          <p className="text-sm text-base-content/60 mt-2">Completed Deliveries!</p>
        </div>

        {/* Average Per Delivery */}
        <div className="bg-base-200 rounded-2xl p-6 border border-base-300">
          <div className="flex items-center justify-between">
            <p className="text-base-content/60 text-sm font-medium">Avg. Per Delivery</p>
            <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
          </div>
          <p className="text-4xl font-bold text-base-content mt-2">৳{avgPerDelivery}</p>
          <p className="text-sm text-base-content/60 mt-2">Per Completed Delivery!</p>
        </div>
      </motion.div>

      {/* Recent Earnings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-base-content mb-4">Recent Earnings</h2>

        {!earnings.deliveries?.length ? (
          <div className="text-center py-16 bg-base-200 rounded-2xl border border-base-300">
            <DollarSign className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-base-content mb-2">No Earnings Yet</h3>
            <p className="text-base-content/60">
              Complete deliveries to start earning!
            </p>
          </div>
        ) : (
          <div className="bg-base-200 rounded-2xl border border-base-300 overflow-hidden">
            <div className="divide-y divide-base-300">
              {earnings.deliveries.slice(0, 10).map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-base-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-success" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base-content truncate">
                        {item.parcelName}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-base-content/60">
                        <Clock className="w-4 h-4" />
                        <span>
                          {item.deliveredAt
                            ? new Date(item.deliveredAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Recently"}
                        </span>
                      </div>
                    </div>

                    {/* Earning Amount */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-success">
                        +৳{item.riderEarning || 50}
                      </p>
                      <span className="badge badge-success badge-sm">Earned</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Earnings Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-info/10 border border-info/30 rounded-2xl p-4"
      >
        <h4 className="font-semibold text-info mb-2">💰 Earnings Info</h4>
        <ul className="text-sm text-base-content/70 space-y-1">
          <li>• You earn ৳50 for each successful delivery!</li>
          <li>• Earnings are calculated after delivery confirmation!</li>
          <li>• Weekly payouts are processed every Sunday!</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default RiderEarnings;
