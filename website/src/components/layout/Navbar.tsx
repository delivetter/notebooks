import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { FaRobot, FaBars, FaHome, FaInfoCircle, FaChartBar, FaPlayCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import myRobotIcon from "@/assets/logo.png";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const links = [
    { href: "/", label: "Home", icon: <FaHome /> },
    { href: "/about", label: "About", icon: <FaInfoCircle /> },
    { href: "/comparison", label: "Comparison", icon: <FaChartBar /> },
    { href: "/simulation", label: "Simulation", icon: <FaPlayCircle /> },
  ];

  return (
    <nav className={`fixed w-full z-10 transition-all duration-300 ${
      scrolled ? "bg-white/95 backdrop-blur-sm shadow-md" : "bg-white/90"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative overflow-hidden p-1">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.7 }}
                >
                  <img
                    src={myRobotIcon}
                    alt="Urban Delivery Logo"
                    className="h-10 w-8 transition-transform"
                  />
                </motion.div>
              </div>
              <span className="font-bold text-lg text-gray-800 group-hover:text-primary transition-colors duration-200">
                Delivetter
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center px-4 py-2 rounded-full font-medium transition-all ${
                  location === link.href 
                    ? "bg-primary/10 text-primary" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none transition-colors"
              aria-label="Toggle mobile menu"
            >
              <FaBars className="text-xl" />
            </button>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/90 backdrop-blur-sm shadow-lg border-t border-gray-100">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-3 py-3 rounded-lg text-base font-medium ${
                    location === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-3 text-lg">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
