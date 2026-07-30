import { useEffect } from "react";
import { useLocation } from "react-router";

const PageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
      
    const titleMap = {
      "/": "Home | ZapShift",
      "/services": "Our Services | ZapShift",
      "/coverage": "Coverage Area | ZapShift",
      "/send-parcel": "Send Parcel | ZapShift",
      "/parcel-track": "Track Parcel | ZapShift",
      "/about": "About Us | ZapShift",
      "/pricing": "Pricing Plans | ZapShift",
      "/blog": "Latest News | ZapShift",
      "/contact": "Contact Us | ZapShift",
      "/privacy": "Privacy Policy | ZapShift",
      "/terms": "Terms of Service | ZapShift",
      "/login": "Login | ZapShift",
      "/register": "Register | ZapShift",
      "/forgot-password": "Reset Password | ZapShift",
      "/dashboard": "Dashboard | ZapShift",
      "/dashboard/profile": "My Profile | ZapShift",
      "/dashboard/my-parcels": "My Parcels | ZapShift",
      "/dashboard/payment-history": "Payment History | ZapShift",
      "/dashboard/my-deliveries": "My Deliveries | ZapShift",
      "/dashboard/my-completed-deliveries": "Completed Deliveries | ZapShift",
      "/dashboard/my-earnings": "My Earnings | ZapShift",
      "/dashboard/my-work-status": "Work Status | ZapShift",
      "/dashboard/all-parcels": "All Parcels | ZapShift",
      "/dashboard/unpaid-parcels": "Unpaid Parcels | ZapShift",
      "/dashboard/delivered-parcels": "Delivered Parcels | ZapShift",
      "/dashboard/rejected-parcels": "Rejected Parcels | ZapShift",
      "/dashboard/approve-riders": "Approve Riders | ZapShift",
      "/dashboard/approved-riders": "Approved Riders | ZapShift",
      "/dashboard/manage-users": "Manage Users | ZapShift",
    };

    let title = titleMap[path];
    
    if (!title) {
        if (path.startsWith("/parcel-track/")) {
            title = "Tracking Details | ZapShift";
        } else if (path.startsWith("/dashboard/payment/")) {
            title = "Secure Payment | ZapShift";
        } else {
            title = "ZapShift | Premier Logistics";
        }
    }

    document.title = title;
  }, [location]);

  return null;
};

export default PageTitle;
