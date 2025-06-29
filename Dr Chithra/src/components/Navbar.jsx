import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Research", path: "/research" },
    { name: "Teaching", path: "/teaching" },
    { name: "Publications", path: "/publications" },
    { name: "Watch Out For", path: "/watch-out-for" },
  ];

  const linkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <nav
      className={`fixed top-0 w-full z-30 transition-colors duration-300 border-b border-gray-200 shadow-sm ${
        scrolled ? "bg-white" : "bg-white/80 backdrop-blur"
      }`}
      role="navigation"
      aria-label="Main"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-gray-900 font-sans">
            Dr. Chithra
          </div>

          {/* Hamburger Icon */}
          <button
            className="md:hidden flex flex-col justify-center items-center"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <motion.span
              animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-blue-700 mb-1 rounded origin-center"
            />
            <motion.span
              animate={{ opacity: isOpen ? 0 : 1 }}
              className="w-6 h-0.5 bg-blue-700 mb-1 rounded"
            />
            <motion.span
              animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-blue-700 rounded origin-center"
            />
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8 text-lg font-medium font-sans">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                custom={index}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `relative group transition transform duration-200 ease-in-out ${
                      isActive ? "text-blue-700" : "text-gray-700"
                    } hover:text-blue-700 hover:scale-105`
                  }
                  aria-current={({ isActive }) =>
                    isActive ? "page" : undefined
                  }
                >
                  <span className="inline-block relative">
                    {item.name}
                    <span
                      className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-400 transition-all duration-300 group-hover:w-full"
                      aria-hidden="true"
                    />
                  </span>
                </NavLink>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden flex flex-col w-full bg-white px-4 pt-4 pb-6 shadow-md"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                custom={index}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
              >
                <NavLink
                  to={item.path}
                  onClick={toggleMenu}
                  className={({ isActive }) =>
                    `block py-2 text-lg font-medium font-sans transition transform duration-200 ease-in-out ${
                      isActive ? "text-blue-700" : "text-gray-700"
                    } hover:text-blue-700 hover:scale-105 relative group`
                  }
                  aria-current={({ isActive }) =>
                    isActive ? "page" : undefined
                  }
                >
                  <span className="inline-block relative">
                    {item.name}
                    <span
                      className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-400 transition-all duration-300 group-hover:w-full"
                      aria-hidden="true"
                    />
                  </span>
                </NavLink>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
