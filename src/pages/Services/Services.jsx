// Shipping And Logistics Services Overview
import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  Zap,
  Truck,
  Warehouse,
  Package,
  Building2,
  ArrowLeftRight,
  Clock,
  Shield,
  MapPin,
  CreditCard,
  Headphones,
  ChevronRight,
} from "lucide-react";

const Services = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Main Services Data
  const services = [
    {
      icon: Zap,
      title: "Express Delivery",
      description:
        "Need it fast? Our express delivery ensures your parcel reaches within 4-6 hours in major cities. Perfect for urgent documents and time-sensitive packages.",
      features: [
        "4-6 Hour Delivery",
        "Real-time Tracking",
        "Priority Handling",
      ],
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      popular: true,
    },
    {
      icon: Truck,
      title: "Standard Delivery",
      description:
        "Reliable next-day delivery service covering all 64 districts of Bangladesh. The most cost-effective solution for your regular shipping needs.",
      features: ["24-48 Hour Delivery", "All 64 Districts", "Affordable Rates"],
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Warehouse,
      title: "Warehouse Services",
      description:
        "Secure warehousing solutions for e-commerce businesses. Store your inventory with us and enjoy seamless order fulfillment and reduced shipping times.",
      features: ["Secure Storage", "Inventory Management", "Bulk Discounts"],
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Package,
      title: "E-commerce Logistics",
      description:
        "End-to-end logistics partner for online businesses. From pickup to delivery with integrated COD collection and daily settlements.",
      features: ["COD Collection", "Daily Settlement", "API Integration"],
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Building2,
      title: "Corporate Solutions",
      description:
        "Tailored logistics solutions for enterprises. Dedicated account managers, custom pricing, and priority support for high-volume shippers.",
      features: ["Dedicated Manager", "Custom Pricing", "Priority Support"],
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
    {
      icon: ArrowLeftRight,
      title: "Return & Exchange",
      description:
        "Hassle-free returns management for e-commerce businesses. We handle returns, exchanges, and reverse logistics with complete transparency.",
      features: ["Easy Returns", "Quality Checks", "Refund Processing"],
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
    },
  ];

  // Why Choose Us Features
  const features = [
    {
      icon: Clock,
      title: "On-Time Guarantee",
      description: "99.9% on-time delivery rate with real-time tracking!",
    },
    {
      icon: Shield,
      title: "Secure Handling",
      description: "Insured packages with careful handling protocols!",
    },
    {
      icon: MapPin,
      title: "Pan-Bangladesh",
      description: "Coverage across all 64 districts and remote areas!",
    },
    {
      icon: CreditCard,
      title: "Flexible Payment",
      description: "Multiple payment options including COD!",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer support via phone and chat!",
    },
    {
      icon: Package,
      title: "Smart Packaging",
      description: "Free packaging materials for fragile items!",
    },
  ];

  return (
    <div className="py-16 bg-base-100">
      {/* Hero Section */}
      <motion.section
        className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium mb-4">
          Our Services
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-base-content mb-6">
          Delivery Solutions for{" "}
          <span className="text-primary">Every Need</span>
        </h1>
        <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
          From urgent express deliveries to comprehensive logistics solutions,
          we've got you covered with reliable, affordable, and professional
          courier services.
        </p>
      </motion.section>

      {/* Services Grid */}
      <motion.section
        className="max-w-7xl mx-auto px-6 lg:px-8 mb-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative group bg-base-200 rounded-3xl p-8 border border-base-300 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 ${
                service.popular ? "ring-2 ring-primary" : ""
              }`}
              whileHover={{ y: -5 }}
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-primary text-primary-content text-xs font-bold rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Icon */}
              <div
                className={`w-16 h-16 ${service.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <service.icon className={`w-8 h-8 ${service.color}`} />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-base-content mb-3">
                {service.title}
              </h3>
              <p className="text-base-content/70 mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center text-sm text-base-content/80"
                  >
                    <ChevronRight className="w-4 h-4 text-primary mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to="/send-parcel"
                className="btn btn-outline btn-primary w-full group-hover:btn-primary transition-all duration-300"
              >
                Get Started
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Why Choose Us */}
      <motion.section
        className="bg-base-200 py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
              Why Choose ZaP ShifT?
            </h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              We combine cutting-edge technology with exceptional service to
              deliver an unmatched courier experience.
            </p>
          </div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-start gap-4 p-6 rounded-2xl bg-base-100 border border-base-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base-content mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-base-content/60">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="max-w-7xl mx-auto px-6 lg:px-8 py-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-base-200 to-secondary/20 rounded-3xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4">
            Ready to Ship Your Parcel?
          </h2>
          <p className="text-lg text-base-content/70 mb-8 max-w-xl mx-auto">
            Join thousands of satisfied customers who trust ZaP ShifT for their
            delivery needs. Get started in minutes!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/send-parcel"
              className="btn btn-lg bg-primary hover:bg-primary/90 text-primary-content"
            >
              Send a Parcel
            </Link>
            <Link to="/pricing" className="btn btn-lg btn-outline">
              View Pricing
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Services;
