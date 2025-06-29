import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResearchInterests() {
  const navigate = useNavigate();
  const { ref, inView } = useInView({ triggerOnce: true });
  const [hasAnimated, setHasAnimated] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (inView && !hasAnimated) setHasAnimated(true);
  }, [inView]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/research/projects`
        );
        setItems(
          (response.data.data || []).map((project) => ({
            title: project.heading,
            description: project.description,
            image: project.images?.[0]?.url || "",
          }))
        );
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, []);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="bg-gray-100 px-6 py-10">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-5xl font-bold text-gray-900 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-bold section-title">Prior Researches</h2>
          <span className="block h-1 w-28 bg-gradient-to-r from-blue-500 to-yellow-400 mt-2 rounded-full" />
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={hasAnimated ? "visible" : "hidden"}
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              className="relative group p-6 rounded-2xl bg-white shadow-md cursor-pointer overflow-hidden"
              onClick={() => navigate("/research")}
            >
              <h3 className="text-xl group-hover:opacity-0 font-bold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 group-hover:opacity-0 line-clamp-3">
                {item.description}
              </p>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 object-cover w-full h-full opacity-30"
                  />
                )}
                <span className="text-white text-lg font-semibold z-10">
                  Click to know more ...
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
