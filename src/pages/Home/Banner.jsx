// Hero Banner For Homepage With Hero Content
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Package, Truck, Clock, Shield } from "lucide-react";
import deliveryMan from "../../assets/big-deliveryman.png";

const Banner = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const floatVariants = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const statsItems = [
    { icon: Package, value: "50K+", label: "Parcels Delivered" },
    { icon: Truck, value: "500+", label: "Active Riders" },
    { icon: Clock, value: "24/7", label: "Customer Support" },
    { icon: Shield, value: "99.9%", label: "Safe Delivery" },
  ];

  return (
    <section className="relative overflow-hidden bg-base-100 rounded-3xl">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 left-1/3 w-48 h-48 bg-accent/10 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            className="text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-block mb-4">
              <span className="px-4 py-2 bg-primary/20 text-black rounded-full text-sm font-medium border border-primary/30">
                🚀 #1 Courier Service in Bangladesh
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-base-content leading-tight"
            >
              We Make Sure Your{" "}
              <span className="text-accent">Parcel Arrives</span> On Time{" "}
              <span className="text-primary">– No Fuss.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="mt-6 text-lg sm:text-xl text-base-content/70 max-w-xl mx-auto lg:mx-0"
            >
              Enjoy fast, reliable parcel delivery with real-time tracking and
              zero hassle. From personal packages to business shipments — we
              deliver on time, every time.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                to="/parcel-track"
                className="btn btn-lg bg-primary hover:bg-primary/90 text-primary-content border-none shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
              >
                <Package className="w-5 h-5 mr-2" />
                Track Your Parcel
              </Link>
              <Link
                to="/rider"
                className="btn btn-lg btn-outline border-2 border-base-content/20 hover:bg-base-content hover:text-base-100 transition-all duration-300"
              >
                <Truck className="w-5 h-5 mr-2" />
                Be A Rider
              </Link>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              variants={itemVariants}
              className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {statsItems.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center p-4 rounded-2xl bg-base-200/50 backdrop-blur-sm border border-base-300/50"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <stat.icon className="w-6 h-6 mx-auto text-primary mb-2" />
                  <div className="text-xl sm:text-2xl font-bold text-base-content">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-base-content/60">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            className="flex justify-center lg:justify-end relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Decorative Ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-80 h-80 lg:w-96 lg:h-96 rounded-full border-2 border-dashed border-primary/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {/* Floating Image */}
            <motion.img
              src={deliveryMan}
              alt="ZaP ShifT Delivery Rider"
              className="w-full max-w-md lg:max-w-lg drop-shadow-2xl relative z-10"
              variants={floatVariants}
              animate="animate"
            />

            {/* Floating Badges */}
            <motion.div
              className="absolute top-10 right-0 lg:right-10 bg-base-100 shadow-xl rounded-2xl p-3 border border-base-300"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-success" />
                </div>
                <div>
                  <div className="text-xs text-base-content/60">
                    Avg. Delivery
                  </div>
                  <div className="font-bold text-base-content">24-48 Hours</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute bottom-10 left-0 lg:left-10 bg-base-100 shadow-xl rounded-2xl p-3 border border-base-300"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-base-content/60">Secure</div>
                  <div className="font-bold text-base-content">100% Safe</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
