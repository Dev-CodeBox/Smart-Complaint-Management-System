import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const admin_token = localStorage.getItem("admin_token");

  return admin_token ? <Outlet /> : <Navigate to="/admin" />;
};

export default AdminProtectedRoute;
