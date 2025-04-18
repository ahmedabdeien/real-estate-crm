// src/utils/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const ProtectedRoute = ({ allowedRoles }) => {
  const { token, role } = useAuthStore();
  const location = useLocation();

  if (!token) {
    // لو مفيش توكن → redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // لو الدور مش من ضمن الأدوار المسموح بها → unauthorized
    return <Navigate to="/unauthorized" replace />;
  }

  // المستخدم مسموح له → اعرض العنصر
  return <Outlet />;
};

export default ProtectedRoute;
