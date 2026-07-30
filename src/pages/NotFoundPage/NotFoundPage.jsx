// 404 Not Found Page
import { Link } from "react-router";
import worker from "../../assets/ERROR-404.png";
import NavBar from "../Shared/NavBar/NavBar";
import Footer from "../Shared/Footer/Footer";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col min-h-screen max-w-[1600px] mx-auto">
      {/* Navbar Section */}
      <div className="pt-5">
        <NavBar />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 mt-5 mb-5 bg-gray-50 rounded-2xl">
        <div className="text-center space-y-8 max-w-md w-full">
          {/* Error Image */}
          <img
            src={worker}
            alt="404 Illustration"
            className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 object-contain mx-auto"
          />

          {/* Error Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900">
            Error!
          </h1>

          {/* Error Message */}
          <p className="text-lg sm:text-xl md:text-xl text-gray-600 mt-2">
            Oops! The page you're looking for can't be found.
          </p>

          {/* Home Button */}
          <Link to="/">
            <button className="mt-6 inline-flex items-center px-8 py-3 bg-[#CAEB66] hover:bg-[#a8d000] text-gray-800 font-medium rounded-md shadow-md transition duration-200 ease-in-out transform hover:scale-105">
              Go Home
            </button>
          </Link>
        </div>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default NotFoundPage;
