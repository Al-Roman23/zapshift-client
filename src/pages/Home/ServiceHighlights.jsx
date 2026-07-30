// Service Highlights Section
import { motion } from "framer-motion";
import liveTracking from "../../assets/live-tracking.png";
import safeDelivery from "../../assets/safe-delivery.png";
import locationMerchant from "../../assets/location-merchant.png";

const ServiceHighlights = () => {
  // Highlights Configuration
  const highlights = [
    {
      image: liveTracking,
      title: "Live Tracking",
      description:
        "Track your parcel in real-time with our advanced GPS tracking system.",
    },
    {
      image: safeDelivery,
      title: "Safe Delivery",
      description:
        "Your packages are handled with care and delivered safely to your doorstep.",
    },
    {
      image: locationMerchant,
      title: "Nationwide Coverage",
      description:
        "We deliver to all 64 districts across Bangladesh with reliable service.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-16 bg-base-200 rounded-3xl">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-base-content mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Why Choose ZaP ShifT?
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {highlights.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-base-100 rounded-3xl p-8 text-center border border-base-300 hover:border-primary/50 transition-all duration-300 hover:shadow-xl"
              whileHover={{ y: -5 }}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 mx-auto mb-6"
              />
              <h3 className="text-xl font-semibold text-base-content mb-3">
                {item.title}
              </h3>
              <p className="text-base-content/70">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceHighlights;
