// Payment Success Page
import { Link } from "react-router";
import { motion } from "framer-motion";
import { CheckCircle, Package, MapPin, ArrowRight, Sparkles } from "lucide-react";

const PaymentSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="text-center max-w-md"
      >
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2, duration: 0.5 }}
          className="relative"
        >
          <div className="w-32 h-32 mx-auto rounded-full bg-success/20 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.4, duration: 0.5 }}
            >
              <CheckCircle className="w-16 h-16 text-success" />
            </motion.div>
          </div>
          {/* Sparkles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-8 h-8 text-warning" />
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-bold text-base-content mt-8 mb-2"
        >
          Payment Successful! 🎉
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-base-content/60 mb-8"
        >
          Your payment has been processed successfully. Your parcel will be picked up soon!
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
            View My Parcels
          </Link>
          <Link to="/parcel-track" className="btn btn-ghost gap-2">
            <MapPin className="w-5 h-5" />
            Track Parcel
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-4 bg-base-200 rounded-xl border border-base-300"
        >
          <p className="text-sm text-base-content/60">
            A confirmation email has been sent to your registered email address.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
