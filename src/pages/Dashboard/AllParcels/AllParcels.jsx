// Admin All Parcels Page
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  MapPin,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
  User,
  Truck,
  XCircle,
  Filter,
  Eye,
  Calendar,
  Phone,
  Weight,
  DollarSign,
  X
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AllParcels = () => {
  const axiosSecure = useAxiosSecure();
  const [parcels, setParcels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedParcel, setSelectedParcel] = useState(null);

  // Fetch All Parcels
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosSecure.get("/parcels/all");
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
      parcel.receiverName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
        statusFilter === "all" || parcel.deliveryStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Helper For Status Badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending": return <span className="badge badge-warning gap-1"><Clock className="w-3 h-3"/> Pending</span>;
      case "assigned": return <span className="badge badge-info gap-1"><Truck className="w-3 h-3"/> Associated</span>;
      case "accepted": return <span className="badge badge-info gap-1"><Truck className="w-3 h-3"/> Accepted</span>;
      case "picking-up": return <span className="badge badge-info gap-1"><Truck className="w-3 h-3"/> Picking Up</span>;
      case "picked-up": return <span className="badge badge-info gap-1"><Truck className="w-3 h-3"/> Picked Up</span>;
      case "in-transit": return <span className="badge badge-info gap-1"><Truck className="w-3 h-3"/> In Transit</span>;
      case "delivered": return <span className="badge badge-success gap-1 text-white"><CheckCircle className="w-3 h-3"/> Delivered</span>;
      case "cancelled": return <span className="badge badge-error gap-1 text-white"><XCircle className="w-3 h-3"/> Cancelled</span>;
      case "rejected": return <span className="badge badge-error gap-1 text-white"><XCircle className="w-3 h-3"/> Rejected</span>;
      default: return <span className="badge badge-ghost">{status}</span>;
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
          <h1 className="text-3xl font-bold text-base-content">All Parcels</h1>
          <p className="text-base-content/60 mt-1">
            Complete list of all parcels in the system!
          </p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-medium flex items-center gap-2">
          <Package className="w-5 h-5" />
          {parcels.length} Total
        </div>
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-base-200 rounded-2xl p-4 border border-base-300 flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
          <input
            type="text"
            placeholder="Search by name, sender, or receiver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-base-100 border border-base-300 focus:border-primary focus:outline-none text-base-content"
          />
        </div>
        <div className="relative min-w-[200px]">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
             <select
                className="select w-full pl-10 rounded-xl bg-base-100 border border-base-300 focus:border-primary"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
             >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
             </select>
        </div>
      </motion.div>

      {/* Parcels List */}
      <div className="overflow-x-auto bg-base-100 rounded-2xl border border-base-300">
        <table className="table w-full">
            <thead className="bg-base-200 text-base-content/70">
                <tr>
                    <th>Parcel</th>
                    <th>Sender</th>
                    <th>Receiver</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Cost</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {filteredParcels.map((parcel) => (
                    <tr key={parcel._id} className="hover:bg-base-200/50 transition-colors">
                        <td>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center">
                                    <Package className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <div className="font-bold">{parcel.parcelName}</div>
                                    <div className="text-xs opacity-50">{parcel.parcelType}</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div>
                                <div className="font-medium">{parcel.senderName}</div>
                                <div className="text-xs opacity-50">{parcel.senderEmail}</div>
                            </div>
                        </td>
                        <td>
                            <div>
                                <div className="font-medium">{parcel.receiverName}</div>
                                <div className="text-xs opacity-50">{parcel.receiverPhone}</div>
                            </div>
                        </td>
                        <td>
                            {getStatusBadge(parcel.deliveryStatus)}
                        </td>
                        <td>
                             {parcel.paymentStatus === 'paid' ? (
                                <span className="text-success font-medium flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> Paid
                                </span>
                             ) : (
                                <span className="text-error font-medium flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" /> Unpaid
                                </span>
                             )}
                        </td>
                        <td className="font-bold">৳{parcel.cost}</td>
                        <th>
                            <button
                                onClick={() => setSelectedParcel(parcel)}
                                className="btn btn-ghost btn-sm text-primary"
                                title="View Details"
                            >
                                <Eye className="w-5 h-5" />
                            </button>
                        </th>
                    </tr>
                ))}
            </tbody>
        </table>
        {filteredParcels.length === 0 && (
            <div className="text-center py-10 text-base-content/60">
                No parcels found.
            </div>
        )}
      </div>

       {/* Details Modal */}
      <AnimatePresence>
        {selectedParcel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-base-100 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
            >
                {/* Modal Header */}
                <div className="p-6 border-b border-base-300 flex justify-between items-start sticky top-0 bg-base-100 z-10">
                   <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                             <Package className="w-6 h-6 text-primary"/>
                             Parcel Details
                        </h2>
                        <p className="text-base-content/60 text-sm mt-1">ID: {selectedParcel._id}</p>
                   </div>
                   <button 
                        onClick={() => setSelectedParcel(null)}
                        className="btn btn-circle btn-ghost btn-sm"
                   >
                       <X className="w-5 h-5"/>
                   </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                    {/* Status Banner */}
                    <div className="flex flex-wrap gap-4 items-center justify-between bg-base-200 p-4 rounded-2xl">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold">Current Status:</span>
                            {getStatusBadge(selectedParcel.deliveryStatus)}
                        </div>
                         <div className="flex items-center gap-2">
                            <span className="font-semibold">Payment:</span>
                            {selectedParcel.paymentStatus === 'paid' ? (
                                <span className="text-success font-bold">Paid</span>
                            ) : (
                                <span className="text-error font-bold">Unpaid</span>
                            )}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Sender Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold flex items-center gap-2 pb-2 border-b border-base-300">
                                <User className="w-5 h-5 text-primary" /> Sender Details
                            </h3>
                            <div className="space-y-3 p-4 bg-base-200/50 rounded-xl">
                                <div>
                                    <div className="text-xs opacity-60">Name</div>
                                    <div className="font-medium">{selectedParcel.senderName}</div>
                                </div>
                                <div>
                                    <div className="text-xs opacity-60">Email</div>
                                    <div className="font-medium">{selectedParcel.senderEmail}</div>
                                </div>
                                <div>
                                    <div className="text-xs opacity-60">Phone</div>
                                    <div className="font-medium">{selectedParcel.senderPhone || "N/A"}</div>
                                </div>
                            </div>
                        </div>

                         {/* Receiver Info */}
                        <div className="space-y-4">
                             <h3 className="text-lg font-bold flex items-center gap-2 pb-2 border-b border-base-300">
                                <MapPin className="w-5 h-5 text-secondary" /> Receiver Details
                            </h3>
                             <div className="space-y-3 p-4 bg-base-200/50 rounded-xl">
                                <div>
                                    <div className="text-xs opacity-60">Name</div>
                                    <div className="font-medium">{selectedParcel.receiverName}</div>
                                </div>
                                <div>
                                    <div className="text-xs opacity-60">Phone</div>
                                    <div className="font-medium">{selectedParcel.receiverPhone}</div>
                                </div>
                                <div>
                                    <div className="text-xs opacity-60">Address</div>
                                    <div className="font-medium">{selectedParcel.receiverAddress}</div>
                                    <a 
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedParcel.receiverAddress}, ${selectedParcel.receiverDistrict}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                                    >
                                        <MapPin className="w-3 h-3" /> View Location
                                    </a>
                                </div>
                                {selectedParcel.deliveryLatitude && selectedParcel.deliveryLongitude && (
                                    <div>
                                        <div className="text-xs opacity-60">Coordinates</div>
                                        <div className="font-mono text-xs">
                                            Lat: {selectedParcel.deliveryLatitude}, Lng: {selectedParcel.deliveryLongitude}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Parcel Info */}
                         <div className="space-y-4">
                             <h3 className="text-lg font-bold flex items-center gap-2 pb-2 border-b border-base-300">
                                <Package className="w-5 h-5 text-accent" /> Shipment Details
                            </h3>
                             <div className="space-y-3 p-4 bg-base-200/50 rounded-xl">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <div className="text-xs opacity-60">Type</div>
                                        <div className="font-medium">{selectedParcel.parcelType}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs opacity-60">Weight</div>
                                        <div className="font-medium">{selectedParcel.parcelWeight} kg</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs opacity-60">Cost</div>
                                    <div className="font-bold text-lg text-primary">৳{selectedParcel.cost}</div>
                                </div>
                                <div>
                                    <div className="text-xs opacity-60">Requested Date</div>
                                    <div className="font-medium">
                                        {selectedParcel.requestedDeliveryDate && !isNaN(new Date(selectedParcel.requestedDeliveryDate).getTime()) 
                                            ? new Date(selectedParcel.requestedDeliveryDate).toLocaleDateString()
                                            : <span className="text-base-content/60 italic">Standard</span>
                                        }
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs opacity-60">Booking Date</div>
                                    <div className="font-medium">
                                        {new Date(selectedParcel.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rider Info (If Assigned) */}
                        <div className="space-y-4">
                             <h3 className="text-lg font-bold flex items-center gap-2 pb-2 border-b border-base-300">
                                <Truck className="w-5 h-5 text-info" /> Rider Details
                            </h3>
                            {selectedParcel.riderId ? (
                                <div className="space-y-3 p-4 bg-base-200/50 rounded-xl">
                                    <div>
                                        <div className="text-xs opacity-60">Rider Name</div>
                                        <div className="font-medium">{selectedParcel.riderName}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs opacity-60">Rider Email</div>
                                        <div className="font-medium">{selectedParcel.riderEmail}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs opacity-60">Rider ID</div>
                                        <div className="font-mono text-xs">{selectedParcel.riderId}</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 bg-base-200/30 rounded-xl text-center text-base-content/40 italic">
                                    No rider assigned yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllParcels;
