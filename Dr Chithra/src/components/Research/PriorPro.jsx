import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const moveCarousel = (direction) => {
    setCurrentIndex(
      (prev) => (prev + direction + images.length) % images.length
    );
  };

  if (!images.length) return null;

  return (
    <div className="relative">
      <motion.div
        className="flex"
        animate={{ x: `-${currentIndex * 100}%` }}
        transition={{ duration: 0.5 }}
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img.url}
            alt="project"
            className="w-full h-48 object-cover flex-shrink-0"
          />
        ))}
      </motion.div>
      <div
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full cursor-pointer"
        onClick={() => moveCarousel(-1)}
      >
        ❮
      </div>
      <div
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full cursor-pointer"
        onClick={() => moveCarousel(1)}
      >
        ❯
      </div>
    </div>
  );
};

const PriorPro = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/research/projects`
        );
        setProjects(response.data.data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section id="prior-projects" className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 className="text-5xl font-bold text-gray-900 mb-12">
          Prior Projects
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {project.images && project.images.length > 0 && (
                <Carousel images={project.images} />
              )}
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2">
                  {project.heading}
                </h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PriorPro;
