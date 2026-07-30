// Admin Delivered Parcels Page
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Search,
  CheckCircle,
  Truck,
  User,
  MapPin,
  Calendar
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const DeliveredParcels = () => {
  const axiosSecure = useAxiosSecure();
  const [parcels, setParcels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Delivered Parcels
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosSecure.get("/parcels/delivered");
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
      parcel.receiverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parcel.riderName?.toLowerCase().includes(searchTerm.toLowerCase());

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
          <h1 className="text-3xl font-bold text-base-content">Delivered Parcels</h1>
          <p className="text-base-content/60 mt-1">
            History of all successful deliveries!
          </p>
        </div>
        <div className="bg-success/10 text-success px-4 py-2 rounded-xl font-medium flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {parcels.length} Delivered
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
            placeholder="Search by sender, receiver, or rider..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-base-100 border border-base-300 focus:border-primary focus:outline-none text-base-content"
          />
        </div>
      </motion.div>

      {/* Parcels Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredParcels.map((parcel, index) => (
            <motion.div
              key={parcel._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-base-200 rounded-2xl border border-base-300 p-5 hover:border-success/30 transition-all"
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                            <Package className="w-5 h-5 text-success" />
                        </div>
                        <div>
                            <h3 className="font-bold text-base-content">{parcel.parcelName}</h3>
                            <p className="text-xs text-base-content/60">ID: {parcel.trackingId}</p>
                        </div>
                    </div>
                    <span className="badge badge-success text-white gap-1">
                        <CheckCircle className="w-3 h-3" /> Delivered
                    </span>
                </div>

                <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                        <User className="w-4 h-4 text-base-content/40 mt-0.5" />
                        <div>
                            <p className="font-medium text-base-content">{parcel.senderName}</p>
                            <p className="text-xs text-base-content/50">Sender</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-base-content/40 mt-0.5" />
                        <div>
                            <p className="font-medium text-base-content">{parcel.receiverName}</p>
                            <p className="text-xs text-base-content/50">{parcel.receiverAddress}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-2">
                        <Truck className="w-4 h-4 text-base-content/40 mt-0.5" />
                        <div>
                            <p className="font-medium text-base-content">{parcel.riderName}</p>
                            <p className="text-xs text-base-content/50">Delivered By</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-base-content/40 mt-0.5" />
                        <div>
                            <p className="font-medium text-base-content">
                                {new Date(parcel.deliveredAt || parcel.updatedAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-base-content/50">Delivery Date</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        ))}
      </div>
      
      {filteredParcels.length === 0 && (
         <div className="text-center py-10 text-base-content/60">
            No delivered parcels found matching your search.
         </div>
      )}
    </div>
  );
};

export default DeliveredParcels;
