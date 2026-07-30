// Admin Unpaid Parcels Page
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  MapPin,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
  User,
  Mail
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const UnpaidParcels = () => {
  const axiosSecure = useAxiosSecure();
  const [parcels, setParcels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Unpaid Parcels
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosSecure.get("/parcels/unpaid");
        setParcels(res.data);
      } catch (error) {
        console.error("Failed To Fetch Parcels:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [axiosSecure]);

  // Filter Parcels
  const filteredParcels = parcels.filter((parcel) => {
    const matchesSearch =
      parcel.parcelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.senderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.senderEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.receiverName?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
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
          <h1 className="text-3xl font-bold text-base-content">Unpaid Parcels</h1>
          <p className="text-base-content/60 mt-1">
            Overview of parcels waiting for payment!
          </p>
        </div>
        <div className="bg-error/10 text-error px-4 py-2 rounded-xl font-medium flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          {parcels.length} Unpaid
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
            placeholder="Search by sender, receiver, or parcel name..."
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
          <CheckCircle className="w-16 h-16 text-success/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-base-content mb-2">
            No Unpaid Parcels!
          </h3>
          <p className="text-base-content/60">
            All booked parcels have been paid for.
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid gap-4"
        >
          {filteredParcels.map((parcel, index) => (
            <motion.div
              key={parcel._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-base-200 rounded-2xl border border-base-300 overflow-hidden hover:border-primary/30 transition-all duration-300"
            >
              <div className="p-5">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-error" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-lg text-base-content">
                        {parcel.parcelName}
                      </h3>
                      <div className="flex items-center gap-2 text-base-content/60 text-sm mt-1">
                        <User className="w-4 h-4" />
                        Sender: {parcel.senderName} ({parcel.senderEmail})
                      </div>
                      <div className="flex items-center gap-2 text-base-content/60 text-sm mt-1">
                        <MapPin className="w-4 h-4" />
                        From: {parcel.senderDistrict}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-base-content/60 text-sm">
                        <User className="w-4 h-4" />
                        Receiver: {parcel.receiverName}
                      </div>
                      <div className="flex items-center gap-2 text-base-content/60 text-sm mt-1">
                        <MapPin className="w-4 h-4" />
                        To: {parcel.receiverDistrict}
                      </div>
                      <div className="flex items-center gap-2 text-base-content/60 text-sm mt-1">
                         <Clock className="w-4 h-4" />
                         Booked: {new Date(parcel.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Cost */}
                  <div className="text-right min-w-[100px]">
                    <p className="text-base-content/60 text-sm">Amount Due</p>
                    <p className="text-2xl font-bold text-error">৳{parcel.cost}</p>
                    <div className="badge badge-error gap-1 mt-2 text-white">
                      Unpaid
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default UnpaidParcels;
