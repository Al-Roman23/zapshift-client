// Admin Approve Riders Page
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  UserCheck,
  UserX,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Bike,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Search,
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ApproveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [riders, setRiders] = useState([]);
  const [filteredRiders, setFilteredRiders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState(null);

  // Fetch Pending Rider Applications
  useEffect(() => {
    const fetchRiders = async () => {
      try {
        const res = await axiosSecure.get("/riders/pending");
        setRiders(res.data);
        setFilteredRiders(res.data);
      } catch (error) {
        console.error("Failed To Fetch Pending Riders:", error);
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

  // Handle Approve
  const handleApprove = async (rider) => {
    const confirmResult = await Swal.fire({
      title: "Approve Rider?",
      html: `Approve <strong>${rider.fullName}</strong> as a delivery rider?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      confirmButtonText: "Approve",
    });

    if (!confirmResult.isConfirmed) return;

    setProcessingId(rider._id);

    try {
      await axiosSecure.patch(`/riders/${rider._id}/approve`);
      setRiders((prev) => prev.filter((r) => r._id !== rider._id));
      Swal.fire({
        icon: "success",
        title: "Approved!",
        text: `${rider.fullName} is now an active rider.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire("Error!", "Failed to approve rider.", "error");
    } finally {
      setProcessingId(null);
    }
  };

  // Handle Reject
  const handleReject = async (rider) => {
    const { value: reason } = await Swal.fire({
      title: "Rejection Reason",
      html: `Why is <strong>${rider.fullName}</strong>'s application being rejected?`,
      input: "textarea",
      inputPlaceholder: "Enter rejection reason...",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Reject",
      inputValidator: (value) => {
        if (!value) return "Please provide a reason";
      },
    });

    if (!reason) return;

    setProcessingId(rider._id);

    try {
      await axiosSecure.patch(`/riders/${rider._id}/reject`, { reason });
      setRiders((prev) => prev.filter((r) => r._id !== rider._id));
      Swal.fire({
        icon: "info",
        title: "Rejected",
        text: "Rider application has been rejected.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire("Error!", "Failed to reject rider.", "error");
    } finally {
      setProcessingId(null);
    }
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
          <h1 className="text-3xl font-bold text-base-content">Approve Riders</h1>
          <p className="text-base-content/60 mt-1">
            Review and approve rider applications!
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-warning/20 text-warning">
          <Clock className="w-5 h-5" />
          <span className="font-semibold">{riders.length} Pending</span>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
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

      {/* Riders List */}
      {filteredRiders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-base-200 rounded-2xl border border-base-300"
        >
          <CheckCircle className="w-16 h-16 text-success/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-base-content mb-2">
            All Caught Up!
          </h3>
          <p className="text-base-content/60">
            No pending rider applications to review.
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid gap-6"
        >
          {filteredRiders.map((rider, index) => (
            <motion.div
              key={rider._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-base-200 rounded-2xl border border-base-300 overflow-hidden hover:border-primary/30 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={rider.image || "/user.png"}
                      alt={rider.fullName}
                      className="w-24 h-24 rounded-2xl object-cover border-4 border-base-300"
                    />
                  </div>

                  {/* Rider Info */}
                  <div className="flex-1 space-y-4">
                    {/* Name & Email */}
                    <div>
                      <h3 className="text-xl font-bold text-base-content">
                        {rider.fullName}
                      </h3>
                      <div className="flex items-center gap-2 text-base-content/60 mt-1">
                        <Mail className="w-4 h-4" />
                        <span>{rider.email}</span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-info/20 flex items-center justify-center">
                          <Phone className="w-4 h-4 text-info" />
                        </div>
                        <div>
                          <p className="text-xs text-base-content/60">Phone</p>
                          <p className="text-sm font-medium text-base-content">{rider.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-success" />
                        </div>
                        <div>
                          <p className="text-xs text-base-content/60">District</p>
                          <p className="text-sm font-medium text-base-content">{rider.district}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-warning" />
                        </div>
                        <div>
                          <p className="text-xs text-base-content/60">NID</p>
                          <p className="text-sm font-medium text-base-content">{rider.nid}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-base-content/60">License</p>
                          <p className="text-sm font-medium text-base-content">{rider.drivingLicense}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
                          <Bike className="w-4 h-4 text-secondary" />
                        </div>
                        <div>
                          <p className="text-xs text-base-content/60">Bike</p>
                          <p className="text-sm font-medium text-base-content truncate">{rider.bikeBrandModelYear}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <p className="text-xs text-base-content/60">Reg No</p>
                          <p className="text-sm font-medium text-base-content">{rider.bikeRegistrationNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-base-300">
                  <button
                    onClick={() => handleApprove(rider)}
                    disabled={processingId === rider._id}
                    className="btn btn-success gap-2 flex-1 md:flex-none"
                  >
                    {processingId === rider._id ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <>
                        <UserCheck className="w-5 h-5" />
                        Approve
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleReject(rider)}
                    disabled={processingId === rider._id}
                    className="btn btn-error btn-outline gap-2 flex-1 md:flex-none"
                  >
                    <UserX className="w-5 h-5" />
                    Reject
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ApproveRiders;
