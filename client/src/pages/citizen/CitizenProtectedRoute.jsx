import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const UserProtectedRoute = () => {
  const citizen_token = localStorage.getItem("citizen_token");

  return citizen_token ? <Outlet /> : <Navigate to="/citizen" />;
};

export default UserProtectedRoute;
