// Pricing Plans And Delivery Cost Calculator
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  Zap,
  Truck,
  Clock,
  Building2,
  Check,
  Calculator,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from "lucide-react";

const Pricing = () => {
  // Calculator State
  const [weight, setWeight] = useState(1);
  const [destination, setDestination] = useState("inside-dhaka");
  const [serviceType, setServiceType] = useState("standard");

  // FAQ State
  const [openFaq, setOpenFaq] = useState(null);

  // Pricing Tiers
  const pricingTiers = [
    {
      name: "Standard",
      icon: Truck,
      description: "Reliable next-day delivery for regular shipments!",
      basePrice: 60,
      color: "border-blue-500",
      bgGradient: "from-blue-500/10 to-blue-600/5",
      features: [
        "24-48 Hour Delivery",
        "All 64 Districts",
        "Basic Tracking",
        "SMS Notifications",
        "Standard Packaging",
        "Customer Support",
      ],
      notIncluded: ["Priority Handling", "Insurance", "Dedicated Manager"],
    },
    {
      name: "Express",
      icon: Zap,
      description: "Fast same-day delivery for urgent packages!",
      basePrice: 120,
      color: "border-primary",
      bgGradient: "from-primary/10 to-primary/5",
      popular: true,
      features: [
        "4-6 Hour Delivery",
        "Major Cities",
        "Real-time Tracking",
        "SMS + Email Notifications",
        "Premium Packaging",
        "Priority Support",
        "Priority Handling",
      ],
      notIncluded: ["Insurance", "Dedicated Manager"],
    },
    {
      name: "Same-Day",
      icon: Clock,
      description: "Guaranteed delivery within the same day!",
      basePrice: 180,
      color: "border-orange-500",
      bgGradient: "from-orange-500/10 to-orange-600/5",
      features: [
        "Guaranteed Same-Day",
        "Dhaka Metro",
        "Live GPS Tracking",
        "All Notifications",
        "Premium Packaging",
        "Priority Support",
        "Priority Handling",
        "Up to ৳5,000 Insurance",
      ],
      notIncluded: ["Dedicated Manager"],
    },
    {
      name: "Corporate",
      icon: Building2,
      description: "Custom solutions for high-volume shippers!",
      basePrice: null,
      color: "border-purple-500",
      bgGradient: "from-purple-500/10 to-purple-600/5",
      features: [
        "Custom Delivery Times",
        "All Locations",
        "API Integration",
        "All Notifications",
        "Custom Packaging",
        "24/7 Priority Support",
        "Priority Handling",
        "Full Insurance",
        "Dedicated Manager",
      ],
      notIncluded: [],
    },
  ];

  // Calculate Price
  const calculatedPrice = useMemo(() => {
    const basePrices = {
      "inside-dhaka": { standard: 60, express: 120, "same-day": 180 },
      "outside-dhaka": { standard: 100, express: 180, "same-day": null },
      "remote-area": { standard: 150, express: null, "same-day": null },
    };

    const base = basePrices[destination]?.[serviceType];
    if (!base) return null;

    // Weight Calculation: Base Includes 0.5kg, Then +20tk Per 0.5kg
    const extraWeight = Math.max(0, weight - 0.5);
    const weightCharge = Math.ceil(extraWeight / 0.5) * 20;

    return base + weightCharge;
  }, [weight, destination, serviceType]);

  // FAQ Data
  const faqs = [
    {
      question: "How is the delivery charge calculated?",
      answer:
        "Our delivery charge is based on the weight of your parcel and the destination zone. The base rate includes up to 0.5kg, and additional charges apply per 0.5kg increment. Express and Same-Day services have premium rates for faster delivery.",
    },
    {
      question: "Is there a maximum weight limit?",
      answer:
        "For standard parcels, we accept packages up to 30kg. For heavier shipments, please contact our corporate team for custom logistics solutions.",
    },
    {
      question: "Do you offer Cash on Delivery (COD)?",
      answer:
        "Yes! We offer COD collection services. The COD charge is 1% of the collected amount (minimum ৳10). COD settlements are processed within 24-48 hours after successful delivery.",
    },
    {
      question: "What happens if my parcel is lost or damaged?",
      answer:
        "All Express and Same-Day parcels include basic insurance coverage. For Standard delivery, we recommend adding optional insurance (1% of declared value). Claims are processed within 7 business days.",
    },
    {
      question: "Are there any hidden charges?",
      answer:
        "No hidden charges! The price you see includes pickup, delivery, and basic packaging. Additional services like COD collection, insurance, and special handling are clearly mentioned with their respective charges.",
    },
  ];

  return (
    <div className="py-16 bg-base-100 min-h-screen">
      {/* Hero Section */}
      <motion.section
        className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium mb-4">
          Simple & Transparent
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-base-content mb-6">
          Pricing That <span className="text-primary">Makes Sense</span>
        </h1>
        <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
          No hidden fees, no surprises. Choose the plan that fits your needs and
          only pay for what you use. Volume discounts available for businesses.
        </p>
      </motion.section>

      {/* Pricing Cards */}
      <motion.section
        className="max-w-7xl mx-auto px-6 lg:px-8 mb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              className={`relative flex flex-col bg-gradient-to-br ${tier.bgGradient} rounded-3xl p-6 border-2 ${tier.color} ${
                tier.popular ? "ring-2 ring-primary shadow-xl" : ""
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-primary text-primary-content text-xs font-bold rounded-full whitespace-nowrap">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="mb-6">
                <tier.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-2xl font-bold text-base-content">
                  {tier.name}
                </h3>
                <p className="text-sm text-base-content/60 mt-2">
                  {tier.description}
                </p>
              </div>

              <div className="mb-6">
                {tier.basePrice ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-base-content">
                      ৳{tier.basePrice}
                    </span>
                    <span className="text-base-content/60">/ Parcel</span>
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-primary">
                    Custom Quote
                  </div>
                )}
                <p className="text-xs text-base-content/50 mt-1">
                  Starting From (Up to 0.5KG)
                </p>
              </div>

              <ul className="flex-1 space-y-3 mb-6">
                {tier.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-sm text-base-content/80"
                  >
                    <Check className="w-4 h-4 text-success flex-shrink-0" />
                    {feature}
                  </li>
                ))}
                {tier.notIncluded.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-sm text-base-content/40 line-through"
                  >
                    <Check className="w-4 h-4 text-base-content/30 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to={tier.basePrice ? "/send-parcel" : "/contact"}
                className={`btn w-full ${
                  tier.popular
                    ? "bg-primary hover:bg-primary/90 text-primary-content"
                    : "btn-outline"
                }`}
              >
                {tier.basePrice ? "Get Started" : "Contact Sales"}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Price Calculator */}
      <motion.section
        className="max-w-4xl mx-auto px-6 lg:px-8 mb-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="bg-base-200 rounded-3xl p-8 border border-base-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Calculator className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-base-content">
                Price Calculator
              </h2>
              <p className="text-base-content/60">
                Get an instant quote for your parcel!
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Weight Input */}
            <div>
              <label className="block text-sm font-medium text-base-content mb-2">
                Package Weight (KG)
              </label>
              <input
                type="number"
                min="0.5"
                max="30"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0.5)}
                className="w-full px-4 py-3 rounded-xl bg-base-100 border border-base-300 focus:border-primary focus:outline-none text-base-content"
              />
            </div>

            {/* Destination Select */}
            <div>
              <label className="block text-sm font-medium text-base-content mb-2">
                Destination
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-base-100 border border-base-300 focus:border-primary focus:outline-none text-base-content"
              >
                <option value="inside-dhaka">Inside Dhaka</option>
                <option value="outside-dhaka">Outside Dhaka</option>
                <option value="remote-area">Remote Area</option>
              </select>
            </div>

            {/* Service Type Select */}
            <div>
              <label className="block text-sm font-medium text-base-content mb-2">
                Service Type
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-base-100 border border-base-300 focus:border-primary focus:outline-none text-base-content"
              >
                <option value="standard">Standard (24-48h)</option>
                <option value="express">Express (4-6h)</option>
                <option value="same-day">Same-Day</option>
              </select>
            </div>
          </div>

          {/* Result */}
          <div className="p-6 bg-base-100 rounded-2xl text-center">
            {calculatedPrice ? (
              <>
                <p className="text-sm text-base-content/60 mb-2">
                  Estimated Delivery Cost
                </p>
                <div className="text-5xl font-bold text-primary">
                  ৳{calculatedPrice}
                </div>
                <p className="text-xs text-base-content/50 mt-2">
                  Includes pickup and delivery. COD charges extra (1% of
                  collection).
                </p>
              </>
            ) : (
              <div className="text-base-content/60">
                <HelpCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>
                  This service is not available for the selected destination.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        className="max-w-4xl mx-auto px-6 lg:px-8 mb-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-base-content text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-base-200 rounded-2xl border border-base-300 overflow-hidden"
              initial={false}
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-medium text-base-content pr-4">
                  {faq.question}
                </span>
                {openFaq === index ? (
                  <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-base-content/50 flex-shrink-0" />
                )}
              </button>
              <motion.div
                initial={false}
                animate={{ height: openFaq === index ? "auto" : 0 }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-6 text-base-content/70 leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        className="max-w-7xl mx-auto px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="bg-gradient-to-br from-primary/20 via-base-200 to-secondary/20 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-base-content mb-4">
            Need a Custom Quote?
          </h2>
          <p className="text-lg text-base-content/70 mb-8 max-w-xl mx-auto">
            For high-volume shipping or special requirements, our team will
            create a custom pricing plan that fits your business needs.
          </p>
          <Link
            to="/contact"
            className="btn btn-lg bg-primary text-primary-content"
          >
            Contact Our Team
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default Pricing;
