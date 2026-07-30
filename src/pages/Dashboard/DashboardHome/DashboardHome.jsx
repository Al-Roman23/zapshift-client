// Dashboard Home Page
import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Package,
  Truck,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  ArrowRight,
  AlertCircle,
  UserPlus,
  Activity,
  UserCheck,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import useUserRole from "../../../hooks/useUserRole";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const DashboardHome = () => {
  const { user } = useAuth();
  const { role } = useUserRole();
  const axiosSecure = useAxiosSecure();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Role-Based Stats
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (role === "admin") {
          const [parcelsRes, usersRes] = await Promise.all([
            axiosSecure.get("/parcels/stats"),
            axiosSecure.get("/users"),
          ]);
          // Backend Returns: TotalParcels, PendingParcels, DeliveredParcels, CancelledParcels
          setStats({
            totalParcels: parcelsRes.data.totalParcels || 0,
            pendingParcels: parcelsRes.data.pendingParcels || 0,
            deliveredParcels: parcelsRes.data.deliveredParcels || 0,
            cancelledParcels: parcelsRes.data.cancelledParcels || 0,
            totalUsers: usersRes.data?.length || 0,
          });
        } else if (role === "rider") {
          // Fetch Both Active And Completed Deliveries
          const [activeRes, completedRes] = await Promise.all([
            axiosSecure.get(`/riders/${user.email}/deliveries`),
            axiosSecure.get(`/riders/${user.email}/completed`),
          ]);
          const deliveries = activeRes.data || [];
          const completed = completedRes.data || [];
          setStats({
            needsAction: deliveries.filter(d => d.deliveryStatus === "assigned").length,
            inProgress: deliveries.filter(d => ["accepted", "picking-up", "picked-up", "in-transit"].includes(d.deliveryStatus)).length,
            totalActive: deliveries.length,
            completed: completed.length,
          });
        } else {
          const res = await axiosSecure.get(`/parcels/user/${user.email}`);
          const parcels = res.data || [];
          setStats({
            totalParcels: parcels.length,
            pendingParcels: parcels.filter(p => p.deliveryStatus === "pending").length,
            inTransitParcels: parcels.filter(p => ["assigned", "accepted", "picking-up", "picked-up", "in-transit"].includes(p.deliveryStatus)).length,
            deliveredParcels: parcels.filter(p => p.deliveryStatus === "delivered").length,
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setStats({});
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.email && role) {
      fetchDashboardData();
    }
  }, [user?.email, role, axiosSecure]);

  // Get Greeting Based On Time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Stat Card Component - Simple & Fast
  const StatCard = ({ icon: Icon, label, value, color, link, description }) => (
    <div className="bg-base-200 rounded-xl p-4 border border-base-300 hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-2xl font-bold text-base-content">{value}</p>
          <p className="text-sm text-base-content/70">{label}</p>
          {description && <p className="text-xs text-base-content/50">{description}</p>}
        </div>
      </div>
      {link && (
        <Link to={link} className="flex items-center gap-1 text-primary text-sm mt-3 hover:underline">
          View <ArrowRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );

  // Quick Action Button - Simple
  const QuickAction = ({ icon: Icon, label, to, color }) => (
    <Link to={to} className={`${color} rounded-lg p-3 text-white text-center hover:opacity-90 transition-opacity`}>
      <Icon className="w-6 h-6 mx-auto mb-1" />
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            {getGreeting()}, {user?.displayName?.split(" ")[0] || "User"}! 👋
          </h1>
          <p className="text-base-content/60 text-sm">
            {role === "admin" ? "Platform overview" : role === "rider" ? "Your deliveries" : "Your parcels"} at a glance!
          </p>
        </div>
        <p className="text-sm text-base-content/50">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {role === "admin" && (
          <>
            <StatCard
              icon={Package}
              label="Total Parcels!"
              value={stats?.totalParcels || 0}
              color="bg-primary"
              link="/dashboard/all-parcels"
            />
            <StatCard
              icon={Clock}
              label="Pending"
              description="Need Assignment!"
              value={stats?.pendingParcels || 0}
              color="bg-warning"
              link="/dashboard/assign-riders"
            />
            <StatCard
              icon={CheckCircle}
              label="Delivered!"
              value={stats?.deliveredParcels || 0}
              color="bg-success"
              link="/dashboard/delivered-parcels"
            />
            <StatCard
              icon={Users}
              label="Total Users!"
              value={stats?.totalUsers || 0}
              color="bg-info"
              link="/dashboard/manage-users"
            />
          </>
        )}

        {role === "rider" && (
          <>
            <StatCard
              icon={AlertCircle}
              label="Needs Action!"
              description="Accept or Reject!"
              value={stats?.needsAction || 0}
              color="bg-warning"
              link="/dashboard/my-deliveries"
            />
            <StatCard
              icon={Truck}
              label="In Progress!"
              description="Currently Delivering!"
              value={stats?.inProgress || 0}
              color="bg-info"
              link="/dashboard/my-deliveries"
            />
            <StatCard
              icon={Package}
              label="Total Active!"
              description="Assigned to You!"
              value={stats?.totalActive || 0}
              color="bg-primary"
              link="/dashboard/my-deliveries"
            />
            <StatCard
              icon={CheckCircle}
              label="Completed!"
              description="Successfully Delivered!"
              value={stats?.completed || 0}
              color="bg-success"
              link="/dashboard/my-completed-deliveries"
            />
          </>
        )}

        {role === "user" && (
          <>
            <StatCard
              icon={Package}
              label="Total Parcels!"
              value={stats?.totalParcels || 0}
              color="bg-primary"
              link="/dashboard/my-parcels"
            />
            <StatCard
              icon={Clock}
              label="Pending!"
              value={stats?.pendingParcels || 0}
              color="bg-warning"
              link="/dashboard/my-parcels"
            />
            <StatCard
              icon={Truck}
              label="In Transit!"
              value={stats?.inTransitParcels || 0}
              color="bg-info"
              link="/dashboard/my-parcels"
            />
            <StatCard
              icon={CheckCircle}
              label="Delivered!"
              value={stats?.deliveredParcels || 0}
              color="bg-success"
              link="/dashboard/my-parcels"
            />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-base-content mb-3">Quick Actions</h2>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {role === "admin" && (
            <>
              <QuickAction icon={Truck} label="Assign" to="/dashboard/assign-riders" color="bg-primary" />
              <QuickAction icon={XCircle} label="Rejected" to="/dashboard/rejected-parcels" color="bg-error" />
              <QuickAction icon={UserPlus} label="Approve" to="/dashboard/approve-riders" color="bg-secondary" />
              <QuickAction icon={Users} label="Users" to="/dashboard/manage-users" color="bg-info" />
            </>
          )}
          {role === "rider" && (
            <>
              <QuickAction icon={Package} label="Deliveries" to="/dashboard/my-deliveries" color="bg-primary" />
              <QuickAction icon={CheckCircle} label="Completed" to="/dashboard/my-completed-deliveries" color="bg-success" />
              <QuickAction icon={DollarSign} label="Earnings" to="/dashboard/my-earnings" color="bg-emerald-500" />
              <QuickAction icon={Activity} label="Status" to="/dashboard/my-work-status" color="bg-info" />
            </>
          )}
          {role === "user" && (
            <>
              <QuickAction icon={Package} label="Send" to="/send-parcel" color="bg-primary" />
              <QuickAction icon={Truck} label="Track" to="/parcel-track" color="bg-secondary" />
              <QuickAction icon={Clock} label="Parcels" to="/dashboard/my-parcels" color="bg-info" />
              <QuickAction icon={DollarSign} label="Payments" to="/dashboard/payment-history" color="bg-success" />
            </>
          )}
        </div>
      </div>

      {/* Alert Banner For Pending Actions */}
      {((role === "user" && stats?.pendingParcels > 0) || (role === "rider" && stats?.needsAction > 0)) && (
        <div className="alert alert-warning">
          <AlertCircle className="w-5 h-5" />
          <div>
            <h3 className="font-semibold">Action Required</h3>
            <p className="text-sm">
              {role === "user"
                ? `You have ${stats?.pendingParcels} pending parcel(s).`
                : `You have ${stats?.needsAction} parcel(s) waiting for acceptance.`
              }
            </p>
          </div>
          <Link
            to={role === "user" ? "/dashboard/my-parcels" : "/dashboard/my-deliveries"}
            className="btn btn-sm"
          >
            Take Action
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
