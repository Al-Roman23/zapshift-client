// Contact Page With Form And Business Information
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
  Building2,
  Headphones,
  AlertCircle,
} from "lucide-react";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const formRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      // Prepare Template Parameters
      const templateParams = {
        name: data.name,
        email: data.email,
        phone: data.phone || "Not Provided",
        subject: data.subject,
        message: data.message,
        to_email: "alromanmolla@gmail.com",
      };

      // Send Email Using EmailJS
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log("Email sent successfully:", response);
      setIsSubmitting(false);
      setIsSubmitted(true);
      reset();

      // Reset Success Message After 5 Seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Failed to send email:", error);
      setSubmitError(
        "Failed to send message. Please try again or contact us directly."
      );
      setIsSubmitting(false);
    }
  };

  // Contact Information
  const contactInfo = [
    {
      icon: MapPin,
      title: "Head Office",
      details: [
        "ZaP ShifT Tower, Level 8",
        "Gulshan-2, Dhaka 1212",
        "Bangladesh",
      ],
    },
    {
      icon: Phone,
      title: "Phone",
      details: [
        "Hotline: 23237",
        "Office: +8801319694957",
        "WhatsApp: +8801319694957",
      ],
    },
    {
      icon: Mail,
      title: "Email",
      details: [
        "alromanmolla@gmail.com",
        "support@zapshift.com",
        "business@zapshift.com",
      ],
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: [
        "Saturday - Thursday: 9AM - 8PM",
        "Friday: 2PM - 8PM",
        "Hotline: 24/7",
      ],
    },
  ];

  // Quick Contact Options
  const quickContacts = [
    {
      icon: Headphones,
      title: "Customer Support",
      description:
        "Get help with tracking, delivery issues, or general inquiries!",
      action: "Call 23237",
    },
    {
      icon: Building2,
      title: "Business Inquiries",
      description: "Partnership, corporate solutions, and bulk shipping!",
      action: "business@zapshift.com",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our support team in real-time!",
      action: "Start Chat",
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
          Get In Touch
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-base-content mb-6">
          We'd Love to <span className="text-primary">Hear From You</span>
        </h1>
        <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
          Have questions about our services? Need a custom quote? Or just want
          to say hello? Our team is here to help you every step of the way.
        </p>
      </motion.section>

      {/* Quick Contact Cards */}
      <motion.section
        className="max-w-7xl mx-auto px-6 lg:px-8 mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid md:grid-cols-3 gap-6">
          {quickContacts.map((contact, index) => (
            <motion.div
              key={index}
              className="bg-base-200 rounded-2xl p-6 border border-base-300 hover:border-primary/50 transition-all duration-300 text-center"
              whileHover={{ y: -5 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <contact.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-base-content mb-2">
                {contact.title}
              </h3>
              <p className="text-sm text-base-content/60 mb-4">
                {contact.description}
              </p>
              <span className="text-primary font-medium">{contact.action}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Main Content - Form & Info */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-base-200 rounded-3xl p-8 border border-base-300">
              <h2 className="text-2xl font-bold text-base-content mb-6">
                Send Us a Message
              </h2>

              {isSubmitted ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-base-content mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-base-content/60">
                    We'll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form
                  ref={formRef}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Error Alert */}
                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-error/10 border border-error/30 rounded-xl p-4 flex items-center gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
                      <p className="text-sm text-error">{submitError}</p>
                    </motion.div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-base-content mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        {...register("name", {
                          required: "Name is required",
                          minLength: { value: 2, message: "Name is too short" },
                        })}
                        className={`w-full px-4 py-3 rounded-xl bg-base-100 border ${
                          errors.name ? "border-error" : "border-base-300"
                        } focus:border-primary focus:outline-none text-base-content`}
                        placeholder="Your Name"
                      />
                      {errors.name && (
                        <p className="text-error text-sm mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-base-content mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                        className={`w-full px-4 py-3 rounded-xl bg-base-100 border ${
                          errors.email ? "border-error" : "border-base-300"
                        } focus:border-primary focus:outline-none text-base-content`}
                        placeholder="you@example.com"
                      />
                      {errors.email && (
                        <p className="text-error text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-base-content mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        {...register("phone", {
                          pattern: {
                            value: /^[0-9+\-\s()]*$/,
                            message: "Invalid phone number",
                          },
                        })}
                        className={`w-full px-4 py-3 rounded-xl bg-base-100 border ${
                          errors.phone ? "border-error" : "border-base-300"
                        } focus:border-primary focus:outline-none text-base-content`}
                        placeholder="+880 1XXX-XXXXXX"
                      />
                      {errors.phone && (
                        <p className="text-error text-sm mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-base-content mb-2">
                        Subject *
                      </label>
                      <select
                        {...register("subject", {
                          required: "Please select a subject",
                        })}
                        className={`w-full px-4 py-3 rounded-xl bg-base-100 border ${
                          errors.subject ? "border-error" : "border-base-300"
                        } focus:border-primary focus:outline-none text-base-content`}
                      >
                        <option value="" disabled selected>Select a Topic</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Delivery Support">Delivery Support</option>
                        <option value="Business Partnership">Business Partnership</option>
                        <option value="Corporate Solutions">Corporate Solutions</option>
                        <option value="File a Complaint">File a Complaint</option>
                        <option value="Feedback">Feedback</option>
                      </select>
                      {errors.subject && (
                        <p className="text-error text-sm mt-1">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-base-content mb-2">
                      Message *
                    </label>
                    <textarea
                      {...register("message", {
                        required: "Message is required",
                        minLength: {
                          value: 20,
                          message: "Message is too short",
                        },
                      })}
                      rows={5}
                      className={`w-full px-4 py-3 rounded-xl bg-base-100 border ${
                        errors.message ? "border-error" : "border-base-300"
                      } focus:border-primary focus:outline-none text-base-content resize-none`}
                      placeholder="Tell us how we can help you..."
                    />
                    {errors.message && (
                      <p className="text-error text-sm mt-1">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-lg bg-primary hover:bg-primary/90 text-primary-content w-full disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-base-200 rounded-2xl p-6 border border-base-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base-content mb-2">
                        {info.title}
                      </h3>
                      <div className="space-y-1">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-sm text-base-content/60">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="mt-6 bg-base-200 rounded-2xl p-4 border border-base-300">
              <div className="aspect-video rounded-xl bg-base-300 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-10 h-10 text-base-content/30 mx-auto mb-2" />
                  <p className="text-sm text-base-content/50">
                    Gulshan-2, Dhaka 1212
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
