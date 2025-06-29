import React from 'react'
import { motion } from 'framer-motion'

const About = () => {
    const aboutVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } },
    };
    return (
      <section className="py-10 px-6 bg-white">
        <motion.div
          className="bg-white text-gray-900 py-16"
          variants={aboutVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl font-bold section-title">About Me</h2>
            <span className="block h-1 w-28 bg-gradient-to-r from-blue-500 to-yellow-400 mt-2 rounded-full" />

            <p className="text-lg text-gray-600 mt-6 max-w-5xl">
              I am an Assistant Professor in the microelectronics and VLSI group
              in the Department of Electrical Engineering at the Indian
              Institute of Technology Kanpur. My research areas include analog
              and mixed-signal VLSI design, digital VLSI design, frequency and
              phase synthesizers, time-to-digital converters, and
              digital-to-time converters.
            </p>
            <p className="text-lg text-gray-600 mt-6 max-w-5xl">
              I completed my M.S. + Ph.D. from IIT Madras under the guidance of
              Prof. Nagendra Krishnapura. During my Ph.D., I worked on a 125ps
              resolution, multi-channel time-to-digital converter for the
              India-based neutrino observatory. Before this, I completed my B.E.
              (Hons.) in Electrical and Electronics Engineering from BITS Pilani
              K. K. Birla Goa Campus.
            </p>
          </div>
        </motion.div>
      </section>
    );
}

export default About
