// Payment History Dashboard Page
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Search,
  Calendar,
  CheckCircle,
  DollarSign,
  Receipt,
  ArrowDownLeft,
  Filter,
  Download,
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Payment History
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axiosSecure.get(`/payments/user/${user.email}`);
        setPayments(res.data);
        setFilteredPayments(res.data);
      } catch (error) {
        console.error("Failed To Fetch Payments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.email) fetchPayments();
  }, [user?.email, axiosSecure]);

  // Filter Payments
  useEffect(() => {
    if (searchTerm) {
      setFilteredPayments(
        payments.filter(
          (p) =>
            p.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.parcelName?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredPayments(payments);
    }
  }, [searchTerm, payments]);

  // Calculate Totals
  const totalSpent = payments.reduce((acc, p) => acc + (p.amount || 0), 0);
  const thisMonthPayments = payments.filter((p) => {
    const paymentDate = new Date(p.createdAt);
    const now = new Date();
    return (
      paymentDate.getMonth() === now.getMonth() &&
      paymentDate.getFullYear() === now.getFullYear()
    );
  });
  const thisMonthTotal = thisMonthPayments.reduce(
    (acc, p) => acc + (p.amount || 0),
    0
  );

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
          <h1 className="text-3xl font-bold text-base-content">Payment History</h1>
          <p className="text-base-content/60 mt-1">
            View all your payment transactions!
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-primary-content">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-content/80 text-sm">Total Spent</p>
              <p className="text-3xl font-bold mt-1">৳{totalSpent.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-info to-info/80 rounded-2xl p-6 text-info-content">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-info-content/80 text-sm">This Month</p>
              <p className="text-3xl font-bold mt-1">৳{thisMonthTotal.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-success to-success/80 rounded-2xl p-6 text-success-content">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-success-content/80 text-sm">Total Transactions</p>
              <p className="text-3xl font-bold mt-1">{payments.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Receipt className="w-6 h-6" />
            </div>
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
            placeholder="Search by transaction ID or parcel name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-base-100 border border-base-300 focus:border-primary focus:outline-none text-base-content placeholder:text-base-content/40"
          />
        </div>
      </motion.div>

      {/* Payments List */}
      {filteredPayments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-base-200 rounded-2xl border border-base-300"
        >
          <CreditCard className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-base-content mb-2">
            {payments.length === 0 ? "No Payments Yet" : "No Matching Payments"}
          </h3>
          <p className="text-base-content/60">
            {payments.length === 0
              ? "Your payment history will appear here after you make a payment."
              : "Try adjusting your search criteria."}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-base-200 rounded-2xl border border-base-300 overflow-hidden"
        >
          <div className="divide-y divide-base-300">
            {filteredPayments.map((payment, index) => (
              <motion.div
                key={payment._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="p-4 hover:bg-base-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center flex-shrink-0">
                    <ArrowDownLeft className="w-6 h-6 text-success" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-base-content">
                          {payment.parcelName || "Payment"}
                        </p>
                        <p className="text-sm text-base-content/60 font-mono truncate">
                          {payment.transactionId}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-success">
                          ৳{payment.amount}
                        </p>
                        <p className="text-xs text-base-content/60">
                          {new Date(payment.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className="badge badge-success gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Paid
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PaymentHistory;
