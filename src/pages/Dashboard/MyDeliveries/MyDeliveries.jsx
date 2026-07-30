// Rider Deliveries Page
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Search,
  Filter,
  ChevronDown,
  Navigation,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  PackageCheck,
  CircleDot,
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const MyDeliveries = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch Assigned Deliveries
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const res = await axiosSecure.get(`/riders/${user.email}/deliveries`);
        setDeliveries(res.data);
        setFilteredDeliveries(res.data);
      } catch (error) {
        console.error("Failed To Fetch Deliveries:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.email) fetchDeliveries();
  }, [user?.email, axiosSecure]);

  // Filter Deliveries
  useEffect(() => {
    let result = [...deliveries];

    if (searchTerm) {
      result = result.filter(
        (d) =>
          d.parcelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.receiverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.trackingId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((d) => d.deliveryStatus === statusFilter);
    }

    setFilteredDeliveries(result);
  }, [searchTerm, statusFilter, deliveries]);

  // Handle Accept Parcel
  const handleAccept = async (parcelId) => {
    const confirmResult = await Swal.fire({
      title: "Accept this delivery?",
      text: "You will be responsible for picking up and delivering this parcel.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      confirmButtonText: "Yes, Accept",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      await axiosSecure.patch(`/parcels/${parcelId}/accept`, {
        riderName: user.displayName || user.email,
      });
      setDeliveries((prev) =>
        prev.map((d) =>
          d._id === parcelId ? { ...d, deliveryStatus: "accepted" } : d
        )
      );
      Swal.fire({
        icon: "success",
        title: "Accepted!",
        text: "You have accepted this delivery.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire("Error!", error.response?.data?.error || "Failed to accept.", "error");
    }
  };

  // Handle Reject Parcel
  const handleReject = async (parcelId) => {
    const { value: reason } = await Swal.fire({
      title: "Reject this delivery?",
      input: "textarea",
      inputLabel: "Please provide a reason for rejection:",
      inputPlaceholder: "e.g., Too far, Vehicle issue, etc.",
      inputAttributes: { required: true },
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Reject",
      inputValidator: (value) => {
        if (!value) return "Please provide a reason!";
      },
    });

    if (!reason) return;

    try {
      await axiosSecure.patch(`/parcels/${parcelId}/reject`, {
        riderName: user.displayName || user.email,
        reason,
      });
      // Remove from list after rejection
      setDeliveries((prev) => prev.filter((d) => d._id !== parcelId));
      Swal.fire({
        icon: "info",
        title: "Rejected",
        text: "The parcel has been returned to the admin for reassignment.",
        timer: 2500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire("Error!", error.response?.data?.error || "Failed to reject.", "error");
    }
  };

  // Handle Status Update
  const handleStatusUpdate = async (parcelId, newStatus, statusLabel) => {
    const confirmResult = await Swal.fire({
      title: `Mark as "${statusLabel}"?`,
      text: `Update the delivery status to ${statusLabel}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: newStatus === "delivered" ? "#22c55e" : "#3b82f6",
      confirmButtonText: "Yes, Update",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      await axiosSecure.patch(`/parcels/${parcelId}/status`, {
        status: newStatus,
        riderName: user.displayName || user.email,
      });
      setDeliveries((prev) =>
        prev.map((d) =>
          d._id === parcelId ? { ...d, deliveryStatus: newStatus } : d
        )
      );
      toast.success(`Status updated to ${statusLabel}!`);
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  // Status Config
  const statusConfig = {
    assigned: { color: "bg-warning/20 text-warning", icon: Clock, text: "Awaiting Acceptance" },
    accepted: { color: "bg-info/20 text-info", icon: ThumbsUp, text: "Accepted" },
    "picking-up": { color: "bg-purple-500/20 text-purple-500", icon: Navigation, text: "Going to Pickup" },
    "picked-up": { color: "bg-orange-500/20 text-orange-500", icon: PackageCheck, text: "Picked Up" },
    "in-transit": { color: "bg-blue-500/20 text-blue-500", icon: Truck, text: "In Transit" },
    delivered: { color: "bg-success/20 text-success", icon: CheckCircle, text: "Delivered" },
  };

  const getStatusConfig = (status) =>
    statusConfig[status] || { color: "bg-base-300 text-base-content", icon: AlertCircle, text: status };

  // Get next action buttons based on current status
  const getActionButtons = (delivery) => {
    const { _id, deliveryStatus } = delivery;
    
    switch (deliveryStatus) {
      case "assigned":
        return (
          <div className="flex flex-wrap gap-2">
            <button onClick={() => handleAccept(_id)} className="btn btn-success btn-sm gap-2">
              <ThumbsUp className="w-4 h-4" /> Accept
            </button>
            <button onClick={() => handleReject(_id)} className="btn btn-error btn-sm gap-2">
              <ThumbsDown className="w-4 h-4" /> Reject
            </button>
          </div>
        );
      case "accepted":
        return (
          <button onClick={() => handleStatusUpdate(_id, "picking-up", "Going to Pickup")} className="btn btn-info btn-sm gap-2">
            <Navigation className="w-4 h-4" /> On Way to Pickup
          </button>
        );
      case "picking-up":
        return (
          <button onClick={() => handleStatusUpdate(_id, "picked-up", "Picked Up")} className="btn btn-warning btn-sm gap-2">
            <PackageCheck className="w-4 h-4" /> Picked Up
          </button>
        );
      case "picked-up":
        return (
          <button onClick={() => handleStatusUpdate(_id, "in-transit", "In Transit")} className="btn btn-primary btn-sm gap-2">
            <Truck className="w-4 h-4" /> Start Delivery
          </button>
        );
      case "in-transit":
        return (
          <button onClick={() => handleStatusUpdate(_id, "delivered", "Delivered")} className="btn btn-success btn-sm gap-2">
            <CheckCircle className="w-4 h-4" /> Mark Delivered
          </button>
        );
      default:
        return null;
    }
  };

  // Progress indicator
  const getProgressSteps = (status) => {
    const steps = ["assigned", "accepted", "picking-up", "picked-up", "in-transit", "delivered"];
    const currentIndex = steps.indexOf(status);
    return (
      <div className="flex items-center gap-1 mt-3">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`w-2 h-2 rounded-full ${index <= currentIndex ? "bg-primary" : "bg-base-300"}`} />
            {index < steps.length - 1 && (
              <div className={`w-4 h-0.5 ${index < currentIndex ? "bg-primary" : "bg-base-300"}`} />
            )}
          </div>
        ))}
      </div>
    );
  };

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
          <h1 className="text-3xl font-bold text-base-content">My Deliveries</h1>
          <p className="text-base-content/60 mt-1">
            Manage your assigned deliveries!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 text-primary px-4 py-2 rounded-xl font-medium">
            {deliveries.filter(d => d.deliveryStatus !== "delivered").length} Active
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {[
          { label: "Total Assigned", count: deliveries.length, color: "text-primary" },
          { label: "Pending Action", count: deliveries.filter(d => d.deliveryStatus === "assigned").length, color: "text-warning" },
          { label: "In Progress", count: deliveries.filter(d => ["accepted", "picking-up", "picked-up", "in-transit"].includes(d.deliveryStatus)).length, color: "text-info" },
          { label: "Delivered", count: deliveries.filter(d => d.deliveryStatus === "delivered").length, color: "text-success" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-base-200 rounded-xl p-4 border border-base-300"
          >
            <p className="text-base-content/60 text-sm">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
          </div>
        ))}
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-base-200 rounded-2xl p-4 border border-base-300"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
            <input
              type="text"
              placeholder="Search deliveries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-base-100 border border-base-300 focus:border-primary focus:outline-none text-base-content placeholder:text-base-content/40"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-ghost gap-2"
          >
            <Filter className="w-5 h-5" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 flex flex-wrap gap-2">
                {["all", "assigned", "accepted", "picking-up", "picked-up", "in-transit", "delivered"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`btn btn-sm ${statusFilter === status ? "btn-primary" : "btn-ghost"}`}
                  >
                    {status === "all" ? "All" : getStatusConfig(status).text}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Deliveries List */}
      {filteredDeliveries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-base-200 rounded-2xl border border-base-300"
        >
          <Truck className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-base-content mb-2">
            {deliveries.length === 0 ? "No Deliveries Assigned" : "No Matching Deliveries"}
          </h3>
          <p className="text-base-content/60">
            {deliveries.length === 0
              ? "You don't have any deliveries assigned yet."
              : "Try adjusting your search or filter criteria."}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid gap-4"
        >
          {filteredDeliveries.map((delivery, index) => {
            const statusInfo = getStatusConfig(delivery.deliveryStatus);
            const StatusIcon = statusInfo.icon;

            return (
              <motion.div
                key={delivery._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-base-200 rounded-2xl border border-base-300 overflow-hidden hover:border-primary/30 transition-all duration-300"
              >
                <div className="p-5">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl ${statusInfo.color} flex items-center justify-center`}>
                        <StatusIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-base-content">
                          {delivery.parcelName}
                        </h3>
                        <p className="text-sm text-base-content/60">
                          Tracking: {delivery.trackingId}
                        </p>
                        {getProgressSteps(delivery.deliveryStatus)}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`badge ${
                        delivery.deliveryStatus === "delivered" ? "badge-success" :
                        delivery.deliveryStatus === "assigned" ? "badge-warning" : "badge-info"
                      }`}>
                        {statusInfo.text}
                      </span>
                      <p className="text-lg font-bold text-base-content mt-1">৳{delivery.cost}</p>
                    </div>
                  </div>

                  {/* Sender Info (Pickup) */}
                  <div className="bg-base-100 rounded-xl p-4 mb-3">
                    <p className="text-xs text-base-content/50 uppercase tracking-wide mb-2">Pickup From</p>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-base-content">{delivery.senderName || "Sender"}</p>
                        <p className="text-sm text-base-content/60">
                          {delivery.senderAddress || delivery.senderDistrict || "Address not specified"}
                        </p>
                      </div>
                      {delivery.senderPhone && (
                        <a
                          href={`tel:${delivery.senderPhone}`}
                          className="btn btn-sm btn-info btn-outline gap-1"
                        >
                          <Phone className="w-4 h-4" />
                          Call
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Receiver Info (Delivery) */}
                  <div className="bg-base-100 rounded-xl p-4 space-y-3">
                    <p className="text-xs text-base-content/50 uppercase tracking-wide mb-2">Deliver To</p>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-base-content">{delivery.receiverName}</p>
                        <p className="text-sm text-base-content/60">
                          {delivery.receiverAddress}, {delivery.receiverDistrict}
                        </p>
                      </div>
                    </div>
                    {delivery.receiverPhone && (
                      <div className="flex items-center justify-between gap-3 pt-2 border-t border-base-300">
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-base-content">{delivery.receiverPhone}</span>
                        </div>
                        <a
                          href={`tel:${delivery.receiverPhone}`}
                          className="btn btn-sm btn-success btn-outline gap-1"
                        >
                          <Phone className="w-4 h-4" />
                          Call Receiver
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {delivery.deliveryStatus !== "delivered" && (
                    <div className="mt-4">
                      {getActionButtons(delivery)}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default MyDeliveries;
