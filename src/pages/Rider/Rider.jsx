// Rider Application And Registration Page
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Bike,
  CreditCard,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  DollarSign,
  Clock,
  Shield,
  Zap,
  AlertCircle,
  Send,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useLoaderData } from "react-router";
import riderImage from "../../assets/agent-pending.png";
import Swal from "sweetalert2";

const Rider = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ defaultValues: { region: "", district: "" } });

  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const loaderData = useLoaderData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoize Regions
  const regions = useMemo(() => {
    if (!loaderData) return [];
    return [...new Set(loaderData.map((c) => c.region))];
  }, [loaderData]);

  // Watch Selected Region For District Filtering
  const selectedRegion = useWatch({
    control,
    name: "region",
    defaultValue: "",
  });

  // Get Districts By Region
  const getDistricts = (region) => {
    if (!region) return [];
    return [
      ...new Set(
        loaderData.filter((c) => c.region === region).map((d) => d.district)
      ),
    ];
  };

  // Handle Rider Application Submission
  const handleApplication = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await Swal.fire({
        title: "Confirm Application",
        html: `
          <p class="text-base-content/70">You're about to submit your rider application with the following details:</p>
          <div class="text-left mt-4 space-y-1">
            <p><strong>Name:</strong> ${data.fullName}</p>
            <p><strong>District:</strong> ${data.district}</p>
            <p><strong>Vehicle:</strong> ${data.bikeBrandModelYear}</p>
          </div>
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#A3E635",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Submit Application",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) {
        setIsSubmitting(false);
        return;
      }

      const riderData = {
        ...data,
        image: user?.photoURL,
        status: "pending",
        createdAt: new Date(),
      };
      const res = await axiosSecure.post("/riders", riderData);

      if (res.data.id || res.data.insertedId) {
        await Swal.fire({
          icon: "success",
          title: "Application Submitted! 🎉",
          text: "Your rider application is under review. We'll contact you soon!",
          timer: 3000,
          showConfirmButton: false,
        });
      } else {
        throw new Error("Rider application submission failed!");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      Swal.fire(
        "Submission Failed",
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Benefits Data
  const benefits = [
    {
      icon: DollarSign,
      title: "Great Earnings",
      description: "Earn ৳50 per delivery with weekly payouts!",
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Work when you want, as much as you want!",
    },
    {
      icon: Shield,
      title: "Insurance Coverage",
      description: "We've got you covered while you're on duty!",
    },
    {
      icon: Zap,
      title: "Instant Payments",
      description: "Get paid quickly after each delivery!",
    },
  ];

  // Requirements
  const requirements = [
    "Valid driving license!",
    "Own a motorcycle or bicycle!",
    "National ID card!",
    "Smartphone with internet!",
    "Age 18 or above!",
  ];

  return (
    <div className="min-h-screen bg-base-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-8 md:p-12 mb-8"
        >
          {/* Decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div className="text-primary-content">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6"
              >
                <Bike className="w-8 h-8" />
              </motion.div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Become A Rider
              </h1>
              <p className="text-primary-content/80 text-lg mb-6">
                Join our team of reliable delivery riders and start earning with
                ZaP ShifT. Flexible hours, great pay!
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold">৳50+</p>
                  <p className="text-sm text-primary-content/70">Per Delivery</p>
                </div>
                <div className="text-center border-x border-white/20">
                  <p className="text-2xl md:text-3xl font-bold">500+</p>
                  <p className="text-sm text-primary-content/70">Active Riders</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold">24/7</p>
                  <p className="text-sm text-primary-content/70">Support</p>
                </div>
              </div>
            </div>

            <div className="hidden md:flex justify-center">
              <img
                src={riderImage}
                alt="Become a Rider"
                className="w-full max-w-xs drop-shadow-2xl"
              />
            </div>
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-base-200 rounded-2xl p-4 border border-base-300 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-base-content mb-1">
                {benefit.title}
              </h3>
              <p className="text-xs text-base-content/60">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Application Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit(handleApplication)} className="space-y-6">
              {/* Personal Information */}
              <div className="bg-base-200 rounded-2xl border border-base-300 p-6">
                <h2 className="text-xl font-bold text-base-content mb-6 flex items-center gap-2">
                  <User className="w-6 h-6 text-primary" />
                  Personal Information
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-base-content/70 mb-2 block">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                      <input
                        type="text"
                        className={`input w-full pl-10 bg-base-100 ${
                          errors.fullName ? "border-error" : "border-base-300"
                        } focus:border-primary`}
                        {...register("fullName", { required: "Full name is required" })}
                        defaultValue={user?.displayName}
                        placeholder="Your full name"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-error text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-base-content/70 mb-2 block">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                      <input
                        type="email"
                        className={`input w-full pl-10 bg-base-100 ${
                          errors.email ? "border-error" : "border-base-300"
                        } focus:border-primary`}
                        {...register("email", { required: "Email is required" })}
                        defaultValue={user?.email}
                        placeholder="your@email.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-error text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-base-content/70 mb-2 block">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                      <input
                        type="tel"
                        className={`input w-full pl-10 bg-base-100 ${
                          errors.phone ? "border-error" : "border-base-300"
                        } focus:border-primary`}
                        {...register("phone", { required: "Phone number is required" })}
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-error text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-base-content/70 mb-2 block">
                      NID Number *
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                      <input
                        type="text"
                        className={`input w-full pl-10 bg-base-100 ${
                          errors.nid ? "border-error" : "border-base-300"
                        } focus:border-primary`}
                        {...register("nid", { required: "NID is required" })}
                        placeholder="National ID number"
                      />
                    </div>
                    {errors.nid && (
                      <p className="text-error text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.nid.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-base-content/70 mb-2 block">
                      Region *
                    </label>
                    <select
                      className={`select w-full bg-base-100 ${
                        errors.region ? "border-error" : "border-base-300"
                      } focus:border-primary`}
                      {...register("region", { required: "Region is required" })}
                    >
                      <option value="">Select Region</option>
                      {regions.map((r, i) => (
                        <option key={i} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    {errors.region && (
                      <p className="text-error text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.region.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-base-content/70 mb-2 block">
                      District *
                    </label>
                    <select
                      className={`select w-full bg-base-100 ${
                        errors.district ? "border-error" : "border-base-300"
                      } focus:border-primary`}
                      {...register("district", { required: "District is required" })}
                      disabled={!selectedRegion}
                    >
                      <option value="">Select District</option>
                      {getDistricts(selectedRegion).map((d, i) => (
                        <option key={i} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    {errors.district && (
                      <p className="text-error text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.district.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="bg-base-200 rounded-2xl border border-base-300 p-6">
                <h2 className="text-xl font-bold text-base-content mb-6 flex items-center gap-2">
                  <Bike className="w-6 h-6 text-primary" />
                  Vehicle Information
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-base-content/70 mb-2 block">
                      Driving License Number *
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                      <input
                        type="text"
                        className={`input w-full pl-10 bg-base-100 ${
                          errors.drivingLicense ? "border-error" : "border-base-300"
                        } focus:border-primary`}
                        {...register("drivingLicense", {
                          required: "License is required",
                        })}
                        placeholder="DL-XXXXXXXXXX"
                      />
                    </div>
                    {errors.drivingLicense && (
                      <p className="text-error text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.drivingLicense.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-base-content/70 mb-2 block">
                      Bike Registration Number *
                    </label>
                    <div className="relative">
                      <Bike className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                      <input
                        type="text"
                        className={`input w-full pl-10 bg-base-100 ${
                          errors.bikeRegistrationNumber ? "border-error" : "border-base-300"
                        } focus:border-primary`}
                        {...register("bikeRegistrationNumber", {
                          required: "Registration is required",
                        })}
                        placeholder="XX-XXXX"
                      />
                    </div>
                    {errors.bikeRegistrationNumber && (
                      <p className="text-error text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.bikeRegistrationNumber.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-base-content/70 mb-2 block">
                      Bike Details (Brand, Model, Year) *
                    </label>
                    <div className="relative">
                      <Bike className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                      <input
                        type="text"
                        className={`input w-full pl-10 bg-base-100 ${
                          errors.bikeBrandModelYear ? "border-error" : "border-base-300"
                        } focus:border-primary`}
                        {...register("bikeBrandModelYear", {
                          required: "Bike details are required",
                        })}
                        placeholder="e.g., Honda CBR 150R, 2022"
                      />
                    </div>
                    {errors.bikeBrandModelYear && (
                      <p className="text-error text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.bikeBrandModelYear.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-base-200 rounded-2xl border border-base-300 p-6">
                <h2 className="text-xl font-bold text-base-content mb-6 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  Additional Information
                </h2>

                <div>
                  <label className="text-sm font-medium text-base-content/70 mb-2 block">
                    Tell us about yourself (Optional)
                  </label>
                  <textarea
                    className="textarea w-full bg-base-100 border-base-300 focus:border-primary h-24"
                    {...register("additionalInfo")}
                    placeholder="Previous delivery experience, why you want to join, etc."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-primary w-full h-14 text-lg gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Application
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Requirements */}
            <div className="bg-base-200 rounded-2xl border border-base-300 p-6 sticky top-24">
              <h3 className="font-bold text-base-content mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                Requirements
              </h3>
              <ul className="space-y-3">
                {requirements.map((req, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-center gap-2 text-base-content/70"
                  >
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                    <span>{req}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Note */}
              <div className="mt-6 p-4 bg-info/10 rounded-xl border border-info/30">
                <p className="text-sm text-base-content/70">
                  <strong className="text-info">Note:</strong> Your application will be
                  reviewed within 24-48 hours. We'll contact you via phone or email.
                </p>
              </div>
            </div>

            {/* Help */}
            <div className="bg-base-200 rounded-2xl border border-base-300 p-6">
              <h3 className="font-bold text-base-content mb-3">Need Help?</h3>
              <p className="text-sm text-base-content/70 mb-4">
                Have questions about becoming a rider? Contact us!
              </p>
              <a
                href="tel:+8801XXXXXXXXX"
                className="btn btn-outline btn-sm gap-2 w-full"
              >
                <Phone className="w-4 h-4" />
                Call Support
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Rider;
