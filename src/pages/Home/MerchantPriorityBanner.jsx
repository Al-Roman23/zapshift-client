// Merchant Priority Banner Section
import { motion } from "framer-motion";
import { Link } from "react-router";
import { ArrowRight, Building2 } from "lucide-react";
import merchantBg from "../../assets/be-a-merchant-bg.png";

const MerchantPriorityBanner = () => {
  return (
    <motion.section
      className="py-20 my-10 rounded-3xl bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url(${merchantBg})` }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 "></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
            <Building2 className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Become A Merchant Partner
          </h2>
          <p className="text-white/80 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust ZaP ShifT for their delivery
            needs. Get priority service, dedicated support, and competitive
            rates.
          </p>

          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-content font-semibold rounded-full hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/30"
          >
            Start Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default MerchantPriorityBanner;
