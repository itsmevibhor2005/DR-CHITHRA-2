import { Navigate } from "react-router-dom";
import { isTokenExpired } from "../utils/authUtils";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("admin-token");

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("admin-token");
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
