// Admin Assign Riders Page
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  UserPlus,
  MapPin,
  Search,
  Filter,
  ChevronDown,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AssignRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [parcels, setParcels] = useState([]);
  const [riders, setRiders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [assigningId, setAssigningId] = useState(null);

  // Fetch Unassigned Parcels And Available Riders
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [parcelsRes, ridersRes] = await Promise.all([
          axiosSecure.get("/parcels/unassigned"),
          axiosSecure.get("/riders/available"),
        ]);
        setParcels(parcelsRes.data);
        setRiders(ridersRes.data);
      } catch (error) {
        console.error("Failed To Fetch Data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [axiosSecure]);

  // Get Unique Districts (Sender Districts For Pickup Assignment)
  const districts = [...new Set(parcels.map((p) => p.senderDistrict))];

  // Filter Parcels
  const filteredParcels = parcels.filter((parcel) => {
    const matchesSearch =
      parcel.parcelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.receiverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.trackingId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDistrict =
      selectedDistrict === "all" || parcel.senderDistrict === selectedDistrict;

    return matchesSearch && matchesDistrict;
  });

  // Handle Rider Assignment
  const handleAssign = async (parcelId, riderId) => {
    const rider = riders.find((r) => r._id === riderId);

    const confirmResult = await Swal.fire({
      title: "Assign Rider?",
      html: `Assign <strong>${rider?.fullName}</strong> to this delivery?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#A3E635",
      confirmButtonText: "Assign",
    });

    if (!confirmResult.isConfirmed) return;

    setAssigningId(parcelId);

    try {
      await axiosSecure.patch(`/parcels/${parcelId}/assign`, {
        riderId,
        riderEmail: rider.email,
        riderName: rider.fullName || rider.email,
      });
      setParcels((prev) => prev.filter((p) => p._id !== parcelId));
      Swal.fire({
        icon: "success",
        title: "Assigned!",
        text: `Rider ${rider?.fullName} has been assigned.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire("Error!", "Failed to assign rider.", "error");
    } finally {
      setAssigningId(null);
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
          <h1 className="text-3xl font-bold text-base-content">Assign Riders</h1>
          <p className="text-base-content/60 mt-1">
            Assign delivery personnel to pending parcels!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-warning/20 text-warning px-4 py-2 rounded-xl font-medium flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {parcels.length} Pending
          </div>
          <div className="bg-success/20 text-success px-4 py-2 rounded-xl font-medium flex items-center gap-2">
            <Users className="w-5 h-5" />
            {riders.length} Riders
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {districts.slice(0, 4).map((district) => (
          <div
            key={district}
            className="bg-base-200 rounded-xl p-4 border border-base-300"
          >
            <div className="flex items-center gap-2 text-base-content/60 text-sm mb-1">
              <MapPin className="w-4 h-4" />
              {district}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-base-content">
                {parcels.filter((p) => p.senderDistrict === district).length}
              </span>
              <span className="text-sm text-success">
                {getRidersForDistrict(district).length} Riders!
              </span>
            </div>
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
              placeholder="Search parcels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-base-100 border border-base-300 focus:border-primary focus:outline-none text-base-content placeholder:text-base-content/40"
            />
          </div>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="select select-bordered rounded-xl bg-base-100"
          >
            <option value="all">All Districts</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Parcels List */}
      {filteredParcels.length === 0 ? (
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
            No parcels waiting for rider assignment.
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid gap-4"
        >
          {filteredParcels.map((parcel, index) => {
            // Fix: Match Riders By Sender District (Pickup Location)
            const availableRiders = getRidersForDistrict(parcel.senderDistrict);

            return (
              <motion.div
                key={parcel._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-base-200 rounded-2xl border border-base-300 overflow-hidden hover:border-primary/30 transition-all duration-300"
              >
                <div className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Parcel Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-warning" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-lg text-base-content line-clamp-1">
                          {parcel.parcelName}
                        </h3>
                        <p className="text-sm text-base-content/60">
                          Tracking: {parcel.trackingId}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="text-sm text-base-content">
                            {parcel.receiverName} • {parcel.receiverDistrict}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Parcel Cost */}
                    <div className="text-right lg:w-24">
                      <p className="text-base-content/60 text-sm">Cost</p>
                      <p className="text-lg font-bold text-base-content">৳{parcel.cost}</p>
                    </div>

                    {/* Rider Assignment */}
                    <div className="lg:w-64">
                      {availableRiders.length === 0 ? (
                        <div className="flex items-center gap-2 text-error text-sm bg-error/10 rounded-xl px-4 py-3">
                          <AlertCircle className="w-5 h-5" />
                          No riders in {parcel.senderDistrict}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <select
                            className="select select-bordered select-sm flex-1 rounded-xl bg-base-100"
                            onChange={(e) => handleAssign(parcel._id, e.target.value)}
                            defaultValue=""
                            disabled={assigningId === parcel._id}
                          >
                            <option value="" disabled>
                              Select Rider ({availableRiders.length})
                            </option>
                            {availableRiders.map((rider) => (
                              <option key={rider._id} value={rider._id}>
                                {rider.fullName}
                              </option>
                            ))}
                          </select>
                          {assigningId === parcel._id && (
                            <span className="loading loading-spinner loading-sm text-primary"></span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-info/10 border border-info/30 rounded-2xl p-4"
      >
        <h4 className="font-semibold text-info mb-2">💡 Quick Tips</h4>
        <ul className="text-sm text-base-content/70 space-y-1">
          <li>• Parcels are filtered by district to show only available riders in that area!</li>
          <li>• Riders can only deliver within their assigned district!</li>
          <li>• Once assigned, riders will be notified automatically!</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default AssignRiders;
