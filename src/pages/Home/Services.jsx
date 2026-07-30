// Home Services Section With Theme-Aware Styling
import { motion } from "framer-motion";
import {
  Zap,
  Truck,
  Warehouse,
  Package,
  Building2,
  ArrowLeftRight,
} from "lucide-react";

const Services = () => {
  // Services Configuration
  const services = [
    {
      title: "Express & Standard Delivery",
      description:
        "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available within 4–6 hours.",
      icon: Zap,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Nationwide Delivery",
      description:
        "We cover all 64 districts of Bangladesh. Enjoy reliable delivery in every district, ensuring your products reach customers within 48–72 hours.",
      icon: Truck,
      highlight: true,
    },
    {
      title: "Fulfillment Solution",
      description:
        "Automated pickup with inventory management support, online order processing, packaging, and after-sales support.",
      icon: Warehouse,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Cash on Home Delivery",
      description:
        "COD service for delivery anywhere in Bangladesh with guaranteed safety of your product.",
      icon: Package,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Corporate Service",
      description:
        "Customized corporate services including warehouse and inventory management support.",
      icon: Building2,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
    {
      title: "Parcel Return",
      description:
        "Through our reverse logistics facility, we allow customers to return or exchange products with merchants.",
      icon: ArrowLeftRight,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 rounded-3xl bg-base-200">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-base-content mb-4">
            Our Services
          </h2>
          <p className="text-base-content/70 max-w-3xl mx-auto text-lg sm:text-xl leading-relaxed">
            Fast, reliable parcel delivery with real-time tracking and zero
            hassle. From personal packages to business shipments — we deliver on
            time, every time.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <motion.article
              key={index}
              variants={itemVariants}
              className={`relative rounded-2xl border transition-all duration-300 p-8 text-center flex flex-col items-center hover:shadow-xl ${
                service.highlight
                  ? "bg-primary text-primary-content border-primary scale-105 shadow-lg"
                  : "bg-base-100 border-base-300 hover:border-primary/50"
              }`}
              whileHover={{ y: -5 }}
            >
              <div
                className={`mb-6 p-4 rounded-full ${
                  service.highlight
                    ? "bg-primary-content/20"
                    : service.bgColor || "bg-primary/10"
                }`}
              >
                <service.icon
                  className={`w-10 h-10 ${
                    service.highlight
                      ? "text-primary-content"
                      : service.color || "text-primary"
                  }`}
                />
              </div>

              {service.highlight && (
                <span className="absolute -top-3 -right-3 bg-warning text-warning-content text-xs font-bold px-3 py-1 rounded-full shadow">
                  MOST POPULAR
                </span>
              )}

              <h3
                className={`text-xl sm:text-2xl font-semibold mb-4 ${
                  service.highlight
                    ? "text-primary-content"
                    : "text-base-content"
                }`}
              >
                {service.title}
              </h3>

              <p
                className={`text-sm sm:text-base leading-relaxed ${
                  service.highlight
                    ? "text-primary-content/80"
                    : "text-base-content/70"
                }`}
              >
                {service.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
