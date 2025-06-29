import React, { useEffect } from "react";

import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
const Opportunities = () => {
    const useAnimateOnInView = (delay = 0) => {
      const ref = React.useRef(null);
      const isInView = useInView(ref, { once: true, amount: 0.1 });
      const controls = useAnimation();

      useEffect(() => {
        if (isInView) {
          controls.start({
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut", delay },
          });
        }
      }, [isInView, controls, delay]);
      return { ref, controls, initial: { opacity: 0, y: 20 } };
    };
    const { ref, controls, initial } = useAnimateOnInView();

    return (
      <section id="opportunities" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
          <motion.h2
            className="text-5xl font-bold text-gray-900  relative pb-4"
            initial={initial}
            animate={controls}
          >
            Opportunities
            <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-gradient-to-r from-blue-700 to-yellow-400"></span>
          </motion.h2>
          <motion.div
            className="mt-12"
            initial={initial}
            animate={controls}
            transition={{ delay: 0.2 }}
          >
            <p className="text-xl text-gray-600 mb-4">
              I am looking for motivated PhD students and postdoctoral
              researchers to join my group. If you are interested in working on
              cutting-edge problems in integrated circuit and system design,
              please reach out.
            </p>
            <p className="text-lg text-gray-600">
              <strong>Contact:</strong>{" "}
              <a
                href="mailto:chithra@iitk.ac.in"
                className="text-blue-600 hover:underline"
              >
                chithra@iitk.ac.in
              </a>
            </p>
          </motion.div>
        </div>
      </section>
    );
};

export default Opportunities;
