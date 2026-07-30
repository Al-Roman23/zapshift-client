// Logo Component
import { Link } from "react-router";
import logo from "../../assets/logo.png";

const Logo = () => {
  return (
    <Link to="/" className="flex items-end cursor-pointer hover:opacity-90 transition-opacity">
      <img src={logo} alt="ZaP ShifT Logo" />
      <h1 className="text-3xl font-bold -ms-2.5">ZaP ShifT</h1>
    </Link>
  );
};

export default Logo;
