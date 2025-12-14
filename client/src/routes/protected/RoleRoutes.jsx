import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RoleRoutes = ({ allowedRoles, children }) => {
  const user = useSelector((state) => state.user.user);

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed
  if (!allowedRoles.includes(user.role)) {
     return <Navigate to={`/${user.role}/dashboard`} replace />;
    // return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleRoutes;
