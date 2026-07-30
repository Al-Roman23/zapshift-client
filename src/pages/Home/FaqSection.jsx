// Common Questions And Answers Section
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  // FAQ Configuration
  const faqs = [
    {
      question: "How long does delivery take?",
      answer:
        "Standard delivery takes 24-72 hours within major cities and 48-72 hours for nationwide delivery. Express delivery is available within 4-6 hours in selected areas.",
    },
    {
      question: "How can I track my parcel?",
      answer:
        "You can track your parcel using the tracking ID provided at booking. Simply visit our Track Parcel page and enter your tracking number.",
    },
    {
      question: "What are your delivery charges?",
      answer:
        "Delivery charges vary based on weight, dimensions, and destination. Use our price calculator or contact support for exact pricing.",
    },
    {
      question: "Do you offer Cash on Delivery (COD)?",
      answer:
        "Yes, we offer COD service across Bangladesh. Payment is collected upon delivery and remitted to your account within 24-48 hours.",
    },
    {
      question: "How do I become a delivery rider?",
      answer:
        "Visit our 'Be A Rider' page and fill out the application form. Our team will review your application and contact you within 48 hours.",
    },
  ];

  return (
    <section className="py-16 bg-base-200 rounded-3xl">
      <div className="max-w-3xl mx-auto px-6">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-base-content mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-base-200/50 transition-colors"
              >
                <span className="font-semibold text-base-content pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-base-content/70 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
