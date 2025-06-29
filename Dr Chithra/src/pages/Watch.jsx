import React, { useState, useEffect } from "react";
import { FaCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

const Watch = () => {
  const [data, setData] = useState({
    journals: [],
    competitions: [],
    reads: [],
    loading: true,
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [journals, competitions, reads] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/watch/journals`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/watch/competitions`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/watch/reads`),
        ]);

        setData({
          journals: journals.data.data || [],
          competitions: competitions.data.data || [],
          reads: reads.data.data || [],
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, []);

  const renderList = (items) => (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      className="space-y-4"
    >
      {items.map((item, index) => (
        <motion.li
          key={index}
          variants={itemVariants}
          className="flex items-start text-gray-700 text-lg relative z-10" // Added z-10 here
        >
          <FaCircle className="text-blue-600 mt-1 mr-3 text-sm flex-shrink-0" />
          {item.link ? (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {item.heading}
            </a>
          ) : (
            <span>{item.heading}</span>
          )}
        </motion.li>
      ))}
    </motion.ul>
  );

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Watch Out For
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl text-gray-600"
          >
            Upcoming events, seminars, and conferences
          </motion.p>
        </div>
      </section>

      {/* Journals Section */}
      <section className="py-16 px-6 bg-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          variants={sectionVariants}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <h2 className="text-5xl font-bold text-gray-900 mb-8 flex flex-col">
            Journals/Conferences
            <span className="w-20 h-1 bg-gradient-to-r from-blue-500 to-yellow-400 mt-2 rounded-full" />
          </h2>

          {data.loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            renderList(data.journals)
          )}
        </motion.div>
      </section>

      {/* Reads Section */}
      <section className="py-16 px-6 bg-gray-100">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          variants={sectionVariants}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <h2 className="text-5xl font-bold text-gray-900 mb-8 flex flex-col">
            Lighter Reads
            <span className="w-20 h-1 bg-gradient-to-r from-blue-500 to-yellow-400 mt-2 rounded-full" />
          </h2>

          {data.loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            renderList(data.reads)
          )}
        </motion.div>
      </section>

      {/* Competitions Section */}
      <section className="py-16 px-6 bg-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          variants={sectionVariants}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <h2 className="text-5xl font-bold text-gray-900 mb-8 flex flex-col">
            Yearly Student Competitions
            <span className="w-20 h-1 bg-gradient-to-r from-blue-500 to-yellow-400 mt-2 rounded-full" />
          </h2>

          {data.loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            renderList(data.competitions)
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default Watch;
