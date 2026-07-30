// Complete Application Router With All Routes And Protected Areas
import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import RiderRoute from "./RiderRoute";
import UserRoute from "./UserRoute";

// Page Imports - Home Section
import Home from "../pages/Home/Home";
import Coverage from "../pages/Coverage/Coverage";
import About from "../pages/About/About";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import Rider from "../pages/Rider/Rider";
import SendParcel from "../pages/SendParcel/SendParcel";
import ParcelTrack from "../pages/ParcelTrack/ParcelTrack";
import ParcelLogs from "../pages/ParcelTrack/ParcelLogs";

// Page Imports - Navigation Section
import Services from "../pages/Services/Services";
import Pricing from "../pages/Pricing/Pricing";
import Blog from "../pages/Blog/Blog";
import Contact from "../pages/Contact/Contact";
import PrivacyPolicy from "../pages/Legal/PrivacyPolicy";
import TermsOfService from "../pages/Legal/TermsOfService";

// Page Imports - Auth Section
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";

// Page Imports - Dashboard Section
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";
import MyParcels from "../pages/Dashboard/MyParcels/MyParcels";
import Payment from "../pages/Dashboard/Payment/Payment";
import PaymentSuccess from "../pages/Dashboard/Payment/PaymentSuccess";
import PaymentCancelled from "../pages/Dashboard/Payment/PaymentCancelled";
import PaymentHistory from "../pages/Dashboard/PaymentHistory/PaymentHistory";
import Profile from "../pages/Dashboard/Profile/Profile";

// Page Imports - Rider Dashboard
import MyDeliveries from "../pages/Dashboard/MyDeliveries/MyDeliveries";
import MyCompletedDeliveries from "../pages/Dashboard/MyCompletedDeliveries/MyCompletedDeliveries";
import RiderEarnings from "../pages/Dashboard/RiderEarnings/RiderEarnings";
import RiderMyWorkStatus from "../pages/Dashboard/RiderMyWorkStatus/RiderMyWorkStatus";

// Page Imports - Admin Dashboard
import UnpaidParcels from "../pages/Dashboard/UnpaidParcels/UnpaidParcels";
import AllParcels from "../pages/Dashboard/AllParcels/AllParcels";
import DeliveredParcels from "../pages/Dashboard/DeliveredParcels/DeliveredParcels";
import ApproveRiders from "../pages/Dashboard/ApproveRiders/ApproveRiders";
import ApprovedRiders from "../pages/Dashboard/ApprovedRiders/ApprovedRiders";
import ManageUsers from "../pages/Dashboard/ManageUsers/ManageUsers";
import AssignRiders from "../pages/Dashboard/AssignRiders/AssignRiders";
import RejectedParcels from "../pages/Dashboard/RejectedParcels/RejectedParcels";

export const router = createBrowserRouter([
  // Public Routes With Root Layout
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "services", Component: Services },
      { path: "coverage", Component: Coverage },
      {
        path: "send-parcel",
        element: (
          <PrivateRoute>
            <SendParcel />
          </PrivateRoute>
        ),
        loader: () => fetch("/serviceCenters.json").then((res) => res.json()),
      },
      { path: "parcel-track", element: <ParcelTrack /> },
      { path: "parcel-track/:trackingId", element: <ParcelLogs /> },
      { path: "about", Component: About },
      { path: "pricing", Component: Pricing },
      { path: "blog", Component: Blog },
      { path: "contact", Component: Contact },
      { path: "privacy", Component: PrivacyPolicy },
      { path: "terms", Component: TermsOfService },
      {
        path: "rider",
        element: (
          <PrivateRoute>
            <Rider />
          </PrivateRoute>
        ),
        loader: () => fetch("/serviceCenters.json").then((res) => res.json()),
      },
    ],
  },

  // Auth Routes With Auth Layout
  {
    path: "/",
    Component: AuthLayout,
    children: [
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "forgot-password", Component: ForgotPassword },
    ],
  },

  // Dashboard Routes With Dashboard Layout (Protected)
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // Dashboard Home (Index)
      { index: true, Component: DashboardHome },
      
      // User Only Routes
      {
        path: "my-parcels",
        element: (
          <UserRoute>
            <MyParcels />
          </UserRoute>
        ),
      },
      {
        path: "payment/:parcelId",
        element: (
          <UserRoute>
            <Payment />
          </UserRoute>
        ),
      },
      { path: "payment-success", Component: PaymentSuccess },
      { path: "payment-cancel", Component: PaymentCancelled },
      {
        path: "payment-history",
        element: (
          <UserRoute>
            <PaymentHistory />
          </UserRoute>
        ),
      },
      
      // Common Routes (All Authenticated Users)
      { path: "profile", Component: Profile },

      // Rider Only Routes
      {
        path: "my-deliveries",
        element: (
          <RiderRoute>
            <MyDeliveries />
          </RiderRoute>
        ),
      },
      {
        path: "my-completed-deliveries",
        element: (
          <RiderRoute>
            <MyCompletedDeliveries />
          </RiderRoute>
        ),
      },
      {
        path: "my-earnings",
        element: (
          <RiderRoute>
            <RiderEarnings />
          </RiderRoute>
        ),
      },
      {
        path: "my-work-status",
        element: (
          <RiderRoute>
            <RiderMyWorkStatus />
          </RiderRoute>
        ),
      },

      // Admin Only Routes
      {
        path: "assign-riders",
        element: (
          <AdminRoute>
            <AssignRiders />
          </AdminRoute>
        ),
      },
      {
        path: "unpaid-parcels",
        element: (
          <AdminRoute>
            <UnpaidParcels />
          </AdminRoute>
        ),
      },
      {
        path: "all-parcels",
        element: (
          <AdminRoute>
            <AllParcels />
          </AdminRoute>
        ),
      },
      {
        path: "delivered-parcels",
        element: (
          <AdminRoute>
            <DeliveredParcels />
          </AdminRoute>
        ),
      },
      {
        path: "rejected-parcels",
        element: (
          <AdminRoute>
            <RejectedParcels />
          </AdminRoute>
        ),
      },
      {
        path: "approve-riders",
        element: (
          <AdminRoute>
            <ApproveRiders />
          </AdminRoute>
        ),
      },
      {
        path: "approved-riders",
        element: (
          <AdminRoute>
            <ApprovedRiders />
          </AdminRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
    ],
  },

  // 404 Not Found Route
  { path: "*", Component: NotFoundPage },
]);
