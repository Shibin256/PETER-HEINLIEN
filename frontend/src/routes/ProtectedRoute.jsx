import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  console.log(user, 'isAuthenticated in ProtectedRoute');
  const token = localStorage.getItem('accessToken');
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
