import { Navigate } from "react-router-dom";
import useAuthStore from '../store/useAuthStore';

const AdminRoute = ({ children }) => {
  const { role } = useAuthStore();
    return role === 'admin' ? children : <Navigate to="/unauthorized" />;

  };

  export default AdminRoute;
  