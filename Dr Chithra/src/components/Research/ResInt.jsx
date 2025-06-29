import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const ResInt = () => {
  const [interests, setInterests] = useState([]);
  const [heading, setHeading] = useState("");
  const [paragraph, setParagraph] = useState("");
  const { ref, inView } = useInView({ once: true });
  const controls = useAnimation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/research/interests`
        );
        if (response.data.data && response.data.data[0]) {
          const data = response.data.data[0];
          setInterests(data.interests || []);
          setHeading(data.heading || "");
          setParagraph(data.paragraph || "");
        }
      } catch (err) {
        console.error("Error fetching interests:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0, transition: { duration: 0.6 } });
    }
  }, [inView, controls]);

  return (
    <section id="research-interests" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.h2
          className="text-5xl font-bold text-gray-900 relative pb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
        >
          Research Interests
          <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-gradient-to-r from-blue-700 to-yellow-400"></span>
        </motion.h2>
        <h3 className="text-3xl font-bold text-gray-900 mt-12 mb-4">
          {heading}
        </h3>
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {interests.map((item, index) => (
              <div
                key={item.id}
                className="bg-gray-50 rounded-xl shadow-lg p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-3xl font-semibold text-gray-900 mb-4">
                  {item.heading}
                </h3>
                <p className="text-gray-600 text-lg">{item.description}</p>
              </div>
            ))}
          </div>

          <p className="text-xl text-gray-600 p-3">{paragraph}</p>
        </motion.div>
      </div>
    </section>
  );
};

export default ResInt;
