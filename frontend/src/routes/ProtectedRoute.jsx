import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  localStorage.getItem("accessToken");
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
