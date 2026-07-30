// Admin Rejected Parcels Page
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  XCircle,
  Package,
  Search,
  User,
  MapPin,
  Calendar,
  AlertTriangle,
  RefreshCw,
  UserPlus,
  Bike,
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const RejectedParcels = () => {
  const axiosSecure = useAxiosSecure();
  const [parcels, setParcels] = useState([]);
  const [filteredParcels, setFilteredParcels] = useState([]);
  const [riders, setRiders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRider, setSelectedRider] = useState({});
  const [reassigningId, setReassigningId] = useState(null);

  // Fetch Rejected Parcels And Riders
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [parcelsRes, ridersRes] = await Promise.all([
          axiosSecure.get("/parcels/rejected"),
          axiosSecure.get("/riders/available"),
        ]);
        setParcels(parcelsRes.data);
        setFilteredParcels(parcelsRes.data);
        setRiders(ridersRes.data || []);
      } catch (error) {
        console.error("Failed To Fetch Data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [axiosSecure]);

  // Filter Parcels
  useEffect(() => {
    if (searchTerm) {
      setFilteredParcels(
        parcels.filter(
          (p) =>
            p.parcelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.senderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.receiverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.rejectionReason?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredParcels(parcels);
    }
  }, [searchTerm, parcels]);

  // Handle Re-Assign
  const handleReassign = async (parcelId) => {
    const riderId = selectedRider[parcelId];
    if (!riderId) {
      toast.error("Please select a rider first!");
      return;
    }

    const rider = riders.find((r) => r._id === riderId);
    const confirmResult = await Swal.fire({
      title: "Re-assign Parcel?",
      html: `Assign <strong>${rider?.fullName || rider?.email}</strong> to this parcel?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      confirmButtonText: "Re-assign",
    });

    if (!confirmResult.isConfirmed) return;

    setReassigningId(parcelId);

    try {
      await axiosSecure.patch(`/parcels/${parcelId}/assign`, {
        riderId,
        riderEmail: rider.email,
        riderName: rider.fullName || rider.email,
      });
      
      // Remove From Rejected List
      setParcels((prev) => prev.filter((p) => p._id !== parcelId));
      
      toast.success(`Parcel re-assigned to ${rider?.fullName || rider?.email}!`);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to re-assign.");
    } finally {
      setReassigningId(null);
    }
  };

  // Get Available Riders For District
  const getRidersForDistrict = (district) =>
    riders.filter((r) => r.district === district);

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
          <h1 className="text-3xl font-bold text-base-content">Rejected Parcels</h1>
          <p className="text-base-content/60 mt-1">
            Re-assign parcels that were rejected by riders!
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-error/20 text-error">
          <XCircle className="w-5 h-5" />
          <span className="font-semibold">{parcels.length} Awaiting Re-assignment!</span>
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
            placeholder="Search by parcel, sender, receiver, or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-base-100 border border-base-300 focus:border-primary focus:outline-none text-base-content placeholder:text-base-content/40"
          />
        </div>
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
            {parcels.length === 0 ? "No Rejected Parcels" : "No Matching Results"}
          </h3>
          <p className="text-base-content/60">
            {parcels.length === 0
              ? "Great news! There are no rejected parcels awaiting re-assignment."
              : "Try adjusting your search criteria."}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredParcels.map((parcel, index) => {
            const availableRiders = getRidersForDistrict(parcel.senderDistrict);
            
            return (
              <motion.div
                key={parcel._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-base-200 rounded-2xl border border-error/20 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-error/20 flex items-center justify-center flex-shrink-0">
                        <XCircle className="w-6 h-6 text-error" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-lg text-base-content">
                              {parcel.parcelName}
                            </h3>
                            <p className="text-sm text-base-content/60 font-mono">
                              {parcel.trackingId}
                            </p>
                          </div>
                          <span className="badge badge-error gap-1">
                            <XCircle className="w-3 h-3" />
                            Rejected
                          </span>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" />
                            <div>
                              <p className="text-base-content/60 text-xs">Sender</p>
                              <p className="text-base-content">{parcel.senderName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-success" />
                            <div>
                              <p className="text-base-content/60 text-xs">Receiver</p>
                              <p className="text-base-content">{parcel.receiverName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-info" />
                            <div>
                              <p className="text-base-content/60 text-xs">Amount</p>
                              <p className="text-base-content">৳{parcel.cost}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-warning" />
                            <div>
                              <p className="text-base-content/60 text-xs">Rejected On</p>
                              <p className="text-base-content">
                                {parcel.rejectedAt
                                  ? new Date(parcel.rejectedAt).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Rejection Reason */}
                    {parcel.rejectionReason && (
                      <div className="bg-error/10 rounded-xl p-3 flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-error">Rejection Reason</p>
                          <p className="text-sm text-base-content/70 mt-1">
                            {parcel.rejectionReason}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Re-assign Section */}
                    <div className="bg-base-100 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 text-primary" />
                        <span className="font-medium text-base-content">Re-assign to:</span>
                      </div>
                      
                      <div className="flex-1 flex flex-col md:flex-row items-start md:items-center gap-3">
                        <select
                          value={selectedRider[parcel._id] || ""}
                          onChange={(e) =>
                            setSelectedRider((prev) => ({
                              ...prev,
                              [parcel._id]: e.target.value,
                            }))
                          }
                          className="select select-bordered select-sm w-full md:w-64"
                        >
                          <option value="">
                            {availableRiders.length > 0
                              ? `Select Rider (${parcel.senderDistrict})`
                              : "No riders in this district!"}
                          </option>
                          {availableRiders.map((rider) => (
                            <option key={rider._id} value={rider._id}>
                              {rider.fullName} ({rider.email})
                            </option>
                          ))}
                          {availableRiders.length === 0 && riders.length > 0 && (
                            <optgroup label="Other Districts">
                              {riders.map((rider) => (
                                <option key={rider._id} value={rider._id}>
                                  {rider.fullName} - {rider.district}
                                </option>
                              ))}
                            </optgroup>
                          )}
                        </select>

                        <button
                          onClick={() => handleReassign(parcel._id)}
                          disabled={reassigningId === parcel._id || !selectedRider[parcel._id]}
                          className="btn btn-primary btn-sm gap-2"
                        >
                          {reassigningId === parcel._id ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            <UserPlus className="w-4 h-4" />
                          )}
                          Re-assign
                        </button>
                      </div>
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

export default RejectedParcels;
