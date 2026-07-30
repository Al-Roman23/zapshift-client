// Partner Brands Section
import { useMemo } from "react";
import { motion } from "framer-motion";

const Brands = () => {
  // Partner Brands Configuration
  const brands = useMemo(
    () => [
      { name: "Daraz", logo: "/brands/daraz.png" },
      { name: "Evaly", logo: "/brands/evaly.png" },
      { name: "Pathao", logo: "/brands/pathao.png" },
      { name: "Foodpanda", logo: "/brands/foodpanda.png" },
      { name: "Chaldal", logo: "/brands/chaldal.png" },
    ],
    [],
  );

  return (
    <section className="py-16 bg-base-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-base-content mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Trusted By Leading Brands
        </motion.h2>
        <motion.div
          className="flex flex-wrap justify-center items-center gap-8 md:gap-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {brands.map((brand, index) => (
            <motion.div
              key={index}
              className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-12 md:h-16 object-contain"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Brands;
