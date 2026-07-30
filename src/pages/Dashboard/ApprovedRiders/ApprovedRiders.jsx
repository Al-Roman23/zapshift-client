// Admin Approved Riders List Page
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Truck,
  Search,
  Phone,
  Mail,
  MapPin,
  Package,
  UserX,
  CheckCircle,
  Activity,
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ApprovedRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [riders, setRiders] = useState([]);
  const [filteredRiders, setFilteredRiders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [removingId, setRemovingId] = useState(null);

  // Fetch Approved Riders
  useEffect(() => {
    const fetchRiders = async () => {
      try {
        const res = await axiosSecure.get("/riders/approved");
        setRiders(res.data);
        setFilteredRiders(res.data);
      } catch (error) {
        console.error("Failed To Fetch Approved Riders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRiders();
  }, [axiosSecure]);

  // Filter Riders
  useEffect(() => {
    if (searchTerm) {
      setFilteredRiders(
        riders.filter(
          (r) =>
            r.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.district?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredRiders(riders);
    }
  }, [searchTerm, riders]);

  // Handle Remove Rider
  const handleRemove = async (rider) => {
    const result = await Swal.fire({
      title: "Remove Rider?",
      html: `This will revoke <strong>${rider.fullName}</strong>'s rider status.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Remove",
    });

    if (!result.isConfirmed) return;

    setRemovingId(rider._id);

    try {
      await axiosSecure.delete(`/riders/${rider._id}`);
      setRiders((prev) => prev.filter((r) => r._id !== rider._id));
      Swal.fire({
        icon: "success",
        title: "Removed!",
        text: "Rider has been removed.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire("Error!", "Failed to remove rider.", "error");
    } finally {
      setRemovingId(null);
    }
  };

  // Calculate Stats
  const activeRiders = riders.filter((r) => r.isActive).length;
  const totalDeliveries = riders.reduce((acc, r) => acc + (r.totalDeliveries || 0), 0);

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
          <h1 className="text-3xl font-bold text-base-content">Approved Riders</h1>
          <p className="text-base-content/60 mt-1">
            Manage your delivery team!
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-5 text-primary-content">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-content/80 text-sm">Total Riders</p>
              <p className="text-3xl font-bold mt-1">{riders.length}</p>
            </div>
            <Truck className="w-10 h-10 text-primary-content/50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-success to-success/80 rounded-2xl p-5 text-success-content">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-success-content/80 text-sm">Active Now</p>
              <p className="text-3xl font-bold mt-1">{activeRiders}</p>
            </div>
            <Activity className="w-10 h-10 text-success-content/50" />
          </div>
        </div>

        <div className="bg-base-200 rounded-2xl p-5 border border-base-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm">Total Deliveries</p>
              <p className="text-3xl font-bold text-base-content mt-1">{totalDeliveries}</p>
            </div>
            <Package className="w-10 h-10 text-base-content/20" />
          </div>
        </div>

        <div className="bg-base-200 rounded-2xl p-5 border border-base-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm">Offline</p>
              <p className="text-3xl font-bold text-base-content mt-1">{riders.length - activeRiders}</p>
            </div>
            <UserX className="w-10 h-10 text-base-content/20" />
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
            placeholder="Search by name, email, or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-base-100 border border-base-300 focus:border-primary focus:outline-none text-base-content placeholder:text-base-content/40"
          />
        </div>
      </motion.div>

      {/* Riders Grid */}
      {filteredRiders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-base-200 rounded-2xl border border-base-300"
        >
          <Truck className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-base-content mb-2">
            {riders.length === 0 ? "No Approved Riders" : "No Matching Results"}
          </h3>
          <p className="text-base-content/60">
            {riders.length === 0
              ? "Approve rider applications to build your team."
              : "Try adjusting your search criteria."}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredRiders.map((rider, index) => (
            <motion.div
              key={rider._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-base-200 rounded-2xl border border-base-300 overflow-hidden hover:border-primary/30 transition-all duration-300"
            >
              <div className="p-5">
                {/* Rider Header */}
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={rider.image || "/user.png"}
                      alt={rider.fullName}
                      className="w-14 h-14 rounded-xl object-cover"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-base-200 ${
                        rider.isActive ? "bg-success" : "bg-base-300"
                      }`}
                    ></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base-content truncate">{rider.fullName}</h3>
                    <div className="flex items-center gap-1 text-sm text-base-content/60">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{rider.district}</span>
                    </div>
                    <span
                      className={`badge badge-sm mt-2 ${
                        rider.isActive ? "badge-success" : "badge-ghost"
                      }`}
                    >
                      {rider.isActive ? "Active" : "Offline"}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-base-100 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-primary">{rider.totalDeliveries || 0}</p>
                    <p className="text-xs text-base-content/60">Deliveries</p>
                  </div>
                  <div className="bg-base-100 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-success">
                      {rider.rating ? rider.rating.toFixed(1) : "N/A"}
                    </p>
                    <p className="text-xs text-base-content/60">Rating</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mt-4 pt-4 border-t border-base-300">
                  <div className="flex items-center gap-2 text-sm text-base-content/70">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{rider.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-base-content/70">
                    <Phone className="w-4 h-4" />
                    <span>{rider.phone}</span>
                  </div>
                </div>

                {/* Action */}
                <button
                  onClick={() => handleRemove(rider)}
                  disabled={removingId === rider._id}
                  className="btn btn-error btn-outline btn-sm w-full mt-4 gap-1"
                >
                  {removingId === rider._id ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <UserX className="w-4 h-4" />
                      Remove Rider
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ApprovedRiders;
