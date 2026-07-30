// Payment Page With Stripe Integration
import { useParams, useNavigate, Link } from "react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  CreditCard,
  Package,
  MapPin,
  User,
  Shield,
  Lock,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useTheme } from "../../../contexts/ThemeContext";
import Swal from "sweetalert2";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

// Checkout Form Component
const CheckoutForm = ({ parcel, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { theme } = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const cardStyle = {
    style: {
      base: {
        fontSize: "16px",
        color: theme === "dark" ? "#fff" : "#1f2937",
        fontFamily: '"Inter", system-ui, sans-serif',
        "::placeholder": { color: theme === "dark" ? "#6b7280" : "#9ca3af" },
        iconColor: theme === "dark" ? "#a3e635" : "#65a30d",
      },
      invalid: {
        color: "#ef4444",
        iconColor: "#ef4444",
      },
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      }
    );

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: error.message,
      });
      setIsProcessing(false);
    } else if (paymentIntent.status === "succeeded") {
      // Update Payment Status
      // Save Payment To Database
      await axiosSecure.post("/payments/confirm", {
        parcelId: parcel._id,
        transactionId: paymentIntent.id,
        amount: parcel.cost,
        parcelName: parcel.parcelName,
      });

      navigate("/dashboard/payment-success");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-base-content/70">Card Details</label>
        <div className="bg-base-100 border border-base-300 rounded-xl p-4 focus-within:border-primary transition-colors">
          <CardElement
            options={cardStyle}
            onChange={(e) => setCardComplete(e.complete)}
          />
        </div>
      </div>

      {/* Security Note */}
      <div className="flex items-center gap-2 text-sm text-base-content/60">
        <Lock className="w-4 h-4" />
        <span>Your payment is secured with SSL encryption!</span>
      </div>

      {/* Pay Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing || !cardComplete}
        className="btn btn-primary w-full gap-2"
      >
        {isProcessing ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Pay ৳{parcel.cost}
          </>
        )}
      </button>

      {/* Back Link */}
      <Link
        to="/dashboard/my-parcels"
        className="btn btn-ghost w-full gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        Cancel Payment
      </Link>
    </form>
  );
};

// Main Payment Page
const Payment = () => {
  const { parcelId } = useParams();
  const axiosSecure = useAxiosSecure();
  const [parcel, setParcel] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchParcelAndIntent = async () => {
      try {
        // Fetch Parcel Details
        const parcelRes = await axiosSecure.get(`/parcels/${parcelId}`);
        setParcel(parcelRes.data);

        // Create Payment Intent
        const intentRes = await axiosSecure.post("/payments/create-intent", {
          amount: parcelRes.data.cost,
          parcelId,
        });
        setClientSecret(intentRes.data.clientSecret);
      } catch (error) {
        console.error("Failed To Initialize Payment:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchParcelAndIntent();
  }, [parcelId, axiosSecure]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!parcel) {
    return (
      <div className="p-6">
        <div className="text-center py-16 bg-base-200 rounded-2xl border border-base-300">
          <Package className="w-16 h-16 text-base-content/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-base-content mb-2">
            Parcel Not Found
          </h3>
          <p className="text-base-content/60 mb-4">
            The parcel you're trying to pay for doesn't exist.
          </p>
          <Link to="/dashboard/my-parcels" className="btn btn-primary">
            Back to My Parcels
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
            <CreditCard className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-base-content">Complete Payment</h1>
          <p className="text-base-content/60 mt-1">
            Secure payment powered by Stripe
          </p>
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-base-200 rounded-2xl border border-base-300 overflow-hidden"
        >
          <div className="p-5 border-b border-base-300">
            <h2 className="font-semibold text-base-content">Order Summary</h2>
          </div>
          <div className="p-5 space-y-4">
            {/* Parcel Info */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-base-content">{parcel.parcelName}</p>
                <p className="text-sm text-base-content/60 font-mono">{parcel.trackingId}</p>
              </div>
            </div>

            {/* Receiver */}
            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-base-content/40" />
              <span className="text-base-content/60">Receiver:</span>
              <span className="text-base-content">{parcel.receiverName}</span>
            </div>

            {/* Destination */}
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-base-content/40" />
              <span className="text-base-content/60">Destination:</span>
              <span className="text-base-content">{parcel.receiverDistrict}</span>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-base-300 flex items-center justify-between">
              <span className="text-base-content/60">Total Amount</span>
              <span className="text-2xl font-bold text-primary">৳{parcel.cost}</span>
            </div>
          </div>
        </motion.div>

        {/* Payment Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-base-200 rounded-2xl border border-base-300 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-success" />
            <span className="font-semibold text-base-content">Secure Payment</span>
          </div>
          
          {clientSecret && (
            <Elements stripe={stripePromise}>
              <CheckoutForm parcel={parcel} clientSecret={clientSecret} />
            </Elements>
          )}
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-6 text-sm text-base-content/50"
        >
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-1">
            <Lock className="w-4 h-4" />
            <span>Encrypted</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            <span>Protected</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Payment;
