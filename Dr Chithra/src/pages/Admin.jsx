import { useState, useEffect } from "react";
import Research from "../components/Admin/Research";
import Courses from "../components/Admin/Courses";
import Publications from "../components/Admin/Publications";
import WatchOutFor from "../components/Admin/WatchOutFor";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isTokenExpired } from "../utils/authUtils"; // Make sure you have this utility


const Admin = () => {
  const [activeTab, setActiveTab] = useState("research");
  const navigate = useNavigate();

  // Protect the route
  useEffect(() => {
    const token = localStorage.getItem("admin-token");

    if (!token) {
      toast.error("Please login to access admin panel");
      navigate("/login");
      return;
    }

    if (isTokenExpired(token)) {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("admin-token");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem("admin-token");
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("admin-token");
      navigate("/login");
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case "research":
        return <Research />;
      case "courses":
        return <Courses />;
      case "publications":
        return <Publications />;
      case "watch-out-for":
        return <WatchOutFor />;
      default:
        return <Research />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 pt-[75px] pb-5 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Dr. Chithra</span>
            <button
              onClick={handleLogout}
              className="bg-blue-600 rounded-md text-white p-2 hover:bg-blue-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md h-screen sticky top-0">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Navigation</h2>
          </div>
          <nav className="mt-4">
            {[
              { id: "research", name: "Research" },
              { id: "courses", name: "Courses" },
              { id: "publications", name: "Publications" },
              { id: "watch-out-for", name: "Watch Out For" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-6 py-3 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <main className="flex-1 p-8">{renderTab()}</main>
      </div>
    </div>
  );
};

export default Admin;
