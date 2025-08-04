// routes/PublicOnlyRoute.jsx
import { Navigate } from "react-router-dom";

const PublicOnlyRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  return token ? <Navigate to="/" replace /> : children;
};

export default PublicOnlyRoute;
