// User Profile Management Page
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  Loader2,
  Shield,
  MapPin,
  Bike,
  AlertCircle,
  Clock,
  XCircle,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import axios from "axios";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOST_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [riderStatus, setRiderStatus] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Load User Data
  useEffect(() => {
    if (user) {
      setValue("name", user.displayName);
      setValue("email", user.email); // Read-only
      setValue("phone", user.phoneNumber || ""); // Might be empty initially
      
      // Fetch Role
      axiosSecure.get(`/users/${user.email}/role`)
        .then(res => setUserRole(res.data.role))
        .catch(err => console.error(err));

      // Fetch Rider Application Status
      axiosSecure.get(`/riders/${user.email}/status`)
        .then(res => setRiderStatus(res.data))
        .catch(() => setRiderStatus(null)); // Ignore if not found (hasn't applied)
    }
  }, [user, setValue, axiosSecure]);

  const onSubmit = async (data) => {
    setLoading(true);
    let photoURL = user.photoURL;

    try {
      // 1. Upload Image If Changed
      const imageFile = data.image?.[0];
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const res = await axios.post(image_hosting_api, formData);
        if (res.data.success) {
          photoURL = res.data.data.display_url;
        }
      }

      // 2. Update Firebase Profile
      await updateUserProfile({ displayName: data.name, photoURL: photoURL });

      // 3. Update Database Profile (Sync)
      await axiosSecure.patch("/users/profile", {
        name: data.name,
        photoURL: photoURL,
        phone: data.phone
      });

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Profile Updated Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Profile Update Failed", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Could not update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-base-content">My Profile</h1>
        <p className="text-base-content/60 mt-1">Manage your account settings and preferences!</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`btn ${isEditing ? "btn-ghost" : "btn-primary"}`}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Rider Application Status */}
      {riderStatus && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          {riderStatus.status === "pending" && (
            <div className="alert alert-warning shadow-lg">
              <Clock className="w-6 h-6" />
              <div>
                <h3 className="font-bold">Rider Application Pending</h3>
                <div className="text-xs">Your application to become a rider is currently under review by our admin team.</div>
              </div>
            </div>
          )}

          {riderStatus.status === "rejected" && (
            <div className="alert alert-error shadow-lg">
              <XCircle className="w-6 h-6" />
              <div className="flex-1">
                <h3 className="font-bold">Rider Application Rejected</h3>
                <div className="text-xs">
                  Reason: <span className="font-semibold italic">{riderStatus.rejectionReason || "No reason provided"}</span>
                </div>
              </div>
              <Link to="/rider" className="btn btn-sm btn-outline btn-active text-white bg-red-900 border-none hover:bg-white hover:text-red-600">
                Re-Apply
              </Link>
            </div>
          )}

          {riderStatus.status === "approved" && (
            <div className="alert alert-success shadow-lg text-white">
              <Shield className="w-6 h-6" />
              <div>
                <h3 className="font-bold">Rider Application Approved!</h3>
                <div className="text-xs">You are now an verified delivery rider. Access your dashboard to start delivering.</div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-base-200 rounded-2xl p-6 border border-base-300 flex flex-col items-center text-center h-full">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-base-100 shadow-xl overflow-hidden mb-4">
                <img
                  src={user?.photoURL || "https://i.ibb.co.com/M6hPd5f/placeholder.jpg"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <label className="absolute bottom-4 right-0 p-2 bg-primary rounded-full text-white cursor-pointer hover:bg-primary-focus transition-colors shadow-lg">
                  <Camera className="w-5 h-5" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    {...register("image")}
                  />
                </label>
              )}
            </div>
            
            <h2 className="text-xl font-bold text-base-content">{user?.displayName}</h2>
            <div className={`badge ${userRole === 'admin' ? 'badge-error' : userRole === 'rider' ? 'badge-info' : 'badge-success'} mt-2 capitalize font-medium`}>
              {userRole || "User"}
            </div>
            
            <div className="w-full mt-6 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-base-100 rounded-xl">
                <Shield className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="text-xs text-base-content/50">Account Status</p>
                  <p className="font-semibold text-success">Verified Active</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-base-100 rounded-xl">
                 <Mail className="w-5 h-5 text-info" />
                 <div className="text-left overflow-hidden">
                   <p className="text-xs text-base-content/50">Email Address</p>
                   <p className="text-sm font-medium truncate">{user?.email}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-base-200 rounded-2xl p-6 border border-base-300">
            <h3 className="text-xl font-bold mb-6">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                  <input
                    type="text"
                    disabled={!isEditing}
                    className={`input input-bordered w-full pl-10 ${errors.name ? 'input-error' : ''}`}
                    {...register("name", { required: "Name is required" })}
                  />
                </div>
                {errors.name && <span className="text-error text-sm mt-1">{errors.name.message}</span>}
              </div>

              {/* Email (Read Only) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                  <input
                    type="email"
                    disabled
                    className="input input-bordered w-full pl-10 opacity-70 cursor-not-allowed"
                    {...register("email")}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Phone Number</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                  <input
                    type="tel"
                    disabled={!isEditing}
                    placeholder="+880 1XXX-XXXXXX"
                    className="input input-bordered w-full pl-10"
                    {...register("phone")}
                  />
                </div>
              </div>

              {/* Address (Placeholder / Future Feature) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Address</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                  <input
                    type="text"
                    disabled
                    placeholder="Address updates coming soon..."
                    className="input input-bordered w-full pl-10 opacity-70 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="mt-8 flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary px-8"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
