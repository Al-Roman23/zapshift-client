// Payment Cancelled Page
import { Link } from "react-router";
import { motion } from "framer-motion";
import { XCircle, Package, Home, RefreshCw } from "lucide-react";

const PaymentCancelled = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="text-center max-w-md"
      >
        {/* Cancelled Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2, duration: 0.5 }}
        >
          <div className="w-32 h-32 mx-auto rounded-full bg-error/20 flex items-center justify-center">
            <motion.div
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ type: "spring", delay: 0.4, duration: 0.5 }}
            >
              <XCircle className="w-16 h-16 text-error" />
            </motion.div>
          </div>
        </motion.div>

        {/* Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-bold text-base-content mt-8 mb-2"
        >
          Payment Cancelled
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-base-content/60 mb-8"
        >
          Your payment was cancelled. Don't worry, you can try again anytime or return to your parcels.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link to="/dashboard/my-parcels" className="btn btn-primary gap-2">
            <Package className="w-5 h-5" />
            Back To Parcels
          </Link>
          <Link to="/" className="btn btn-ghost gap-2">
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </motion.div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-4 bg-base-200 rounded-xl border border-base-300"
        >
          <p className="text-sm text-base-content/60">
            Having trouble with payment? Contact our support team for assistance.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentCancelled;
