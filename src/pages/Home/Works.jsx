// Simple Steps Explaining How It Works
import { motion } from "framer-motion";
import { Package, Truck, MapPin, Briefcase } from "lucide-react";

const Works = () => {
  // Process Steps Configuration
  const steps = [
    {
      icon: Package,
      title: "Booking Pick & Drop",
      description:
        "Schedule your parcel pickups and deliveries effortlessly, anytime, from anywhere – we make sure it reaches safely and on time.",
    },
    {
      icon: Truck,
      title: "Cash on Delivery",
      description:
        "Offer your customers the convenience of paying on delivery with our secure and reliable COD service.",
    },
    {
      icon: MapPin,
      title: "Delivery Hub",
      description:
        "Our strategically located hubs ensure fast, organized, and accurate parcel sorting for timely deliveries across all regions.",
    },
    {
      icon: Briefcase,
      title: "Booking SME & Corporate",
      description:
        "Tailored solutions for businesses, handling bulk shipments and corporate logistics with efficiency and precision.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-16 rounded bg-base-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-base-content">
            How It Works
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <motion.article
              key={index}
              variants={itemVariants}
              className="bg-base-200 rounded-2xl border border-base-300 hover:border-primary/50 transition-all duration-300 p-8 text-center flex flex-col items-center relative hover:shadow-xl"
              whileHover={{ y: -5 }}
            >
              <div className="mb-6 p-4 bg-primary/10 rounded-full">
                <step.icon className="w-10 h-10 text-primary" />
              </div>
              <span className="text-6xl font-bold text-primary/10 absolute -top-4 -right-4 pointer-events-none select-none">
                0{index + 1}
              </span>
              <h3 className="text-xl font-semibold text-base-content mb-4">
                {step.title}
              </h3>
              <p className="text-base-content/70 text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Works;
