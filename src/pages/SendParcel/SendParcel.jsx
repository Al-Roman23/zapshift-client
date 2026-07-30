// Send Parcel Form With Step Navigation And Price Calculator
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  FileText,
  Box,
  User,
  Mail,
  MapPin,
  Phone,
  MessageSquare,
  Send,
  ArrowRight,
  ArrowLeft,
  Calculator,
  Scale,
  Truck,
  CheckCircle,
  Info,
  AlertCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const SendParcel = () => {
  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      parcelType: "document",
    },
  });
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const loaderData = useLoaderData();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepErrors, setStepErrors] = useState({});

  // Memoize Service Centers And Regions
  const serviceCenters = useMemo(() => loaderData || [], [loaderData]);
  const regions = useMemo(
    () => [...new Set(serviceCenters.map((c) => c.region))],
    [serviceCenters]
  );

  // Watch Form Values
  const parcelType = useWatch({ control, name: "parcelType" });
  const parcelWeight = useWatch({ control, name: "parcelWeight" });
  const senderName = useWatch({ control, name: "senderName" });
  const senderEmail = useWatch({ control, name: "senderEmail" });
  const senderAddress = useWatch({ control, name: "senderAddress" });
  const senderRegion = useWatch({ control, name: "senderRegion" });
  const receiverRegion = useWatch({ control, name: "receiverRegion" });
  const senderDistrict = useWatch({ control, name: "senderDistrict" });
  const receiverDistrict = useWatch({ control, name: "receiverDistrict" });
  const parcelName = useWatch({ control, name: "parcelName" });

  // Get Districts By Region
  const getDistricts = (region) => {
    if (!region) return [];
    return serviceCenters
      .filter((c) => c.region === region)
      .map((d) => d.district);
  };

  // Step Validation Functions
  const validateStep1 = async () => {
    const fields = ["parcelName", "parcelWeight"];
    const isValid = await trigger(fields);
    
    if (!isValid) {
      setStepErrors({
        step1: "Please fill in parcel name and weight (min 0.5kg) to continue.",
      });
      return false;
    }
    
    if (Number(parcelWeight) < 0.5) {
      setStepErrors({
        step1: "Parcel weight must be at least 0.5 kg.",
      });
      return false;
    }
    
    setStepErrors({});
    return true;
  };

  const validateStep2 = async () => {
    const fields = ["senderName", "senderEmail", "senderAddress", "senderRegion", "senderDistrict"];
    const isValid = await trigger(fields);
    
    if (!isValid) {
      setStepErrors({
        step2: "Please fill in all sender details correctly to continue.",
      });
      return false;
    }
    
    setStepErrors({});
    return true;
  };

  // Calculate Live Cost
  const calculateCost = useMemo(() => {
    if (!parcelType) return 0;
    
    const isDocument = parcelType === "document";
    const isSameDistrict = senderDistrict && receiverDistrict && senderDistrict === receiverDistrict;
    const weight = Number(parcelWeight) || 0;

    if (isDocument) {
      return isSameDistrict ? 60 : 80;
    } else {
      const baseCost = isSameDistrict ? 110 : 150;
      if (weight <= 3) {
        return baseCost;
      } else {
        const extraWeight = weight - 3;
        const extraCharge = isSameDistrict
          ? extraWeight * 40
          : extraWeight * 40 + 40;
        return baseCost + extraCharge;
      }
    }
  }, [parcelType, parcelWeight, senderDistrict, receiverDistrict]);

  // Handle Parcel Booking Submission
  const handleSendParcel = async (data) => {
    setIsSubmitting(true);
    try {
      const parcelPayload = {
        ...data,
        cost: calculateCost,
        paymentStatus: "unpaid",
        deliveryStatus: "pending",
      };

      // Confirm Booking
      const result = await Swal.fire({
        title: "Confirm Parcel Booking",
        html: `
          <div class="text-left space-y-2">
            <p><strong>Parcel:</strong> ${data.parcelName}</p>
            <p><strong>From:</strong> ${data.senderDistrict}</p>
            <p><strong>To:</strong> ${data.receiverDistrict}</p>
            <p class="text-xl font-bold mt-4">Total: ৳${calculateCost}</p>
          </div>
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#A3E635",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Confirm Booking",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) {
        setIsSubmitting(false);
        return;
      }

      // Submit Parcel
      const res = await axiosSecure.post("/parcels", parcelPayload);

      if (res.data.id || res.data.insertedId) {
        await Swal.fire({
          icon: "success",
          title: "Booking Confirmed! 🎉",
          text: "Your parcel has been booked successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/dashboard/my-parcels");
      } else {
        throw new Error("Parcel insertion failed!");
      }
    } catch (error) {
      console.error("Parcel Booking Failed:", error);
      Swal.fire(
        "Error!",
        error.response?.data?.error || "Failed to book parcel.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step Navigation with Validation
  const nextStep = async () => {
    if (currentStep === 1) {
      const isValid = await validateStep1();
      if (!isValid) return;
    } else if (currentStep === 2) {
      const isValid = await validateStep2();
      if (!isValid) return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };
  
  const prevStep = () => {
    setStepErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Step Indicator
  const steps = [
    { num: 1, label: "Parcel Info", icon: Package },
    { num: 2, label: "Sender", icon: Send },
    { num: 3, label: "Receiver", icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-base-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-4">
            <Truck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-base-content">
            Send A Parcel
          </h1>
          <p className="text-base-content/60 mt-2">
            Fill in your parcel details and we'll take care of the rest!
          </p>
        </motion.div>

        {/* Step Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center gap-2 md:gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.num;
              const isCompleted = currentStep > step.num;

              return (
                <div key={step.num} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(step.num)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      isActive
                        ? "bg-primary text-primary-content"
                        : isCompleted
                        ? "bg-success/20 text-success"
                        : "bg-base-200 text-base-content/60"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                    <span className="hidden sm:inline font-medium">{step.label}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`w-8 md:w-12 h-1 mx-2 rounded ${
                      isCompleted ? "bg-success" : "bg-base-300"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(handleSendParcel)}>
              <AnimatePresence mode="wait">
                {/* Step 1: Parcel Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-base-200 rounded-2xl border border-base-300 p-6 space-y-6"
                  >
                    <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
                      <Package className="w-6 h-6 text-primary" />
                      Parcel Information
                    </h2>

                    {/* Parcel Type Cards */}
                    <div>
                      <label className="text-sm font-medium text-base-content/70 mb-3 block">
                        What are you sending?
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <label
                          className={`cursor-pointer rounded-xl p-4 border-2 transition-all ${
                            parcelType === "document"
                              ? "border-primary bg-primary/10"
                              : "border-base-300 bg-base-100 hover:border-primary/50"
                          }`}
                        >
                          <input
                            type="radio"
                            {...register("parcelType")}
                            value="document"
                            className="hidden"
                          />
                          <div className="text-center">
                            <FileText className={`w-10 h-10 mx-auto mb-2 ${
                              parcelType === "document" ? "text-primary" : "text-base-content/60"
                            }`} />
                            <p className="font-semibold text-base-content">Document</p>
                            <p className="text-xs text-base-content/60 mt-1">
                              Papers, letters, files.
                            </p>
                          </div>
                        </label>
                        <label
                          className={`cursor-pointer rounded-xl p-4 border-2 transition-all ${
                            parcelType === "non-document"
                              ? "border-primary bg-primary/10"
                              : "border-base-300 bg-base-100 hover:border-primary/50"
                          }`}
                        >
                          <input
                            type="radio"
                            {...register("parcelType")}
                            value="non-document"
                            className="hidden"
                          />
                          <div className="text-center">
                            <Box className={`w-10 h-10 mx-auto mb-2 ${
                              parcelType === "non-document" ? "text-primary" : "text-base-content/60"
                            }`} />
                            <p className="font-semibold text-base-content">Non-Document</p>
                            <p className="text-xs text-base-content/60 mt-1">
                              Packages, products.
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Parcel Details */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-base-content/70 mb-2 block">
                          Parcel Name *
                        </label>
                        <div className="relative">
                          <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                          <input
                            type="text"
                            {...register("parcelName", { required: true })}
                            className="input w-full pl-10 bg-base-100 border-base-300 focus:border-primary"
                            placeholder="Something You Want To Send"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-base-content/70 mb-2 block">
                          Weight (KG) *
                        </label>
                        <div className="relative">
                          <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                          <input
                            type="number"
                            step="0.5"
                            min="0.5"
                            {...register("parcelWeight", { required: true })}
                            className="input w-full pl-10 bg-base-100 border-base-300 focus:border-primary"
                            placeholder="Your Parcel Weight"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Step 1 Error Message */}
                    {stepErrors.step1 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-error/10 border border-error/30 rounded-xl p-3 flex items-center gap-2"
                      >
                        <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
                        <p className="text-sm text-error">{stepErrors.step1}</p>
                      </motion.div>
                    )}

                    {/* Next Button */}
                    <div className="flex justify-end pt-4">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="btn btn-primary gap-2"
                      >
                        Next: Sender Details
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Sender Details */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-base-200 rounded-2xl border border-base-300 p-6 space-y-6"
                  >
                    <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
                      <Send className="w-6 h-6 text-primary" />
                      Sender Details
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-base-content/70 mb-2 block">
                          Your Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                          <input
                            type="text"
                            {...register("senderName", { required: true })}
                            defaultValue={user?.displayName}
                            className="input w-full pl-10 bg-base-100 border-base-300 focus:border-primary"
                            placeholder="Your Full Name"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-base-content/70 mb-2 block">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                          <input
                            type="email"
                            {...register("senderEmail", { 
                              required: true,
                              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                            })}
                            defaultValue={user?.email}
                            className="input w-full pl-10 bg-base-100 border-base-300 focus:border-primary"
                            placeholder="Your Email"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-base-content/70 mb-2 block">
                        Pickup Address *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-base-content/40" />
                        <input
                          type="text"
                          {...register("senderAddress", { required: true })}
                          className="input w-full pl-10 bg-base-100 border-base-300 focus:border-primary"
                          placeholder="Your Pickup Address (House #, Road #, Area)"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-base-content/70 mb-2 block">
                          Region *
                        </label>
                        <select
                          {...register("senderRegion", { required: true })}
                          className="select w-full bg-base-100 border-base-300 focus:border-primary"
                        >
                          <option value="">Select Region</option>
                          {regions.map((r, i) => (
                            <option key={i} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-base-content/70 mb-2 block">
                          District *
                        </label>
                        <select
                          {...register("senderDistrict", { required: true })}
                          className="select w-full bg-base-100 border-base-300 focus:border-primary"
                          disabled={!senderRegion}
                        >
                          <option value="">Select District</option>
                          {getDistricts(senderRegion).map((d, i) => (
                            <option key={i} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-base-content/70 mb-2 block">
                        Pickup Instructions (Optional)
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-base-content/40" />
                        <textarea
                          {...register("senderInstruction")}
                          className="textarea w-full pl-10 bg-base-100 border-base-300 focus:border-primary h-20"
                          placeholder="Any special instructions for pickup..."
                        />
                      </div>
                    </div>

                    {/* Step 2 Error Message */}
                    {stepErrors.step2 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-error/10 border border-error/30 rounded-xl p-3 flex items-center gap-2"
                      >
                        <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
                        <p className="text-sm text-error">{stepErrors.step2}</p>
                      </motion.div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="btn btn-ghost gap-2"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="btn btn-primary gap-2"
                      >
                        Next: Receiver Details
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Receiver Details */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-base-200 rounded-2xl border border-base-300 p-6 space-y-6"
                  >
                    <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-primary" />
                      Receiver Details
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-base-content/70 mb-2 block">
                          Receiver Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                          <input
                            type="text"
                            {...register("receiverName", { required: true })}
                            className="input w-full pl-10 bg-base-100 border-base-300 focus:border-primary"
                            placeholder="Receiver's Full Name"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-base-content/70 mb-2 block">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                          <input
                            type="tel"
                            {...register("receiverPhone", { required: true })}
                            className="input w-full pl-10 bg-base-100 border-base-300 focus:border-primary"
                            placeholder="01XXXXXXXXX"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-base-content/70 mb-2 block">
                        Delivery Address *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-base-content/40" />
                        <input
                          type="text"
                          {...register("receiverAddress", { required: true })}
                          className="input w-full pl-10 bg-base-100 border-base-300 focus:border-primary"
                          placeholder="Receiver's Full Address (House #, Road #, Area)"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-base-content/70 mb-2 block">
                          Region *
                        </label>
                        <select
                          {...register("receiverRegion", { required: true })}
                          className="select w-full bg-base-100 border-base-300 focus:border-primary"
                        >
                          <option value="">Select Region</option>
                          {regions.map((r, i) => (
                            <option key={i} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-base-content/70 mb-2 block">
                          District *
                        </label>
                        <select
                          {...register("receiverDistrict", { required: true })}
                          className="select w-full bg-base-100 border-base-300 focus:border-primary"
                          disabled={!receiverRegion}
                        >
                          <option value="">Select District</option>
                          {getDistricts(receiverRegion).map((d, i) => (
                            <option key={i} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-base-content/70 mb-2 block">
                        Delivery Instructions (Optional)
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-base-content/40" />
                        <textarea
                          {...register("receiverInstruction")}
                          className="textarea w-full pl-10 bg-base-100 border-base-300 focus:border-primary h-20"
                          placeholder="Any special delivery instructions..."
                        />
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="btn btn-ghost gap-2"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Confirm Booking
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Pricing Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24"
            >
              {/* Price Card */}
              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-primary-content mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="w-6 h-6" />
                  <h3 className="font-bold text-lg">Estimated Cost</h3>
                </div>
                <motion.div
                  key={calculateCost}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-4"
                >
                  <span className="text-5xl font-bold">৳{calculateCost}</span>
                </motion.div>
                <div className="text-center text-primary-content/80 text-sm">
                  {parcelType === "document" ? "Document Rate" : "Package Rate"}
                </div>
              </div>

              {/* Pricing Info */}
              <div className="bg-base-200 rounded-2xl border border-base-300 p-5">
                <h4 className="font-semibold text-base-content mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-info" />
                  Pricing Details
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-base-content/60">Document (Same District)</span>
                    <span className="font-medium text-base-content">৳60</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/60">Document (Different)</span>
                    <span className="font-medium text-base-content">৳80</span>
                  </div>
                  <div className="divider my-2"></div>
                  <div className="flex justify-between">
                    <span className="text-base-content/60">Package (Same, ≤3kg)</span>
                    <span className="font-medium text-base-content">৳110</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/60">Package (Different, ≤3kg)</span>
                    <span className="font-medium text-base-content">৳150</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/60">Extra Per Kg</span>
                    <span className="font-medium text-base-content">৳40</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-base-200 rounded-2xl border border-base-300 p-5 mt-4">
                <h4 className="font-semibold text-base-content mb-3">✨ What's Included</h4>
                <ul className="space-y-2 text-sm text-base-content/70">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    Real-time tracking!
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    SMS notifications!
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    Secure packaging!
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    Door-to-door delivery!
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendParcel;
