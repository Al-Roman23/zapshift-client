// Authentication Layout
import { Link } from "react-router";
import { Outlet } from "react-router";
import { motion } from "framer-motion";
import { Package, Truck, Shield, Clock } from "lucide-react";
import authImage from "../assets/authImage.png";
import Logo from "../components/Logo/Logo";
import PageTitle from "../components/Shared/PageTitle";

const AuthLayout = () => {
  // Feature highlights for the illustration side
  const features = [
    { icon: Truck, text: "Fast Nationwide Delivery" },
    { icon: Shield, text: "Secure Package Handling" },
    { icon: Clock, text: "Real-time Tracking" },
  ];

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <PageTitle />
      {/* Header With Logo */}
      <header className="p-6">
        <Link to="/">
          <Logo />
        </Link>
      </header>

      {/* Main Content - Two Column Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 md:px-8 pb-8 overflow-hidden">
        {/* Form Section */}
        <motion.div
          className="flex items-center justify-center rounded-3xl bg-base-200 border border-base-300 p-8 md:p-12 order-2 lg:order-1"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </motion.div>

        {/* Illustration Section */}
        <motion.div
          className="hidden lg:flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 border border-base-300 p-8 md:p-12 order-1 lg:order-2"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Hero Icon */}
          <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
            <Package className="w-10 h-10 text-primary" />
          </div>

          {/* Illustration Image */}
          <img
            src={authImage}
            alt="ZaP ShifT Delivery"
            className="max-w-[280px] object-contain mb-8"
          />

          {/* Tagline */}
          <h2 className="text-2xl font-bold text-base-content text-center mb-4">
            Your Trusted Delivery Partner
          </h2>
          <p className="text-base-content/70 text-center max-w-sm mb-8">
            Fast, reliable parcel delivery across all 64 districts of Bangladesh
          </p>

          {/* Features List */}
          <div className="space-y-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 text-base-content/80"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
