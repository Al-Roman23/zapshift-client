// Homepage Layout With All Sections
import Banner from "./Banner";
import Works from "./Works";
import Services from "./Services";
import Brands from "./Brands";
import Reviews from "./Reviews";
import ServiceHighlights from "./ServiceHighlights";
import MerchantPriorityBanner from "./MerchantPriorityBanner";
import FaqSection from "./FaqSection";

// Pre-Fetch Reviews Data
const reviewsPromise = fetch("/reviews.json").then((res) => res.json());

const Home = () => {
  return (
    <div className="pt-5 mb-5">
      <Banner />
      <Works />
      <Services />
      <Brands />
      <ServiceHighlights />
      <MerchantPriorityBanner />
      <Reviews reviewsPromise={reviewsPromise} />
      <FaqSection />
    </div>
  );
};

export default Home;
