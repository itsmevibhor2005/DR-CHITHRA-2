import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import axios from "axios";

const CourseDrawer = ({ course, index, setModalVideo }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => setIsOpen(!isOpen);

  return (
    <motion.div
      className="bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
    >
      <div
        className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={toggleDrawer}
      >
        <h3 className="text-2xl font-semibold text-gray-900">
          {course.course_name}
        </h3>
        <motion.span
          className="text-blue-600 text-2xl"
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ▶
        </motion.span>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="p-6 pt-0"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-gray-600 mb-4">{course.description}</p>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Prerequisites:
            </h4>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              {(course.prerequisites || []).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Resources:
            </h4>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              {(course.resources || []).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Venue:</h4>
            <p className="text-gray-600 mb-4">{course.venue}</p>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              References:
            </h4>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              {(course.references || []).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Lectures:
            </h4>
            <div className="space-y-2 mb-4">
              {(course.lectures || []).map((lecture, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <p className="text-gray-600">{lecture.name}</p>
                  <div className="flex space-x-2">
                    {lecture.pdf && (
                      <a
                        href={lecture.pdf}
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        [PDF]
                      </a>
                    )}
                    {lecture.video && (
                      <button
                        onClick={() => setModalVideo(lecture.video)}
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        [Video]
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Teaching = () => {
  const [courses, setCourses] = useState([]);
  const [modalVideo, setModalVideo] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/courses`
        );
        const rawData = response.data?.data || [];

        const data = rawData.map((course) => ({
          ...course,
          prerequisites: Array.isArray(course.prerequisites)
            ? course.prerequisites
            : JSON.parse(course.prerequisites || "[]"),
          references: Array.isArray(course.references)
            ? course.references
            : JSON.parse(course.references || "[]"),
          resources: Array.isArray(course.resources)
            ? course.resources
            : JSON.parse(course.resources || "[]"),
          lectures: Array.isArray(course.lectures)
            ? course.lectures
            : JSON.parse(course.lectures || "[]"),
        }));

        setCourses(data);
      } catch (err) {
        console.error("Error fetching or parsing courses:", err);
      }
    };

    fetchCourses();
  }, []);

  const formatYoutubeUrl = (url) => {
    if (!url) return "";

    // If already an embed URL, return as-is
    if (url.includes("youtube.com/embed")) {
      return url;
    }

    // Convert watch URL to embed URL
    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1];
      const ampersandPosition = videoId.indexOf("&");
      if (ampersandPosition !== -1) {
        return `https://www.youtube.com/embed/${videoId.substring(
          0,
          ampersandPosition
        )}`;
      }
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Handle youtu.be short URLs
    if (url.includes("youtu.be")) {
      const videoId = url.split("/").pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  };

  const openModal = (videoUrl) => {
    setModalVideo(formatYoutubeUrl(videoUrl));
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalVideo(null);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="bg-gray-50">
      <section
        id="teaching-hero"
        className="pt-24 pb-16 bg-gradient-to-b from-gray-100 to-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Teaching
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Courses in integrated circuit design and related fields
          </motion.p>
        </div>
      </section>

      <section id="teaching" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-4xl font-bold text-gray-900 section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Courses Taught
          </motion.h2>
          <div className="mt-12 space-y-4">
            {courses.map((course, index) => (
              <CourseDrawer
                key={index}
                course={course}
                index={index}
                setModalVideo={openModal}
              />
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {modalVideo && (
          <motion.div
            className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-white p-5 rounded-lg w-full flex justify-center items-center h-[75vh] max-w-3xl relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <span
                className="absolute top-2 right-5 text-3xl cursor-pointer text-blue-600 hover:text-yellow-400"
                onClick={closeModal}
              >
                ×
              </span>
              <iframe
                className="modal-iframe h-[90%] w-[90%] rounded-lg"
                src={modalVideo}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="YouTube video player"
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Teaching;
