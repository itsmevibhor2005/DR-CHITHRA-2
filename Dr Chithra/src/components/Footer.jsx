import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0e1624] text-gray-300 py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left Section */}
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Dr. Chithra</h2>
          <p className="text-gray-400">Assistant Professor, IIT Kanpur</p>

          <Link
            to="/login"
            className="hover:underline hover:text-white transition-all"
          >
            Admin Login
          </Link>
        </div>

        {/* Middle Section - Quick Links */}
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <Link
                to="/research"
                className="hover:underline hover:text-white transition-all"
              >
                Research
              </Link>
            </li>
            <li>
              <Link to="/teaching" className="hover:underline hover:text-white">
                Teaching
              </Link>
            </li>
            <li>
              <Link
                to="/publications"
                className="hover:underline hover:text-white"
              >
                Publications
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Section - Connect */}
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Connect</h2>
          <p>
            Email:{" "}
            <a href="mailto:chithra@iitk.ac.in" className="hover:underline">
              chithra@iitk.ac.in
            </a>
          </p>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="text-center text-sm text-gray-500 mt-10">
        © 2025 Dr. Chithra, IIT Kanpur. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
