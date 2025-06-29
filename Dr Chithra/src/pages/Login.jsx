import { useState, useEffect } from "react"
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { AnimatePresence } from "framer-motion";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { isTokenExpired } from "../utils/authUtils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const HeroSection = () => (
  <motion.section
    id="admin-login-hero"
    className="pt-24 pb-16 bg-gradient-to-b from-gray-100 to-gray-200"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.h1
        className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Admin Login
      </motion.h1>
      <motion.p
        className="text-xl text-gray-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        Access the admin dashboard to manage content
      </motion.p>
    </div>
  </motion.section>
);
const Login = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (token && !isTokenExpired(token)) {
      navigate("/admin");
    }
  }, [navigate]);
  

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetSent, setResetSent] = useState(false);

    
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      try {
        const userCred = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const idToken = await userCred.user.getIdToken();

        console.log("Firebase auth successful, ID token:", idToken);

        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
          {
            idToken,
          }
        );

        // console.log("Backend response:", response.data);
        localStorage.setItem("admin-token", idToken);
        toast.success("Login successful! Redirecting...", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Navigate after toast is shown
        setTimeout(() => navigate("/admin"), 2000);
        
      } catch (err) {
        console.error("Login error:", err);

        // Determine error message
        let errorMessage = "Login failed. Please try again.";
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message.includes("auth/invalid-credential")) {
          errorMessage = "Invalid email or password";
        } else if (err.message.includes("auth/too-many-requests")) {
          errorMessage =
            "Account temporarily locked due to many failed attempts";
        }

        // Show error toast
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        setError(errorMessage);
        await auth.signOut();
      }
    };

    const handlePasswordReset = async () => {
      try {
        if (!resetEmail) {
          toast.error("Please enter your email address");
          return;
        }

        await sendPasswordResetEmail(auth, resetEmail);
        setResetSent(true);
        toast.success("Password reset email sent! Check your inbox.", {
          position: "top-right",
          autoClose: 5000,
        });
      } catch (error) {
        console.error("Password reset error:", error);
        let errorMessage = "Failed to send reset email. Please try again.";

        if (error.code === "auth/user-not-found") {
          errorMessage = "No account found with this email address.";
        }

        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    };
  return (
    <>
      <ToastContainer />
      <HeroSection />

      <AnimatePresence>
        {showResetPassword && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-xl w-96"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className="text-xl font-bold mb-4">
                {resetSent ? "Check your email" : "Reset Password"}
              </h2>

              {resetSent ? (
                <>
                  <p className="mb-4">
                    We've sent a password reset link to{" "}
                    <strong>{resetEmail}</strong>. Please check your inbox.
                  </p>
                  <button
                    onClick={() => {
                      setShowResetPassword(false);
                      setResetSent(false);
                    }}
                    className="w-full bg-blue-600 text-white py-2 rounded"
                  >
                    Return to Login
                  </button>
                </>
              ) : (
                <>
                  <p className="mb-4">
                    Enter your email address and we'll send you a link to reset
                    your password.
                  </p>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full p-2 border rounded mb-4"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handlePasswordReset}
                      className="flex-1 bg-blue-600 text-white py-2 rounded"
                    >
                      Send Reset Link
                    </button>
                    <button
                      onClick={() => setShowResetPassword(false)}
                      className="flex-1 bg-gray-200 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.section
        id="admin-login"
        className="py-20 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <motion.div
              className="bg-gray-50 rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Login
              </h2>
              {error && (
                <div className="mb-4 text-red-500 text-center">{error}</div>
              )}
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                    placeholder="Enter your Email"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm hover:cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={handleSubmit}
                    className="submit-btn w-full bg-blue-600 hover:cursor-pointer text-white font-semibold py-2 rounded-lg"
                  >
                    Log In
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </>
  );
}

export default Login
