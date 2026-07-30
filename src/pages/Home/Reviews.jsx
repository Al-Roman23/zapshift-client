// Customer Reviews Section
import { use } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const Reviews = ({ reviewsPromise }) => {
  // Fetch Reviews Data
  const reviews = use(reviewsPromise) || [];

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
    <section className="py-16 bg-base-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-base-content mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          What Our Customers Say
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {reviews.slice(0, 6).map((review, index) => (
            <motion.div
              key={review.id || index}
              variants={itemVariants}
              className="bg-base-200 rounded-2xl p-8 border border-base-300 hover:border-primary/50 transition-all duration-300 relative hover:shadow-xl"
              whileHover={{ y: -5 }}
            >
              <Quote className="w-10 h-10 absolute top-4 right-4 text-primary/20" />
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={review.user_photoURL || "/user.png"}
                  alt={review.userName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-base-300"
                />
                <div>
                  <h4 className="font-semibold text-base-content">
                    {review.userName}
                  </h4>
                  <p className="text-sm text-base-content/60">
                    Verified Customer
                  </p>
                </div>
              </div>
              <p className="text-base-content/80 italic leading-relaxed">
                "{review.review}"
              </p>
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(review.ratings)
                        ? "text-warning fill-warning"
                        : "text-base-300"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;
