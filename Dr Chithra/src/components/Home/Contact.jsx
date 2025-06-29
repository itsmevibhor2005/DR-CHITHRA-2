import React from 'react'
import { FaCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const Contact = () => {
    const containerVariants = {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.2,
          delayChildren: 0.3,
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    };
  return (
    <section id='contact' className="bg-white py-16 px-6">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading with underline */}
          <h2 className="text-5xl font-bold text-gray-900 mb-8 flex flex-col">
            Contact Me
            <span className="w-20 h-1 bg-gradient-to-r from-blue-500 to-yellow-400 mt-2 rounded-full" />
          </h2>

          {/* Course list */}
          <motion.ul variants={containerVariants} className="space-y-4">
            <motion.li variants={itemVariants} flex items-start>
              <span
                className="font-semibold text-gray-700
              text-lg"
              >
                Email:{" "}
              </span>
              <a
                href="#"
                className="text-gray-700
              text-lg"
              >
                chithra@iitk.ac.in
              </a>
            </motion.li>
            <motion.li variants={itemVariants} className="flex items-start">
              <span
                className="font-semibold text-gray-700
              text-lg"
              >
                Office:{"  "}
              </span>
              <p
                className="text-gray-700
              text-lg"
              >
                WL 211, Dept. of Electrical Engineering, IIT Kanpur Kanpur,
                Uttar Pradesh, India - 208016.
              </p>
            </motion.li>
            <motion.li variants={itemVariants} className="flex items-start">
              <span
                className="font-semibold text-gray-700
              text-lg"
              >
                Office Number:{" "}
              </span>
              <p
                className="text-gray-700
              text-lg"
              >
                (+91)512-679-2199
              </p>
            </motion.li>
          </motion.ul>
        </div>
      </motion.div>
    </section>
  );
}

export default Contact
