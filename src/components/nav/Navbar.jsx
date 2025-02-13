import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import Logo from "../Logo";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [user] = useAuthState(auth);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact-Us", path: "/contact" },
  ];

  // Profile Icon: shows first letter of user's display name or email
  const profileIcon = (
    <Link to="/profile">
      <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">
        {user && (user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase())}
      </div>
    </Link>
  );

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center justify-between h-16">
            <Logo />
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-3 py-2 text-sm font-medium transition-all ${
                  location.pathname === item.path
                    ? "text-cyan-400"
                    : "text-gray-300 hover:text-cyan-300"
                }`}
              >
                {item.name}
                {location.pathname === item.path && (
                  <span className="absolute inset-x-1 -bottom-2 h-0.5 bg-cyan-400 animate-underline" />
                )}
              </Link>
            ))}
            {user ? (
              profileIcon
            ) : (
              <Link to="/login">
                <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform">
                  Login/Signup
                </button>
              </Link>
            )}
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-cyan-400 transition-colors"
            >
              {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-gray-900/95 backdrop-blur-lg border-b border-gray-800">
          <div className="px-4 pt-2 pb-6 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 text-base font-medium ${
                  location.pathname === item.path
                    ? "text-cyan-400"
                    : "text-gray-300 hover:text-cyan-300"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <div onClick={() => setIsMenuOpen(false)}>{profileIcon}</div>
            ) : (
              <Link
                to="/login"
                className="w-full block bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-full text-base font-medium hover:scale-105 transition-transform text-center"
              >
                Login/Signup
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
