import { useState, useEffect } from "react"
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import axios from "axios";

const PublicationCard = ({ children, delay }) => (
  <motion.div
    className="card bg-gray-50 rounded-xl shadow-lg p-6"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);
const Publications = () => {
  const [journals, setJournals] = useState([]);
  const [conferences, setConferences] = useState([]);
  const [thesis, setThesis] = useState([]);
  const [patents, setPatents] = useState([]);


  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/publications/journals`
        );
        // const { journals, conferences, thesis, patents } = response.data;

        // console.log(response.data.data);
        // setJournals(journals);
        // setConferences(conferences);
        // setThesis(thesis);
        // setPatents(patents);
        setJournals(response.data.data);
        console.log("Publications fetched successfully:", response.data.data);
      } catch (error) {
        console.error("Error fetching publications:", error);
      }
    };

    const fetchConferences = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/publications/conferences`
        );
        setConferences(response.data.data);
        console.log("Conferences fetched successfully:", response.data.data);
      } catch (error) {
        console.error("Error fetching conferences:", error);
      }
    };
    const fetchThesis = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/publications/thesis`
        );
        setThesis(response.data.data);
        console.log("Thesis fetched successfully:", response.data.data);
      } catch (error) {
        console.error("Error fetching thesis:", error);
      }
    };
    const fetchPatents = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/publications/patents`
        );
        setPatents(response.data.data);
        console.log("Patents fetched successfully:", response.data.data); 
      } catch (error) {
        console.error("Error fetching patents:", error);
      }
    };
    fetchJournals(), fetchConferences(), fetchThesis(), fetchPatents();
  }, []);

  return (
    <div>
      <section
        id="publications-hero"
        className="pt-24 pb-16 bg-gradient-to-b from-gray-100 to-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Publications
            </h1>
            <p className="text-xl text-gray-600">
              Selected works in integrated circuit and system design
            </p>
          </motion.div>
        </div>
      </section>
      <section id="journals" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-5xl font-bold text-gray-900 section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Journal Publications
          </motion.h2>
          <div className="mt-12 space-y-6">
            {journals.map((pub, idx) => (
              <PublicationCard delay={idx * 0.2} key={idx}>
                <p className="text-gray-600 text-xl">
                  <span className="font-semibold">{pub.heading}</span>, "
                  {pub.description},"
                  <a
                    href={pub.link}
                    target="_blank"
                    className="text-blue-600 hover:underline ml-2"
                  >
                    [Link]
                  </a>
                </p>
              </PublicationCard>
            ))}
          </div>
        </div>
      </section>

      {/* Conferences Section */}
      <section id="conferences" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-5xl font-bold text-gray-900 section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Conference Publications
          </motion.h2>
          <div className="mt-12 space-y-6">
            {conferences.map((pub, idx) => (
              <PublicationCard delay={idx * 0.2} key={idx}>
                <p className="text-gray-600 text-xl">
                  <span className="font-semibold">{pub.heading}</span>, "
                  {pub.description},"
                  <a
                    href={pub.link}
                    target="_blank"
                    className="text-blue-600 hover:underline ml-2"
                  >
                    [Link]
                  </a>
                </p>
              </PublicationCard>
            ))}
          </div>
        </div>
      </section>

      {/* Thesis Section */}
      <section id="thesis" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-5xl font-bold text-gray-900 section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Thesis
          </motion.h2>
          <div className="mt-12 space-y-6">
            {thesis.map((pub, idx) => (
              <PublicationCard delay={idx * 0.2} key={idx}>
                <p className="text-gray-600 text-xl">
                  <span className="font-semibold">{pub.heading}</span>, "
                  {pub.description},"
                  <a
                    href={pub.link}
                    target="_blank"
                    className="text-blue-600 hover:underline ml-2"
                  >
                    [Link]
                  </a>
                </p>
              </PublicationCard>
            ))}
            <PublicationCard delay={0}>
              <p className="text-gray-600 text-xl">
                {thesis.length == 0 ? (<span>No thesis publications are listed at this time. </span>) : ""}
                 Please check my{" "}
                <a
                  href="https://scholar.google.com/citations?user=Oe4f0JcAAAAJ"
                  className="text-blue-600 hover:underline"
                >
                  Google Scholar profile
                </a>{" "}
                for any updates.
              </p>
            </PublicationCard>
          </div>
        </div>
      </section>

      {/* Patents Section */}
      <section id="patents" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-5xl font-bold text-gray-900 section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Patents
          </motion.h2>
          <div className="mt-12 space-y-6">
            {patents.map((pub, idx) => (
              <PublicationCard delay={idx * 0.2} key={idx}>
                <p className="text-gray-600 text-xl">
                  <span className="font-semibold">{pub.heading}</span>, "
                  {pub.description},"
                  <a
                    href={pub.link}
                    target="_blank"
                    className="text-blue-600 hover:underline ml-2"
                  >
                    [Link]
                  </a>
                </p>
              </PublicationCard>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Information Section */}
      <section id="additional-info" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="text-gray-600 text-xl">
              For a complete list of publications, visit my{" "}
              <a
                href="https://scholar.google.com/citations?user=Oe4f0JcAAAAJ"
                className="text-blue-600 hover:underline"
              >
                Google Scholar profile
              </a>
              .
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Publications
