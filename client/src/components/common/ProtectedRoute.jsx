import { Navigate, useLocation } from 'react-router-dom';
import { AuthService } from '../../api';

/**
 * ProtectedRoute component that checks authentication before rendering children
 * Redirects unauthenticated users to login page
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = AuthService.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to login page, preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
