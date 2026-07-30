// My Parcels Dashboard Page
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Eye,
  CreditCard,
  XCircle,
  Search,
  Filter,
  ChevronDown,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  Edit,
  DollarSign,
  ThumbsUp,
  Navigation,
  PackageCheck,
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [parcels, setParcels] = useState([]);
  const [filteredParcels, setFilteredParcels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch User's Parcels
  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const res = await axiosSecure.get(`/parcels/user/${user.email}`);
        setParcels(res.data);
        setFilteredParcels(res.data);
      } catch (error) {
        console.error("Failed To Fetch Parcels:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.email) fetchParcels();
  }, [user?.email, axiosSecure]);

  // Filter Parcels
  useEffect(() => {
    let result = [...parcels];

    // Search Filter
    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.parcelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.receiverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.trackingId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status Filter
    if (statusFilter !== "all") {
      result = result.filter((p) => p.deliveryStatus === statusFilter);
    }

    setFilteredParcels(result);
  }, [searchTerm, statusFilter, parcels]);

  // Handle Parcel Cancellation
  const handleCancel = async (parcelId) => {
    const result = await Swal.fire({
      title: "Cancel Parcel?",
      text: "Are you sure you want to cancel this parcel? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Cancel It",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosSecure.patch(`/parcels/${parcelId}/cancel`);
      setParcels((prev) =>
        prev.map((p) =>
          p._id === parcelId ? { ...p, deliveryStatus: "cancelled" } : p
        )
      );
      Swal.fire({
        icon: "success",
        title: "Cancelled!",
        text: "Your parcel has been cancelled.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire("Error!", error.response?.data?.error || "Failed to cancel parcel.", "error");
    }
  };

  // Status Config With All Statuses
  const statusConfig = {
    pending: { color: "badge-warning", icon: Clock, text: "Pending Payment" },
    assigned: { color: "badge-info", icon: Clock, text: "Rider Assigned" },
    accepted: { color: "badge-info", icon: ThumbsUp, text: "Rider Accepted" },
    "picking-up": { color: "badge-secondary", icon: Navigation, text: "Picking Up" },
    "picked-up": { color: "badge-accent", icon: PackageCheck, text: "Picked Up" },
    "in-transit": { color: "badge-primary", icon: Truck, text: "In Transit" },
    delivered: { color: "badge-success", icon: CheckCircle, text: "Delivered" },
    cancelled: { color: "badge-error", icon: XCircle, text: "Cancelled" },
  };

  const getStatusConfig = (status) =>
    statusConfig[status] || { color: "badge-ghost", icon: AlertCircle, text: status };

  // Get Mini Progress For Parcel
  const getMiniProgress = (status) => {
    const steps = ["pending", "assigned", "accepted", "picking-up", "picked-up", "in-transit", "delivered"];
    const currentIndex = steps.indexOf(status);
    if (status === "cancelled") return null;
    
    const progress = currentIndex >= 0 ? ((currentIndex + 1) / steps.length) * 100 : 0;
    
    return (
      <div className="mt-3">
        <div className="flex justify-between text-xs text-base-content/60 mb-1">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-base-300 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`h-full rounded-full ${
              status === "delivered" ? "bg-success" : "bg-primary"
            }`}
          />
        </div>
      </div>
    );
  };

  // Calculate Total Spent
  const totalSpent = parcels
    .filter((p) => p.paymentStatus === "paid")
    .reduce((sum, p) => sum + (p.cost || 0), 0);

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
          <h1 className="text-3xl font-bold text-base-content">My Parcels</h1>
          <p className="text-base-content/60 mt-1">
            Track and manage all your shipments!
          </p>
        </div>
        <Link to="/send-parcel" className="btn btn-primary gap-2">
          <Package className="w-5 h-5" />
          Send New Parcel
        </Link>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-5 gap-4"
      >
        {[
          { label: "Total Parcels", count: parcels.length, color: "text-primary", icon: Package },
          { label: "Pending", count: parcels.filter(p => p.deliveryStatus === "pending").length, color: "text-warning", icon: Clock },
          { label: "In Progress", count: parcels.filter(p => ["assigned", "accepted", "picking-up", "picked-up", "in-transit"].includes(p.deliveryStatus)).length, color: "text-info", icon: Truck },
          { label: "Delivered", count: parcels.filter(p => p.deliveryStatus === "delivered").length, color: "text-success", icon: CheckCircle },
          { label: "Total Spent", count: `৳${totalSpent}`, color: "text-primary", icon: DollarSign },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-base-200 rounded-xl p-4 border border-base-300"
          >
            <div className="flex items-center gap-2 mb-1">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <p className="text-base-content/60 text-sm">{stat.label}</p>
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>
              {stat.count}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Search And Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-base-200 rounded-2xl p-4 border border-base-300"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
            <input
              type="text"
              placeholder="Search by parcel name, receiver, or tracking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-base-100 border border-base-300 focus:border-primary focus:outline-none text-base-content placeholder:text-base-content/40"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-ghost gap-2"
          >
            <Filter className="w-5 h-5" />
            Filters
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Filter Options */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 flex flex-wrap gap-2">
                {["all", "pending", "assigned", "in-transit", "delivered", "cancelled"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`btn btn-sm ${
                        statusFilter === status
                          ? "btn-primary"
                          : "btn-ghost"
                      }`}
                    >
                      {status === "all" ? "All" : getStatusConfig(status).text}
                    </button>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Parcels List */}
      {filteredParcels.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-base-200 rounded-2xl border border-base-300"
        >
          <Package className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-base-content mb-2">
            {parcels.length === 0 ? "No Parcels Yet" : "No Matching Parcels"}
          </h3>
          <p className="text-base-content/60 mb-6">
            {parcels.length === 0
              ? "You haven't booked any parcels yet. Start shipping today!"
              : "Try adjusting your search or filter criteria."}
          </p>
          {parcels.length === 0 && (
            <Link to="/send-parcel" className="btn btn-primary">
              Book Your First Parcel
            </Link>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {filteredParcels.map((parcel, index) => {
            let statusInfo = getStatusConfig(parcel.deliveryStatus);
            // Fix: If Paid But Pending Delivery, Show "Pending" Instead Of "Pending Payment"
            if (parcel.deliveryStatus === "pending" && parcel.paymentStatus === "paid") {
              statusInfo = { ...statusInfo, text: "Pending" };
            }
            const StatusIcon = statusInfo.icon;

            return (
              <motion.div
                key={parcel._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-base-200 rounded-2xl border border-base-300 overflow-hidden hover:border-primary/30 transition-all duration-300"
              >
                <div className="p-5">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Parcel Icon */}
                    <div className="hidden md:flex w-14 h-14 rounded-xl bg-primary/20 items-center justify-center flex-shrink-0">
                      <Package className="w-7 h-7 text-primary" />
                    </div>

                    {/* Parcel Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-lg text-base-content line-clamp-1">
                            {parcel.parcelName}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-base-content/60 mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {parcel.receiverName} • {parcel.receiverDistrict}
                            </span>
                          </div>
                        </div>
                        <span className={`badge ${statusInfo.color} gap-1`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusInfo.text}
                        </span>
                      </div>

                      {/* Details Row */}
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                        <span className="text-base-content/60">
                          Tracking: <span className="font-mono text-base-content">{parcel.trackingId}</span>
                        </span>
                        <span className="text-base-content/60">
                          Cost: <span className="font-semibold text-base-content">৳{parcel.cost}</span>
                        </span>
                        <span
                          className={`badge badge-sm ${
                            parcel.paymentStatus === "paid"
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {parcel.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                        </span>
                        {parcel.riderName && (
                          <span className="text-base-content/60">
                            Rider: <span className="font-medium text-base-content">{parcel.riderName}</span>
                          </span>
                        )}
                      </div>

                      {/* Mini Progress Bar */}
                      {getMiniProgress(parcel.deliveryStatus)}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 md:flex-shrink-0 flex-wrap">
                      <Link
                        to={`/parcel-track/${parcel.trackingId}`}
                        className="btn btn-sm btn-ghost gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Track
                      </Link>

                      {parcel.paymentStatus === "unpaid" &&
                        parcel.deliveryStatus !== "cancelled" && (
                          <Link
                            to={`/dashboard/payment/${parcel._id}`}
                            className="btn btn-sm btn-primary gap-1"
                          >
                            <CreditCard className="w-4 h-4" />
                            Pay
                          </Link>
                        )}

                      {parcel.deliveryStatus === "pending" &&
                        parcel.paymentStatus === "unpaid" && (
                          <button
                            onClick={() => handleCancel(parcel._id)}
                            className="btn btn-sm btn-error btn-outline gap-1"
                          >
                            <XCircle className="w-4 h-4" />
                            Cancel
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default MyParcels;
