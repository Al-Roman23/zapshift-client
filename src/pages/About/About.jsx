// About Page
import { motion } from "framer-motion";
import { Target, Eye, Users, MapPin, Truck, Building2 } from "lucide-react";

const About = () => {
  const stats = [
    { number: "1M+", label: "Parcels Delivered", icon: Truck },
    { number: "64", label: "Districts Covered", icon: MapPin },
    { number: "5000+", label: "Active Riders", icon: Users },
    { number: "10K+", label: "Happy Merchants", icon: Building2 },
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
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="py-16 bg-base-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium mb-4">
            About Us
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-base-content mb-6">
            About <span className="text-primary">ZaP ShifT</span>
          </h1>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            Bangladesh's Leading Courier And Delivery Service Provider
          </p>
        </motion.div>

        {/* Mission & Vision Section */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            variants={itemVariants}
            className="bg-base-200 rounded-3xl p-8 border border-base-300 hover:border-primary/50 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-base-content mb-4">
              Our Mission
            </h2>
            <p className="text-base-content/70 leading-relaxed">
              To provide fast, reliable, and affordable delivery services across
              Bangladesh, connecting businesses and customers with seamless
              logistics solutions. We strive to make every delivery experience
              smooth, transparent, and hassle-free.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-base-200 rounded-3xl p-8 border border-base-300 hover:border-primary/50 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-secondary/20 flex items-center justify-center mb-6">
              <Eye className="w-7 h-7 text-secondary" />
            </div>
            <h2 className="text-2xl font-bold text-base-content mb-4">
              Our Vision
            </h2>
            <p className="text-base-content/70 leading-relaxed">
              To become the most trusted and innovative logistics partner in
              Bangladesh, known for exceptional service quality and customer
              satisfaction. We aim to revolutionize the courier industry with
              technology-driven solutions.
            </p>
          </motion.div>
        </motion.div>

        {/* Story Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 rounded-3xl p-12">
            <h2 className="text-3xl font-bold text-base-content mb-6 text-center">
              Our Story
            </h2>
            <div className="max-w-4xl mx-auto text-base-content/70 space-y-4 text-lg leading-relaxed text-center">
              <p>
                ZaP ShifT was founded with a simple mission: to make parcel
                delivery in Bangladesh faster, safer, and more reliable. What
                started as a small operation in Dhaka has grown into a
                nationwide network serving all 64 districts.
              </p>
              <p>
                Today, we're proud to be the trusted logistics partner for
                thousands of e-commerce businesses and individual customers
                across Bangladesh. Our team of dedicated riders works around the
                clock to ensure every parcel reaches its destination on time.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="bg-base-200 rounded-3xl p-12 border border-base-300"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-base-content mb-10 text-center">
            Our Impact
          </h2>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <p className="text-4xl font-bold text-primary">{stat.number}</p>
                <p className="text-base-content/70 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
