import { FaCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const Education = () => {
  const courses = [
    {
      title: "Post doctoral researcher, IIT Madras, 2021.",
    },
    {
      title: "M.S. + Ph.D. in mixed-signal IC design, IIT Madras, 2013-2020.",
    },
    {
      title:
        "B.E. (Hons.) Electrical and Electronics Engineering, BITS Pilani K. K. Birla Goa Campus, 2009-2013",
    },
  ];

  
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
    <section className="bg-white py-16 px-6">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading with underline */}
          <h2 className="text-5xl font-bold text-gray-900 mb-8 flex flex-col">
            Education and Experience
            <span className="w-20 h-1 bg-gradient-to-r from-blue-500 to-yellow-400 mt-2 rounded-full" />
          </h2>

          {/* Course list */}
          <motion.ul variants={containerVariants} className="space-y-4">
            {courses.map((course, index) => (
              <motion.li
                key={index}
                variants={itemVariants}
                className="flex items-start text-gray-700 text-lg"
              >
                <FaCircle className="text-blue-600 mt-1 mr-3 text-sm" />
                <span>{course.title}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </motion.div>
    </section>
  );
};

export default Education;
