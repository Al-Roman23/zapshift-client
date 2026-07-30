// Root Layout With Responsive Container And Proper Spacing
import { Outlet } from "react-router";
import Footer from "../pages/Shared/Footer/Footer";
import NavBar from "../pages/Shared/NavBar/NavBar";
import PageTitle from "../components/Shared/PageTitle";

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <PageTitle />
      {/* Max Width Container For Content */}
      <div className="max-w-[1600px] mx-auto w-full px-4 lg:px-6 flex-1 flex flex-col">
        {/* Header With Navigation */}
        <header className="py-5 sticky top-0 z-50 bg-base-100/80 backdrop-blur-md">
          <NavBar />
        </header>

        {/* Main Content Area With Proper Spacing */}
        <main className="flex-1 py-6">
          <Outlet />
        </main>
      </div>

      {/* Full Width Footer */}
      <Footer />
    </div>
  );
};

export default RootLayout;
