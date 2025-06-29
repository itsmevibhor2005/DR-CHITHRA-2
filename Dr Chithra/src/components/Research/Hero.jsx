import React,{useEffect} from 'react';

import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Hero = () => {
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
    <section
      
      className="pt-24 pb-16 bg-gradient-to-b from-gray-100 to-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          initial={initial}
          animate={controls}
        >
          Research
        </motion.h1>
        <motion.p
          className="text-2xl text-gray-600"
          initial={initial}
          animate={controls}
          transition={{ delay: 0.2 }}
        >
          Pioneering integrated circuit and system design for frequency and
          delay synthesis
        </motion.p>
      </div>
    </section>
  );
};

export default Hero;
