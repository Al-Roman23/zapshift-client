// Footer Component
import { useMemo } from "react";
import { NavLink, Link } from "react-router";
import Logo from "../../../components/Logo/Logo";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  // Quick Links
  const quickLinks = useMemo(
    () => [
      { to: "/services", label: "Services" },
      { to: "/coverage", label: "Coverage" },
      { to: "/pricing", label: "Pricing" },
      { to: "/parcel-track", label: "Track Parcel" },
    ],
    [],
  );

  // Company Links
  const companyLinks = useMemo(
    () => [
      { to: "/about", label: "About Us" },
      { to: "/blog", label: "Blog" },
      { to: "/contact", label: "Contact" },
      { to: "/rider", label: "Become a Rider" },
    ],
    [],
  );

  // Social Media Links
  const socialLinks = useMemo(
    () => [
      { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
      { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
      { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
      { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
      { href: "https://youtube.com", icon: Youtube, label: "YouTube" },
    ],
    [],
  );

  return (
    <footer className="bg-base-200 border-t border-base-300 mt-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-4 text-base-content/70 text-sm leading-relaxed">
              Fast, reliable parcel delivery with real-time tracking. From
              personal packages to business shipments — we deliver on time,
              every time.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-base-300 hover:bg-primary hover:text-primary-content flex items-center justify-center transition-all duration-200"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-base-content mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="text-base-content/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-base-content mb-4">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="text-base-content/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-base-content mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-base-content/70 text-sm">
                  Gulshan-2, Dhaka 1212, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="tel:16XXX"
                  className="text-base-content/70 hover:text-primary transition-colors text-sm"
                >
                  Hotline: 23237
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:support@zapshift.com"
                  className="text-base-content/70 hover:text-primary transition-colors text-sm"
                >
                  support@zapshift.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-base-300 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-base-content/60 text-sm text-center md:text-left">
            © 2025–{year} ZaP ShifT Courier Ltd. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-base-content/60">
            <Link
              to="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
