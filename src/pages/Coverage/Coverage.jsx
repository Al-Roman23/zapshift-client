// Service Coverage Area And Division Districts
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search, Clock, Truck, Building2, Phone } from "lucide-react";

const Coverage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDivision, setSelectedDivision] = useState(null);

  // Bangladesh Divisions Data
  const divisions = [
    {
      name: "Dhaka",
      districts: 13,
      centers: 45,
      deliveryTime: "Same Day - 24h",
      color: "from-blue-500 to-blue-600",
      featured: true,
      areas: [
        "Dhaka City",
        "Gazipur",
        "Narayanganj",
        "Tangail",
        "Manikganj",
        "Munshiganj",
        "Narsingdi",
        "Faridpur",
        "Gopalganj",
        "Kishoreganj",
        "Madaripur",
        "Rajbari",
        "Shariatpur",
      ],
    },
    {
      name: "Chittagong",
      districts: 11,
      centers: 32,
      deliveryTime: "24-48h",
      color: "from-emerald-500 to-emerald-600",
      areas: [
        "Chittagong City",
        "Cox's Bazar",
        "Comilla",
        "Brahmanbaria",
        "Chandpur",
        "Lakshmipur",
        "Noakhali",
        "Feni",
        "Khagrachhari",
        "Rangamati",
        "Bandarban",
      ],
    },
    {
      name: "Rajshahi",
      districts: 8,
      centers: 18,
      deliveryTime: "48-72h",
      color: "from-orange-500 to-orange-600",
      areas: [
        "Rajshahi City",
        "Bogra",
        "Pabna",
        "Sirajganj",
        "Natore",
        "Naogaon",
        "Chapainawabganj",
        "Joypurhat",
      ],
    },
    {
      name: "Khulna",
      districts: 10,
      centers: 22,
      deliveryTime: "48-72h",
      color: "from-teal-500 to-teal-600",
      areas: [
        "Khulna City",
        "Jessore",
        "Satkhira",
        "Bagerhat",
        "Narail",
        "Magura",
        "Kushtia",
        "Chuadanga",
        "Meherpur",
        "Jhenaidah",
      ],
    },
    {
      name: "Sylhet",
      districts: 4,
      centers: 12,
      deliveryTime: "48-72h",
      color: "from-purple-500 to-purple-600",
      areas: ["Sylhet City", "Moulvibazar", "Habiganj", "Sunamganj"],
    },
    {
      name: "Barisal",
      districts: 6,
      centers: 14,
      deliveryTime: "72h",
      color: "from-cyan-500 to-cyan-600",
      areas: [
        "Barisal City",
        "Patuakhali",
        "Bhola",
        "Pirojpur",
        "Jhalokati",
        "Barguna",
      ],
    },
    {
      name: "Rangpur",
      districts: 8,
      centers: 16,
      deliveryTime: "48-72h",
      color: "from-rose-500 to-rose-600",
      areas: [
        "Rangpur City",
        "Dinajpur",
        "Thakurgaon",
        "Panchagarh",
        "Nilphamari",
        "Lalmonirhat",
        "Kurigram",
        "Gaibandha",
      ],
    },
    {
      name: "Mymensingh",
      districts: 4,
      centers: 10,
      deliveryTime: "24-48h",
      color: "from-amber-500 to-amber-600",
      areas: ["Mymensingh City", "Jamalpur", "Sherpur", "Netrokona"],
    },
  ];

  // Filter divisions based on search
  const filteredDivisions = useMemo(() => {
    if (!searchQuery) return divisions;
    const query = searchQuery.toLowerCase();
    return divisions.filter(
      (div) =>
        div.name.toLowerCase().includes(query) ||
        div.areas.some((area) => area.toLowerCase().includes(query)),
    );
  }, [searchQuery]);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Statistics
  const stats = [
    { icon: MapPin, value: "64", label: "Districts Covered" },
    { icon: Building2, value: "169", label: "Service Centers" },
    { icon: Truck, value: "500+", label: "Active Riders" },
    { icon: Clock, value: "24/7", label: "Operations" },
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
          Coverage Area
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-base-content mb-6">
          We Deliver Across <span className="text-primary">All Bangladesh</span>
        </h1>
        <p className="text-xl text-base-content/70 max-w-3xl mx-auto mb-10">
          With service centers in all 64 districts and 8 divisions, your parcel
          is never too far from our reach. Fast, reliable, and everywhere you
          need us.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
          <input
            type="text"
            placeholder="Search by district or area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-base-200 border border-base-300 focus:border-primary focus:outline-none transition-colors text-base-content"
          />
        </div>
      </motion.section>

      {/* Stats Bar */}
      <motion.section
        className="max-w-7xl mx-auto px-6 lg:px-8 mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 rounded-2xl bg-base-200 border border-base-300"
              whileHover={{ scale: 1.02 }}
            >
              <stat.icon className="w-8 h-8 mx-auto text-primary mb-3" />
              <div className="text-3xl font-bold text-base-content">
                {stat.value}
              </div>
              <div className="text-sm text-base-content/60">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Divisions Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
        <h2 className="text-2xl font-bold text-base-content mb-8 text-center">
          Select a Division to View Details
        </h2>
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredDivisions.map((division, index) => (
            <motion.div
              key={division.name}
              variants={itemVariants}
              className={`relative cursor-pointer rounded-3xl p-6 border-2 transition-all duration-300 ${
                selectedDivision?.name === division.name
                  ? "border-primary bg-primary/10 shadow-xl"
                  : "border-base-300 bg-base-200 hover:border-primary/50"
              } ${division.featured ? "ring-2 ring-primary/30" : ""}`}
              onClick={() =>
                setSelectedDivision(
                  selectedDivision?.name === division.name ? null : division,
                )
              }
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              {division.featured && (
                <div className="absolute -top-3 right-4">
                  <span className="px-3 py-1 bg-primary text-primary-content text-xs font-bold rounded-full">
                    HQ
                  </span>
                </div>
              )}

              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${division.color} flex items-center justify-center mb-4`}
              >
                <MapPin className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-xl font-bold text-base-content mb-2">
                {division.name}
              </h3>

              <div className="space-y-1 text-sm text-base-content/70">
                <p>{division.districts} Districts</p>
                <p>{division.centers} Service Centers</p>
                <p className="text-primary font-medium">
                  {division.deliveryTime}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredDivisions.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
            <p className="text-xl text-base-content/70">
              No areas found matching "{searchQuery}"
            </p>
          </div>
        )}
      </section>

      {/* Division Details Modal */}
      <AnimatePresence>
        {selectedDivision && (
          <motion.section
            className="max-w-7xl mx-auto px-6 lg:px-8 mb-16"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="bg-base-200 rounded-3xl p-8 border border-base-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-base-content">
                  {selectedDivision.name} Division Details
                </h3>
                <button
                  onClick={() => setSelectedDivision(null)}
                  className="btn btn-circle btn-ghost"
                >
                  ✕
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Quick Stats */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-base-content mb-3">
                    Quick Info
                  </h4>
                  <div className="flex items-center gap-3 p-3 bg-base-100 rounded-xl">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-base-content/80">
                      Delivery: {selectedDivision.deliveryTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-base-100 rounded-xl">
                    <Building2 className="w-5 h-5 text-primary" />
                    <span className="text-base-content/80">
                      {selectedDivision.centers} Service Centers
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-base-100 rounded-xl">
                    <Phone className="w-5 h-5 text-primary" />
                    <span className="text-base-content/80">Hotline: 16XXX</span>
                  </div>
                </div>

                {/* Districts List */}
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-base-content mb-3">
                    Covered Districts ({selectedDivision.districts})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedDivision.areas.map((area, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-3 bg-base-100 rounded-xl text-sm"
                      >
                        <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-base-content/80 truncate">
                          {area}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <motion.section
        className="max-w-7xl mx-auto px-6 lg:px-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="bg-gradient-to-br from-primary/20 via-base-200 to-secondary/20 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-base-content mb-4">
            Can't Find Your Location?
          </h2>
          <p className="text-lg text-base-content/70 mb-8 max-w-xl mx-auto">
            We're constantly expanding our coverage. Contact us to check if we
            deliver to your specific area or to request coverage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:16XXX"
              className="btn btn-lg bg-primary text-primary-content"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Hotline
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Coverage;
