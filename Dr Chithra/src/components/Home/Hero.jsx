import React from "react";
import heroBg from "../../assets/bg.jpg";
import img from "../../assets/chithra.jpg";
import { motion } from "framer-motion";

const HeroSection = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      const headerOffset = 100;
      const elementPosition = contactSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };
  

  return (
    <section
      className="relative bg-black text-white min-h-screen flex items-center"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-12 px-6 max-w-6xl mx-auto">
        {/* Left Content (Text) */}
        <motion.div
          className="space-y-6 text-center md:text-left"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Dr. Chithra
          </motion.h1>

          <p className="text-xl font-medium">
            Assistant Professor, Department of Electrical Engineering, IIT
            Kanpur
          </p>
          <p className="text-lg max-w-xl">
            Pioneering research in Signal Processing, Machine Learning, and
            Communications
          </p>

          <motion.button
            onClick={scrollToContact}
            className="inline-block bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-yellow-500 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get in Touch
          </motion.button>
        </motion.div>

        {/* Right Content (Image) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          <img
            src={img}
            alt="Dr. Chithra"
            className="w-[250px] h-[250px] rounded-full object-cover border-4 border-white shadow-xl"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
