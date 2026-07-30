// Blog Page With Shipping And Logistics Articles
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { Clock, User, Tag, ArrowRight, Search } from "lucide-react";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Categories
  const categories = [
    { id: "all", label: "All Posts" },
    { id: "tips", label: "Tips & Guides" },
    { id: "business", label: "Business Insights" },
    { id: "news", label: "Industry News" },
    { id: "howto", label: "How-To" },
  ];

  // Blog Articles Data
  const articles = [
    {
      id: 1,
      title: "How to Package Fragile Items for Safe Delivery",
      excerpt:
        "Learn the essential techniques to ensure your delicate items arrive in perfect condition. From choosing the right materials to proper cushioning methods.",
      category: "tips",
      author: "Shipping Team",
      date: "2026-01-28",
      readTime: "5 min read",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
      featured: true,
      content: `
        Shipping fragile items requires extra care and attention. Here's what you need to know:

        **Choose the Right Box**
        Always use a box that's slightly larger than your item. This allows room for cushioning material. Never reuse damaged boxes as they've lost their structural integrity.

        **Cushioning Is Key**
        Use bubble wrap, foam peanuts, or air pillows to create a protective barrier. Wrap each fragile item individually and ensure there's at least 2 inches of cushioning on all sides.

        **Mark Your Package Clearly**
        Use "FRAGILE" and "HANDLE WITH CARE" stickers on all sides of the box. At ZaP ShifT, we prioritize packages with fragile markings for gentler handling.

        **Consider Insurance**
        For valuable fragile items, always opt for our insurance coverage. It's a small price to pay for peace of mind.
      `,
    },
    {
      id: 2,
      title: "Same-Day vs Next-Day Delivery: Which One Fits Your Business?",
      excerpt:
        "A comprehensive comparison of delivery options to help you make the right choice for your e-commerce business and customer expectations.",
      category: "business",
      author: "Business Solutions",
      date: "2026-01-25",
      readTime: "6 min read",
      image:
        "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&h=400&fit=crop",
      content: `
        Choosing the right delivery option can make or break your customer experience. Let's break down when to use each service:

        **Same-Day Delivery**
        Best for: Urgent documents, perishable goods, last-minute gifts, high-value customers
        Cost: Higher, but justifies premium products
        Coverage: Limited to major metro areas (Dhaka, Chittagong)

        **Next-Day Delivery**
        Best for: Regular e-commerce orders, non-urgent packages, cost-conscious customers
        Cost: More affordable, suitable for standard margins
        Coverage: All 64 districts

        **The Hybrid Approach**
        Many successful businesses offer both options at checkout, letting customers choose based on their urgency and budget. This flexibility can increase conversion rates by up to 20%.

        **Our Recommendation**
        Start with next-day delivery as your standard, then offer same-day as a premium option for an additional fee. Monitor which customers choose what, and adjust your pricing strategy accordingly.
      `,
    },
    {
      id: 3,
      title: "The Rise of E-Commerce Logistics in Bangladesh",
      excerpt:
        "Exploring the rapid growth of online shopping and how logistics infrastructure is evolving to meet the increasing demand for fast, reliable delivery.",
      category: "news",
      author: "Industry Analyst",
      date: "2026-01-20",
      readTime: "7 min read",
      image:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop",
      content: `
        Bangladesh's e-commerce sector has experienced unprecedented growth, with the market size reaching over $3 billion in 2025. This growth has put immense pressure on logistics infrastructure.

        **Key Statistics**
        - E-commerce grew 45% year-over-year
        - Daily parcel volume exceeded 500,000 packages
        - Rural delivery demand increased by 60%

        **Challenges Facing the Industry**
        1. Last-mile delivery in rural areas
        2. Cash-on-delivery collection and settlement
        3. Return logistics management
        4. Seasonal demand spikes (Eid, etc.)

        **How ZaP ShifT Is Responding**
        We've invested in expanding our network to cover all 64 districts with dedicated hubs in each division. Our technology platform provides real-time tracking and automated notifications, meeting the expectations of modern shoppers.

        **Looking Ahead**
        The future is bright for Bangladesh's logistics sector. With continued investment in infrastructure and technology, we're positioned to support the next phase of e-commerce growth.
      `,
    },
    {
      id: 4,
      title: "5 Tips to Reduce Delivery Delays During Peak Season",
      excerpt:
        "Peak seasons like Eid can overwhelm delivery networks. Here's how merchants can prepare and minimize delays for their customers.",
      category: "tips",
      author: "Operations Team",
      date: "2026-01-15",
      readTime: "4 min read",
      image:
        "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=600&h=400&fit=crop",
      content: `
        Peak seasons test even the best logistics networks. Here's how to stay ahead:

        **1. Ship Early**
        Don't wait until the last minute. During Eid season, delivery times can extend by 1-2 days. Encourage customers to order early with early-bird discounts.

        **2. Communicate Proactively**
        Set clear expectations on your website about extended delivery times during peak periods. Customers appreciate honesty over surprise delays.

        **3. Choose the Right Service Level**
        For time-sensitive orders during peak season, opt for Express delivery to ensure priority handling.

        **4. Prepare Your Inventory**
        Stock your bestsellers and pre-package popular items. This reduces your fulfillment time and gets parcels to us faster.

        **5. Work with Your Courier Partner**
        Contact ZaP ShifT's merchant support before peak season to discuss your expected volume. We can arrange dedicated pickup slots and priority processing.
      `,
    },
    {
      id: 5,
      title: "Cash on Delivery vs Prepaid: Pros and Cons for Merchants",
      excerpt:
        "Understand the trade-offs between COD and prepaid payments to optimize your checkout flow and reduce returns and fraud.",
      category: "business",
      author: "Payment Solutions",
      date: "2026-01-10",
      readTime: "5 min read",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      content: `
        Payment method choices significantly impact your business metrics. Let's analyze both options:

        **Cash on Delivery (COD)**
        Pros:
        - Higher conversion rates (customers trust more)
        - Reaches customers without cards/mobile banking
        - Preferred by first-time online shoppers

        Cons:
        - Higher return/rejection rates (15-20% industry average)
        - Delayed cash flow (settlement takes 24-48h)
        - COD collection charges (1% of amount)

        **Prepaid Payments**
        Pros:
        - Lower return rates (<5%)
        - Immediate cash flow
        - Committed customers

        Cons:
        - Lower conversion rates
        - Requires payment gateway integration
        - Transaction fees (2-3%)

        **Our Recommendation**
        Offer both options but incentivize prepaid orders with small discounts (e.g., "Pay online and save ৳20"). This gradually shifts customer behavior while maintaining high conversion rates.

        **ZaP ShifT COD Service**
        We offer competitive COD collection at just 1% (min ৳10) with daily settlements to your bank account. Our riders are trained in cash handling and verification.
      `,
    },
    {
      id: 6,
      title: "Tracking Your Parcel: A Complete Guide",
      excerpt:
        "Everything you need to know about using ZaP ShifT's tracking system to monitor your parcel's journey from pickup to delivery.",
      category: "howto",
      author: "Customer Support",
      date: "2026-01-05",
      readTime: "4 min read",
      image:
        "https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&h=400&fit=crop",
      content: `
        Never wonder where your parcel is again. Here's how to track with ZaP ShifT:

        **Getting Your Tracking ID**
        After booking a parcel, you'll receive a unique tracking ID via SMS and email. It looks like: ZS-XXXXXXXX. Keep this safe!

        **Ways to Track**
        1. **Website**: Visit our Track Parcel page and enter your ID
        2. **SMS**: Send your tracking ID to 16XXX
        3. **App**: Use our mobile app for real-time notifications
        4. **WhatsApp**: Message us with your tracking ID

        **Understanding Status Updates**
        - **Picked Up**: Rider has collected your parcel
        - **In Transit**: Parcel is moving between hubs
        - **Out for Delivery**: Rider is on the way to deliver
        - **Delivered**: Successfully delivered to recipient
        - **Returned**: Delivery attempt failed, parcel returning

        **Notifications**
        We send automatic updates at each stage via SMS. For detailed tracking history, use our website or app.

        **Need Help?**
        If your parcel seems stuck at any stage for more than expected duration, contact our support team. We'll investigate and update you immediately.
      `,
    },
  ];

  // Filter articles
  const filteredArticles = useMemo(() => {
    let result = articles;

    if (selectedCategory !== "all") {
      result = result.filter((a) => a.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.excerpt.toLowerCase().includes(query),
      );
    }

    return result;
  }, [selectedCategory, searchQuery]);

  const featuredArticle = articles.find((a) => a.featured);

  // Animation Variants
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
    <div className="py-16 bg-base-100 min-h-screen">
      {/* Hero Section */}
      <motion.section
        className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium mb-4">
          ZaP ShifT Blog
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-base-content mb-6">
          Insights & <span className="text-primary">Updates</span>
        </h1>
        <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
          Tips, guides, and industry news to help you ship smarter and grow your
          business.
        </p>
      </motion.section>

      {/* Featured Article */}
      {featuredArticle && (
        <motion.section
          className="max-w-7xl mx-auto px-6 lg:px-8 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative rounded-3xl overflow-hidden bg-base-200 border border-base-300">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative h-64 lg:h-auto">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-primary text-primary-content text-sm font-bold rounded-full">
                    Featured
                  </span>
                </div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-sm text-base-content/60 mb-4">
                  <span className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    {
                      categories.find((c) => c.id === featuredArticle.category)
                        ?.label
                    }
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {featuredArticle.readTime}
                  </span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-base-content mb-4">
                  {featuredArticle.title}
                </h2>
                <p className="text-base-content/70 mb-6 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-base-content/60">
                    <User className="w-4 h-4" />
                    {featuredArticle.author}
                  </div>
                  <Link
                    to={`/blog/${featuredArticle.id}`}
                    className="btn btn-primary"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-primary text-primary-content"
                    : "bg-base-200 text-base-content hover:bg-base-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 rounded-xl bg-base-200 border border-base-300 focus:border-primary focus:outline-none text-base-content"
            />
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <motion.section
        className="max-w-7xl mx-auto px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles
              .filter((a) => !a.featured)
              .map((article) => (
                <motion.article
                  key={article.id}
                  variants={itemVariants}
                  className="group bg-base-200 rounded-2xl overflow-hidden border border-base-300 hover:border-primary/50 transition-all duration-300 hover:shadow-xl"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-base-content/60 mb-3">
                      <span className="px-2 py-1 bg-base-300 rounded-full">
                        {
                          categories.find((c) => c.id === article.category)
                            ?.label
                        }
                      </span>
                      <span>{article.readTime}</span>
                    </div>
                    <h3 className="text-lg font-bold text-base-content mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-base-content/60 mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-base-content/50">
                        {article.date}
                      </span>
                      <Link
                        to={`/blog/${article.id}`}
                        className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
            <h3 className="text-xl font-semibold text-base-content mb-2">
              No articles found
            </h3>
            <p className="text-base-content/60">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </motion.section>
    </div>
  );
};

export default Blog;
