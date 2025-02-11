import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
import Logo from "../Logo";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Logo & Description */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
               <Logo />
              </span>
            </div>
            <p className="text-sm max-w-xs text-gray-400">
              Empowering your financial journey with innovative solutions and
              trusted services.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-gray-200 font-semibold pb-2 border-b border-gray-700/50">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-gray-200 font-semibold pb-2 border-b border-gray-700/50">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-gray-200 font-semibold pb-2 border-b border-gray-700/50">
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              {[
                { icon: <FaFacebook />, label: "Facebook" },
                { icon: <FaTwitter />, label: "Twitter" },
                { icon: <FaInstagram />, label: "Instagram" },
                { icon: <FaLinkedin />, label: "LinkedIn" }
              ].map((social, index) => (
                <a
                  key={index}
                  href="https://www.instagram.com/lc_microfiserv?igsh=cXVyNGVjcWg3ZG56"
                  className="text-gray-400 hover:text-cyan-400 transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Life Comrade MicroFinserve. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;